// pages/student/quizzes.js (Techy Version)
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

// --- Supabase Configuration (HARDCODED) ---
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MOCK_TEACHER_ID = '00000000-0000-0000-0000-000000000000'; 

export default function StudentQuizListing() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuizzes = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('id, title, quiz_data, created_at')
                .eq('teacher_id', MOCK_TEACHER_ID)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setQuizzes(data);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setError(`Failed to load available quizzes: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuizzes(); }, []);
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
                <p className="text-xl text-cyan-400 animate-pulse">Loading available quizzes...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
            <Navbar userRole="Student" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role="student" />
                <main className="flex-1 p-8">

                    <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-2 flex-wrap gap-2">
                        <h1 className="text-4xl font-extrabold text-cyan-400 flex items-center">🧠 Available Quizzes</h1>
                    </div>

                    {error && <p className="text-red-500 mb-4 bg-red-900 text-red-300 p-3 rounded-lg border border-red-700">{error}</p>}

                    {quizzes.length === 0 ? (
                        <div className="text-center p-10 bg-black/20 rounded-xl shadow-[0_0_20px_cyan] border border-cyan-500">
                            <p className="text-xl text-gray-400">No quizzes are currently available.</p>
                            <p className="text-md text-gray-500 mt-2">Check back later or contact your teacher.</p>
                        </div>
                    ) : (
                        <div className="bg-black/30 shadow-[0_0_20px_cyan] rounded-xl overflow-hidden border border-cyan-500">
                            <table className="min-w-full leading-normal border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 text-cyan-400 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Quiz Title</th>
                                        <th className="py-3 px-6 text-left">Questions</th>
                                        <th className="py-3 px-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300 text-sm font-light">
                                    {quizzes.map((quiz) => (
                                        <tr key={quiz.id} className="border-b border-gray-700 hover:bg-gray-800 hover:shadow-[0_0_15px_cyan] transition-all duration-200">
                                            <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-white">{quiz.title}</td>
                                            <td className="py-3 px-6 text-left">{quiz.quiz_data.length}</td>
                                            <td className="py-3 px-6 text-center">
                                                <Link href={`/student/take-quiz?id=${quiz.id}`} passHref legacyBehavior>
                                                    <a className="bg-cyan-500 text-black py-1 px-4 rounded-full text-xs font-bold hover:bg-cyan-400 transition-colors shadow-md">
                                                        Start Quiz
                                                    </a>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {/* Subtle neon particle background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-30 animate-pulse"
                        style={{
                            width: `${Math.random()*4 + 1}px`,
                            height: `${Math.random()*4 + 1}px`,
                            backgroundColor: `rgba(0,255,255,${Math.random()*0.4})`,
                            top: `${Math.random()*100}%`,
                            left: `${Math.random()*100}%`,
                            animationDelay: `${Math.random()*5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
