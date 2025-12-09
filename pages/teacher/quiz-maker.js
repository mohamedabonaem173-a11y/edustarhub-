// pages/teacher/quiz-maker.js

import React, { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useRouter } from 'next/router';

// --- Supabase config ---
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Initial question structure ---
const EMPTY_QUESTION_STRUCTURE = {
    question_text: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
};

const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

function QuizMaker() {
    const router = useRouter();
    const [quizTitle, setQuizTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([EMPTY_QUESTION_STRUCTURE]);

    // --- Question Management ---
    const addQuestion = () => setQuestions([...questions, EMPTY_QUESTION_STRUCTURE]);

    const updateQuestion = useCallback((index, field, value) => {
        const newQuestions = questions.map((q, i) => {
            if (i === index) {
                if (field === 'option') {
                    const [optIndex, optValue] = value;
                    const newOptions = [...q.options];
                    newOptions[optIndex] = optValue;
                    return { ...q, options: newOptions };
                }
                return { ...q, [field]: value };
            }
            return q;
        });
        setQuestions(newQuestions);
    }, [questions]);

    // --- AI Quiz Generation ---
    const handleGenerateQuiz = async () => {
        if (!topic || numQuestions <= 0) {
            setError("Please enter a topic and number of questions.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, count: numQuestions }),
            });
            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.error || 'Failed to generate quiz.');
            setQuizTitle(result.title);
            setQuestions(result.questions);
        } catch (err) {
            console.error(err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Supabase Save Quiz ---
    const handleSaveQuiz = async () => {
        if (!quizTitle || questions.length === 0 || questions.some(q => !q.question_text)) {
            alert("Please ensure the quiz has a title and at least one complete question.");
            return;
        }

        const finalUserId = MOCK_USER_ID;
        const quizDataToSend = { title: quizTitle, quiz_data: questions, teacher_id: finalUserId };

        try {
            const { data, error } = await supabase.from('quizzes').insert([quizDataToSend]);
            if (error) {
                console.error(error);
                alert(`🛑 Failed to save quiz: ${error.message}`);
                setError(`Supabase error: ${error.message}`);
            } else {
                alert("✅ Success! Quiz saved.");
                router.push('/teacher/quiz-manage');
            }
        } catch (err) {
            console.error(err);
            setError("Unexpected client error.");
        }
    };

    // --- Render each question ---
    const renderQuestion = (q, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Question {index + 1}</h3>
            <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-violet-500 focus:border-violet-500"
                value={q.question_text}
                onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                placeholder="Enter the question text"
                rows="2"
            />
            <div className="space-y-2">
                {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                        <input
                            type="text"
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            value={option}
                            onChange={(e) => updateQuestion(index, 'option', [optIndex, e.target.value])}
                            placeholder={`Option ${optIndex + 1}`}
                        />
                        <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={q.correct_answer === option && option !== ''}
                                onChange={() => updateQuestion(index, 'correct_answer', q.correct_answer === option ? '' : option)}
                                className="form-checkbox text-green-500"
                                disabled={option === ''}
                            />
                            <span className="text-sm text-gray-600">Correct</span>
                        </label>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation/Feedback:</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                    value={q.explanation}
                    onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                    placeholder="Provide a brief explanation for the correct answer."
                    rows="2"
                />
            </div>
        </div>
    );

    // --- Techy Background Animation ---
    useEffect(() => {
        const canvas = document.getElementById('techy-bg');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const nodes = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
        }));

        function animate() {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                ctx.fillStyle = '#8A2BE2';
                ctx.beginPath();
                ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - node.x;
                    const dy = nodes[j].y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(138,43,226,${1 - dist / 150})`;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }, []);

    // --- Render page ---
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Techy background canvas */}
            <canvas id="techy-bg" className="absolute inset-0 w-full h-full z-0"></canvas>

            {/* Foreground content */}
            <Navbar userRole="Teacher" />
            <div className="max-w-7xl mx-auto flex pt-4 relative z-10">
                <Sidebar role="teacher" />
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-extrabold text-gray-200 mb-8 border-b pb-2">🧠 AI Quiz Maker</h1>

                    {/* Input Area */}
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Quiz from Topic</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                                placeholder="Enter the subject or topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <div className="flex items-center space-x-4">
                                <label className="text-gray-700">Number of Questions:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="15"
                                    className="p-3 border border-gray-300 rounded-lg w-20 text-center"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
                                />
                                <button
                                    onClick={handleGenerateQuiz}
                                    className={`flex-1 p-3 rounded-lg text-white font-semibold transition-all duration-300 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Generating... Please Wait' : 'Generate Quiz'}
                                </button>
                            </div>
                        </div>
                        {error && <p className="mt-4 text-red-500 font-medium">Error: {error}</p>}
                    </div>

                    {/* Quiz Editing */}
                    <h2 className="text-3xl font-extrabold text-gray-200 mb-6">Edit Final Quiz Structure</h2>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-300 rounded-xl text-2xl font-bold mb-6 focus:border-green-500"
                        placeholder="Enter Quiz Title (Required)"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                    />
                    {questions.map(renderQuestion)}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={addQuestion}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            + Add Question Manually
                        </button>
                        <button
                            onClick={handleSaveQuiz}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-extrabold shadow-xl hover:bg-green-700 transition-colors"
                        >
                            SAVE FINAL QUIZ
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default QuizMaker;
