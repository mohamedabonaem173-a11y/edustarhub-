// pages/teacher/dashboard.js - FINAL CORRECTED VERSION

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 
import Link from 'next/link';

export default function TeacherDashboard() {
    const role = 'teacher';
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [quizCount, setQuizCount] = useState(0); 
    
    // Define the mock ID outside of the functions for clarity
    const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000'; 

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const currentUserId = session.user.id;
                setUserId(currentUserId);
                
                try {
                    // Fetch both resources and quiz count concurrently
                    await Promise.all([
                        fetchResources(currentUserId), 
                        fetchQuizCount() 
                    ]);
                } catch (error) {
                    console.error("Dashboard failed to load data:", error);
                    // We can let the component proceed to render with partial data on error
                } finally {
                    setLoading(false); // <--- CRITICAL FIX: Ensures loading is set to false after Promise.all finishes.
                }
            } else {
                setLoading(false); // Also set to false if no session (user is not logged in)
            }
        }
        loadData();
    }, []);

    // --- Data Fetching Functions ---

    const fetchResources = async (currentUserId) => {
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('id, title, created_at, category, url')
                .eq('user_id', currentUserId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setResources(data);
        } catch (error) {
            console.error("Error fetching dashboard resources:", error);
            // Don't set loading=false here, let the main useEffect handle it
        }
    };
    
    const fetchQuizCount = async () => {
        try {
            // Fetch quizzes associated with the MOCK_USER_ID used for anonymous quiz creation
            const { count, error } = await supabase
                .from('quizzes')
                // Use the count option to get the total number of rows efficiently
                .select('*', { count: 'exact' }) 
                .eq('teacher_id', MOCK_USER_ID); 

            if (error) throw error;
            setQuizCount(count);
        } catch (error) {
            console.error("Error fetching quiz count:", error);
            setQuizCount(0); // Default to 0 on failure
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-violet-600">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Teacher" />
            
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">👋 Welcome Back, Teacher!</h1>
                    
                    {/* Dashboard Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        
                        {/* 1. Total Resources Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                            <p className="text-sm font-medium text-gray-500">Total Resources Uploaded</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{resources.length || 0}</p>
                            
                            {/* Correct Link Structure (wraps one element) */}
                            <Link href="/teacher/manage" passHref legacyBehavior>
                                <a className="text-xs text-indigo-600 mt-2 hover:underline block">
                                    View all →
                                </a>
                            </Link>
                        </div>
                        
                        {/* 2. Quizzes Created Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                            <p className="text-sm font-medium text-gray-500">Quizzes Created</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{quizCount}</p>
                            
                            {/* Correct Link Structure (wraps one element) and links to the NEW quiz manager */}
                            <Link href="/teacher/quiz-manage" passHref legacyBehavior>
                                <a className="text-xs text-green-600 mt-2 hover:underline block">
                                    Manage quizzes →
                                </a>
                            </Link>
                        </div>

                        {/* 3. Students Enrolled Card (Placeholder) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                            <p className="text-sm font-medium text-gray-500">Active Students</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">N/A</p>
                            <p className="text-xs text-orange-600 mt-2">Feature coming soon</p>
                        </div>
                    </div>

                    {/* Recent Uploads Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Recent Resource Uploads</h2>
                        
                        {resources.length === 0 ? (
                            <p className="text-gray-500 p-4">No recent uploads found. Start by visiting the Upload Resources page!</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {resources.map((resource) => (
                                    <li key={resource.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <a 
                                                href={resource.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                {resource.title}
                                            </a>
                                            <p className="text-sm text-gray-500">{resource.category} - {new Date(resource.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        {/* Correct Link Structure */}
                        <Link href="/teacher/manage" passHref legacyBehavior>
                            <a className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                                See all uploads →
                            </a>
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}