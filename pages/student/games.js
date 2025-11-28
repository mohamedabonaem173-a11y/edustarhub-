// pages/student/games.js - FINALIZED CODE WITH ARENA SYSTEM AND RANKING

import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 

// Game Constants (Unchanged)
const STARTING_KING_HEALTH = 100;
const STARTING_TOWER_HEALTH = 75; 
const STARTING_ENERGY = 3;
const ENERGY_RECHARGE = 1;
const CARD_COST = 1; 
const CANNON_DAMAGE = 15; 
const DEFENSE_DAMAGE = 10; 

// --- ARENA DEFINITIONS (NEW) ---
const ARENAS = [
    { name: 'The Graveyard', minPoints: 0, winBonus: 100, losePenalty: 50, themeColor: 'bg-gray-700' },
    { name: 'The Cursed Crypt', minPoints: 500, winBonus: 120, losePenalty: 60, themeColor: 'bg-purple-800' },
    { name: 'The Spectral Citadel', minPoints: 1000, winBonus: 140, losePenalty: 70, themeColor: 'bg-indigo-800' },
    { name: 'The Forbidden Spire', minPoints: 1500, winBonus: 160, losePenalty: 80, themeColor: 'bg-pink-800' },
    { name: 'The Eternal Throne', minPoints: 2000, winBonus: 180, losePenalty: 90, themeColor: 'bg-yellow-800' },
];

