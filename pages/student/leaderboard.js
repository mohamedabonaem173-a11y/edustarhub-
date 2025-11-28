// pages/student/leaderboard.js - Displays the competitive ranking of students

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 

// --- ARENA DEFINITIONS (Must match definitions in games.js) ---
const ARENAS = [
    { name: 'The Graveyard', minPoints: 0, themeColor: 'text-gray-400', icon: '⚰️' },
    { name: 'The Cursed Crypt', minPoints: 500, themeColor: 'text-purple-400', icon: '🔮' },
    { name: 'The Spectral Citadel', minPoints: 1000, themeColor: 'text-indigo-400', icon: '🏰' },
    { name: 'The Forbidden Spire', minPoints: 1500, themeColor: 'text-pink-400', icon: '🔥' },
    { name: 'The Eternal Throne', minPoints: 2000, themeColor: 'text-yellow-400', icon: '👑' },
];

// Helper function to determine Arena based on points
const getArena = (points) => {
    let arena = ARENAS[0];
    for (const a of ARENAS) {
        if (points >= a.minPoints) {
            arena = a;
        }
    }
    return arena;
};

export default function StudentLeaderboard() {
    const role = 'student';
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            
            // Fetch all profiles, sorted by game_points descending
            const { data, error } = await supabase
                .from('profiles')
                .select('username, game_points')
                .order('game_points', { ascending: false })
                .limit(50); // Limit to top 50 users

            if (error) {
                console.error("Error fetching leaderboard:", error);
            } else if (data) {
                // Attach Arena rank to each player
                const rankedData = data.map(profile => ({
                    ...profile,
                    arena: getArena(profile.game_points),
                }));
                setLeaderboard(rankedData);
            }
            setLoading(false);
        }
        fetchLeaderboard();
    }, []);

    const renderLeaderboard = () => {
        if (loading) {
            return <div className="text-center p-10 text-purple-500">Summoning the rankings...</div>;
        }

        if (leaderboard.length === 0) {
            return <div className="text-center p-10 text-gray-400 bg-gray-800 rounded-xl">
                The leaderboard is empty. Start playing the **Study Duel** to claim your spot!
            </div>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-xl shadow-2xl">
                    <thead className="bg-purple-900 text-white border-b border-purple-700">
                        <tr>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Rank</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Player</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Spectral Points</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Arena Rank</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {leaderboard.map((player, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/70'}>
                                <td className="py-4 px-6 whitespace-nowrap text-xl font-extrabold text-yellow-500">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap font-semibold text-white">
                                    {player.username}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-lg font-bold text-pink-400">
                                    {player.game_points}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-lg font-medium">
                                    <span className={`${player.arena.themeColor} font-bold`}>
                                        {player.arena.icon} {player.arena.name}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900"> 
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-white">👑 Spectral Leaderboard</h1>
                        <p className="text-gray-400 mt-2">See who commands the most Spectral Points and dominates the Arenas!</p>
                    </div>

                    {renderLeaderboard()}
                </main>
            </div>
        </div>
    );
}