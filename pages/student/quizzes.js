// pages/student/quizzes.js

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

// --- Supabase Configuration (HARDCODED) ---
// 🛑 WARNING: Replace these placeholders with your actual keys.
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ---

// The student will see all quizzes created by the mock teacher for now
const MOCK_TEACHER_ID = '00000000-0000-0000-0000-000000000000'; 

export default function StudentQuizListing() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuizzes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all quizzes created by the mock teacher
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

    useEffect(() => {
        fetchQuizzes();
    }, []);
    
    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-violet-600">Loading available quizzes...</p>
            </div>
        );
    }

    // --- Main Component Rendering ---
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Student" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role="student" />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8 border-b pb-2">
                        <h1 className="text-4xl font-extrabold text-gray-900">🧠 Available Quizzes</h1>
                    </div>

                    {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-lg border border-red-300">Error: {error}</p>}

                    {quizzes.length === 0 ? (
                        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                            <p className="text-xl text-gray-600">No quizzes are currently available.</p>
                            <p className="text-md text-gray-400 mt-2">Check back later or contact your teacher.</p>
                        </div>
                    ) : (
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Quiz Title</th>
                                        <th className="py-3 px-6 text-left">Questions</th>
                                        <th className="py-3 px-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {quizzes.map((quiz) => (
                                        <tr key={quiz.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-gray-800">
                                                {quiz.title}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {quiz.quiz_data.length}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {/* 🛑 THIS IS THE CRITICAL WORKING LINK 🛑 */}
                                                <Link href={`/student/take-quiz?id=${quiz.id}`} passHref legacyBehavior>
                                                    <a className="bg-green-500 text-white py-1 px-4 rounded-full text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">
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
        </div>
    );
}