export default function StudentGames() {
    const role = 'student';
    const [session, setSession] = useState(null);
    const [gamePoints, setGamePoints] = useState(0); // Total points tracked in profile
    const [quizzes, setQuizzes] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // Game State
    const [playerHealth, setPlayerHealth] = useState(STARTING_KING_HEALTH);
    const [opponentHealth, setOpponentHealth] = useState(STARTING_KING_HEALTH);
    const [playerTowerHealth, setPlayerTowerHealth] = useState(STARTING_TOWER_HEALTH);
    const [opponentTowerHealth, setOpponentTowerHealth] = useState(STARTING_TOWER_HEALTH);
    const [playerEnergy, setPlayerEnergy] = useState(STARTING_ENERGY);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [gameStatus, setGameStatus] = useState('lobby'); 
    const [answerInput, setAnswerInput] = useState('');
    const [turnMessage, setTurnMessage] = useState('Welcome to the Spectral Study Duel!');
    const [questionHistory, setQuestionHistory] = useState([]); 
    const [lastAction, setLastAction] = useState({ type: null, value: null }); 

    // --- ARENA CALCULATION (NEW) ---
    const currentArena = useMemo(() => {
        let arena = ARENAS[0];
        for (const a of ARENAS) {
            if (gamePoints >= a.minPoints) {
                arena = a;
            }
        }
        return arena;
    }, [gamePoints]);


    // --- 1. Fetch Session, Game Points, and Quizzes (UNCHANGED) ---
    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            
            if (currentSession?.user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('game_points')
                    .eq('id', currentSession.user.id)
                    .single();
                
                if (profileData) {
                    setGamePoints(profileData.game_points || 0);
                }
            }
            
            const { data: quizData, error: quizError } = await supabase
                .from('quizzes')
                .select('quiz_data');
            
            if (quizError) console.error("Error fetching quizzes:", quizError);
            
            let questionPool = [];
            if (quizData) {
                quizData.forEach(quiz => {
                    if (quiz.quiz_data && Array.isArray(quiz.quiz_data)) {
                        questionPool = questionPool.concat(quiz.quiz_data.map(q => ({
                            ...q,
                            id: Math.random().toString(36).substring(2, 9) + q.text.substring(0, 5),
                        })));
                    }
                });
            }
            setQuizzes(questionPool);
            setLoading(false);
        }
        loadInitialData();
    }, []); 

    // --- 2. Game Logic ---

    // Updated awardPoints to handle win/loss outcome points
    const updatePointsForOutcome = useCallback(async (isWin) => {
        if (!session?.user) return;
        
        let pointChange;
        let message;
        
        if (isWin) {
            pointChange = currentArena.winBonus;
            message = `You earned ${pointChange} points for winning!`;
        } else {
            // Apply loss penalty, but ensure points don't go below 0
            pointChange = -currentArena.losePenalty;
            message = `You lost ${Math.abs(pointChange)} points for the defeat.`;
        }

        const newPoints = Math.max(0, gamePoints + pointChange);
        
        // Check for Arena promotion/demotion
        const oldArena = currentArena;
        const newArena = ARENAS.slice().reverse().find(a => newPoints >= a.minPoints) || ARENAS[0];

        if (newArena.name !== oldArena.name) {
            message += isWin 
                ? ` CONGRATULATIONS! You advanced to ${newArena.name}!`
                : ` DEMOTED! You fell back to ${newArena.name}.`;
        }

        await supabase
            .from('profiles')
            .update({ game_points: newPoints })
            .eq('id', session.user.id);
            
        setGamePoints(newPoints);
        return message; // Return the final message including rank changes
    }, [session?.user, gamePoints, currentArena]);


    const startGame = () => {
        if (quizzes.length === 0) {
            setTurnMessage('Cannot start: No quiz questions have been uploaded by teachers.');
            return;
        }
        setPlayerHealth(STARTING_KING_HEALTH);
        setOpponentHealth(STARTING_KING_HEALTH);
        setPlayerTowerHealth(STARTING_TOWER_HEALTH);
        setOpponentTowerHealth(STARTING_TOWER_HEALTH);
        setPlayerEnergy(STARTING_ENERGY);
        setQuestionHistory([]);
        setGameStatus('playing');
        setTurnMessage(`The Spectral Duel begins in ${currentArena.name}!`);
        setCurrentQuestion(null);
        setLastAction({ type: null, value: null });
    };

    // Helper for minor points awarded per correct answer during the match
    const awardMinorPoints = useCallback(async (points) => {
        if (!session?.user) return;
        const newPoints = gamePoints + points;
        
        await supabase
            .from('profiles')
            .update({ game_points: newPoints })
            .eq('id', session.user.id);
            
        setGamePoints(newPoints);
    }, [session?.user, gamePoints]);


    const getNewQuestion = () => {
        // ... (Question logic unchanged)
        if (questionHistory.length >= quizzes.length) {
            setQuestionHistory([]); 
        }

        const availableQuestions = quizzes.filter(q => !questionHistory.includes(q.id));
        if (availableQuestions.length === 0) {
            setTurnMessage('Ran out of questions! Opponent wins by default.');
            setGameStatus('lose');
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const newQuestion = availableQuestions[randomIndex];
        
        setCurrentQuestion(newQuestion);
        setQuestionHistory([...questionHistory, newQuestion.id]);
        setAnswerInput('');
        setTurnMessage('You summoned a **Grave Scroll**! Answer correctly to unleash its power.');
        setLastAction({ type: 'draw', value: null });
        return newQuestion;
    };
    
    const opponentTurn = () => {
        // ... (Opponent logic unchanged)
        setTimeout(() => {
            if (playerTowerHealth <= 0 && Math.random() < 0.5) {
                const damage = 5;
                setPlayerHealth(prev => Math.max(0, prev - damage));
                setTurnMessage(prev => prev + ` A **Ghastly Strike** hits your King for ${damage} damage!`);
                setLastAction({ type: 'opponent_attack_king', value: damage });
            } else if (playerTowerHealth > 0 && Math.random() < 0.3) {
                const damage = 3;
                setPlayerTowerHealth(prev => Math.max(0, prev - damage));
                setTurnMessage(prev => prev + ` A **Phantom Arrow** chips your Obelisk for ${damage} damage.`);
                setLastAction({ type: 'opponent_attack_tower', value: damage });
            } else {
                 setTurnMessage(prev => prev + ' The Specter retreats into the fog...');
                 setLastAction({ type: null, value: null });
            }
            
            setPlayerEnergy(prev => Math.min(10, prev + ENERGY_RECHARGE)); 

            if (playerHealth <= 0) {
                setGameStatus('lose');
                setTurnMessage('Your Spectral King\'s Health dropped to zero! The curse prevails.');
            }
        }, 1500);
    };

    // Main action: Playing a Card
    const handlePlayCard = (e) => {
        e.preventDefault();
        
        if (currentQuestion) {
            const isCorrect = answerInput.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
            
            if (isCorrect) {
                const damage = CANNON_DAMAGE;
                let residualDamage = damage;
                
                if (opponentTowerHealth > 0) {
                    setOpponentTowerHealth(prev => Math.max(0, prev - damage));
                    residualDamage = Math.max(0, damage - opponentTowerHealth);
                    setTurnMessage(`✅ Correct! Your **Spectral Cannon** fires! Enemy Obelisk takes ${damage} damage! +10 points.`);
                    setLastAction({ type: 'player_attack_tower', value: damage });
                }
                
                if (opponentTowerHealth - damage <= 0 && opponentHealth > 0) {
                    setOpponentHealth(prev => Math.max(0, prev - residualDamage));
                    setTurnMessage(prev => prev + ` OBELISK CRUMBLES! King takes ${residualDamage} damage.`);
                    setLastAction({ type: 'player_attack_king', value: residualDamage });
                }

                setPlayerEnergy(prev => prev - CARD_COST);
                awardMinorPoints(10); // Small point reward per correct answer
                
                if (opponentHealth - residualDamage <= 0) { 
                    setGameStatus('win');
                    // Final point update and message handled in useEffect
                    setCurrentQuestion(null);
                    return;
                }
                
            } else {
                const damage = DEFENSE_DAMAGE;
                let residualDamage = damage;

                setTurnMessage(`❌ Incorrect. The **Forbidden Tower** retaliates! You took ${damage} damage.`);
                setLastAction({ type: 'opponent_defense_fire', value: damage });
                
                if (playerTowerHealth > 0) {
                    setPlayerTowerHealth(prev => Math.max(0, prev - damage));
                    residualDamage = Math.max(0, damage - playerTowerHealth);
                }
                
                if (playerTowerHealth - damage <= 0 && playerHealth > 0) {
                    setPlayerHealth(prev => Math.max(0, prev - residualDamage)); 
                    setTurnMessage(prev => prev + ` YOUR OBELISK FELL! King takes ${residualDamage} damage.`);
                }

                setPlayerEnergy(prev => Math.max(0, prev - CARD_COST)); 
            }
            
            setCurrentQuestion(null);
            opponentTurn(); 
        }
    };
    
    // Check for game end and apply final arena points
    useEffect(() => {
        const handleGameEnd = async (isWin) => {
            setGameStatus(isWin ? 'win' : 'lose');
            const finalMessage = await updatePointsForOutcome(isWin);
            setTurnMessage(finalMessage); 
        };

        if (opponentHealth <= 0 && gameStatus === 'playing') {
            handleGameEnd(true);
        } else if (playerHealth <= 0 && gameStatus === 'playing') {
            handleGameEnd(false);
        }
    }, [opponentHealth, playerHealth, gameStatus, updatePointsForOutcome]);


    // Helper for Health Bar Color (Spooky Green/Purple/Red)
    const getHealthColor = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage > 60) return 'bg-green-400';
        if (percentage > 25) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    // --- 3. Render Functions (Updated for Arena Display) ---

    const renderGameScreen = () => {
        const playerTowerPct = (playerTowerHealth / STARTING_TOWER_HEALTH) * 100;
        const opponentTowerPct = (opponentTowerHealth / STARTING_TOWER_HEALTH) * 100;
        
        return (
            <div className={`rounded-xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto border-4 border-purple-800 transition-all duration-700 ${currentArena.themeColor}`}
                 style={{ backgroundImage: 'radial-gradient(circle at center, #3a0859 0%, #1a032d 100%)' }}>
                
                {/* --- ARENA TOP (OPPONENT SIDE) --- */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b-4 border-dashed border-purple-700 bg-red-900 bg-opacity-30 rounded-t-lg p-4">
                    
                    <div className={`w-1/4 text-center transition-all duration-500 p-2 ${opponentTowerHealth <= 0 ? 'opacity-50' : ''}`}>
                        <span className={`text-6xl block mb-2 ${opponentTowerHealth > 0 ? 'text-purple-400' : 'text-red-700'}`}>{opponentTowerHealth > 0 ? '⚰️' : '💥'}</span>
                        <h3 className="text-xl font-bold text-purple-300">Forbidden Tower</h3>
                        <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
                            <div className={`h-3 rounded-full transition-all duration-500 ${getHealthColor(opponentTowerHealth, STARTING_TOWER_HEALTH)}`} style={{ width: `${opponentTowerPct}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-300">{opponentTowerHealth} HP</span>
                    </div>

                    <div className="text-center w-1/4">
                        <span className={`text-6xl block mb-2 ${opponentHealth > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {opponentHealth > 0 ? '💀' : '🪦'}
                        </span>
                        <p className="text-xl font-bold text-red-300">Spectral King: {opponentHealth} HP</p>
                    </div>
                </div>

                {/* --- ARENA COMBAT LOG & ENERGY --- */}
                <div className="text-center p-3 bg-black bg-opacity-60 rounded-lg shadow-xl border-2 border-green-500 my-4">
                    <p className="font-semibold text-lg text-green-400">👻 Combat Scroll:</p>
                    <p className={`mt-1 text-md font-medium ${lastAction.type?.includes('player') ? 'text-green-300' : 'text-red-300'}`}>{turnMessage}</p>
                    <p className="mt-2 text-xl font-extrabold text-blue-400">Energy: {playerEnergy} / 10 🔮</p>
                </div>

                {/* --- ARENA BOTTOM (PLAYER SIDE) --- */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t-4 border-dashed border-purple-700 bg-green-900 bg-opacity-30 rounded-b-lg p-4">
                     
                    <div className="text-center w-1/4">
                        <span className={`text-6xl block mb-2 ${playerHealth > 0 ? 'text-green-500' : 'text-red-700'}`}>
                            {playerHealth > 0 ? '🧙' : '🪦'}
                        </span>
                        <p className="text-xl font-bold text-green-300">Your King: {playerHealth} HP</p>
                    </div>

                    <div className={`w-1/4 text-center transition-all duration-500 p-2 ${playerTowerHealth <= 0 ? 'opacity-50' : ''}`}>
                        <span className={`text-6xl block mb-2 ${playerTowerHealth > 0 ? 'text-green-500' : 'text-red-700'}`}>{playerTowerHealth > 0 ? '🕯️' : '💥'}</span>
                        <h3 className="text-xl font-bold text-green-400">Haunted Obelisk</h3>
                         <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
                            <div className={`h-3 rounded-full transition-all duration-500 ${getHealthColor(playerTowerHealth, STARTING_TOWER_HEALTH)}`} style={{ width: `${playerTowerPct}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-300">{playerTowerHealth} HP</span>
                    </div>
                </div>
                
                {/* --- Game Actions (Card/Question Area) --- */}
                <div className="mt-6">
                    {currentQuestion ? (
                        <div className="border-4 border-purple-600 p-6 rounded-xl bg-gray-900 shadow-xl">
                            <h4 className="text-xl font-bold text-purple-400 mb-3">Grave Scroll: Answer to Unleash a Blast! ({CARD_COST} Energy)</h4>
                            <p className="text-lg mb-4 font-medium text-white">{currentQuestion.text}</p>
                            
                            <form onSubmit={handlePlayCard} className="space-y-4">
                                <input
                                    type="text"
                                    value={answerInput}
                                    onChange={(e) => setAnswerInput(e.target.value)}
                                    placeholder="Your Answer (must be exact match)"
                                    className="mt-1 block w-full border border-purple-700 rounded-lg shadow-sm p-3 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-600 disabled:text-gray-400"
                                    disabled={playerEnergy < CARD_COST}
                                >
                                    Unleash Spectral Blast!
                                </button>
                                {playerEnergy < CARD_COST && <p className="text-red-400 text-sm text-center">Not enough spectral energy (mana) to attack.</p>}
                            </form>
                        </div>
                    ) : (
                        <div className="text-center p-6 border border-dashed border-purple-600 rounded-xl bg-gray-700 bg-opacity-50">
                            <button
                                onClick={getNewQuestion}
                                className="py-3 px-8 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition disabled:bg-gray-400"
                                disabled={playerEnergy < CARD_COST}
                            >
                                Draw New Grave Scroll ({CARD_COST} Energy)
                            </button>
                            {playerEnergy < CARD_COST && <p className="text-red-400 mt-2">Recharge energy to draw a new card.</p>}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderLobbyScreen = () => {
        const canStart = quizzes.length > 0;
        
        if (loading) {
            return <div className="text-center p-10 text-violet-600">Summoning study questions from the void...</div>;
        }

        if (!canStart) {
             return <div className="text-center p-10 bg-red-900 bg-opacity-50 rounded-xl shadow-lg border border-red-700 text-red-300 font-semibold">
                ⚠️ Teacher Alert: The spirit realm is empty. No quizzes or questions have been uploaded yet.
            </div>
        }

        return (
            <div className="text-center p-10 bg-gray-900 rounded-xl shadow-xl border-t-4 border-purple-500 text-white">
                <h2 className="text-3xl font-bold mb-4 text-purple-400">👻 Spectral Study Duel Arena 👻</h2>
                <p className="text-lg text-gray-400 mb-6">Master the arcane knowledge to win the haunted challenge.</p>
                <p className="text-xl font-bold text-yellow-400 mb-6">Your Current Rank: {currentArena.name} ({gamePoints} points)</p>
                
                <button
                    onClick={startGame}
                    className="py-4 px-10 bg-purple-600 text-white font-extrabold text-xl rounded-lg shadow-xl hover:bg-purple-700 transition"
                >
                    Enter the Haunted Arena
                </button>
            </div>
        );
    };
    
    const renderEndScreen = (status) => (
        <div className={`text-center p-10 rounded-xl shadow-xl ${status === 'win' ? 'bg-green-900 border-t-4 border-green-600' : 'bg-red-900 border-t-4 border-red-600'} text-white`}>
            <h2 className="text-4xl font-extrabold mb-4">{status === 'win' ? '🔮 CURSE LIFTED! VICTORY! 🔮' : '💀 DOOMED! DUEL LOST 💀'}</h2>
            <p className="text-xl font-semibold mb-6">{turnMessage}</p>
            <p className="text-2xl font-bold text-yellow-400 mt-4">New Rank: {currentArena.name} ({gamePoints} points)</p>
            <button
                onClick={() => setGameStatus('lobby')}
                className="py-3 px-8 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
            >
                Return to the Lobby
            </button>
        </div>
    );

    // --- Main Component Render ---
    return (
        <div className="min-h-screen bg-gray-900"> 
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-white">🏆 {currentArena.name}</h1>
                        <p className="text-gray-400 mt-2">Current Rank: **{currentArena.name}** ({currentArena.minPoints} points minimum)</p>
                    </div>

                    {/* Points Status Card */}
                    <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-8 border-l-4 border-pink-500 inline-block">
                        <h2 className="text-xl font-bold text-white">Spectral Points</h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl text-pink-500">💰</span>
                            <p className="text-2xl font-semibold text-white">{gamePoints}</p>
                        </div>
                    </div>

                    {/* Game Render Area */}
                    <div className="mt-8">
                        {gameStatus === 'lobby' && renderLobbyScreen()}
                        {gameStatus === 'playing' && renderGameScreen()}
                        {gameStatus === 'win' && renderEndScreen('win')}
                        {gameStatus === 'lose' && renderEndScreen('lose')}
                    </div>
                </main>
            </div>
        </div>
    );
}