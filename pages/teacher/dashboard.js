// pages/teacher/dashboard.js - FINAL CORRECTED VERSION

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 
import Link from 'next/link'; // <--- CRITICAL FIX: The missing Link import

export default function TeacherDashboard() {
    const role = 'teacher';
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
                // Fetch resources immediately after getting the user ID
                fetchResources(session.user.id); 
            } else {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // --- Data Fetching Function ---
    const fetchResources = async (currentUserId) => {
        try {
            // Ensure filtering uses the working 'user_id' column
            const { data, error } = await supabase
                .from('resources')
                // Select core columns: title, created_at, category, and url (for linking)
                .select('id, title, created_at, category, url')
                .eq('user_id', currentUserId) // <-- Use 'user_id' for filtering
                .order('created_at', { ascending: false })
                .limit(5); // Show only the 5 most recent uploads

            if (error) throw error;
            
            setResources(data);
        } catch (error) {
            console.error("Error fetching dashboard resources:", error);
            // Dashboard fails silently on fetch errors
        } finally {
            setLoading(false);
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
                            <Link href="/teacher/manage" passHref legacyBehavior>
                                <a className="text-xs text-indigo-600 mt-2 hover:underline">
                                    View all →
                                </a>
                            </Link>
                        </div>
                        
                        {/* 2. Quizzes Created Card (Placeholder) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                            <p className="text-sm font-medium text-gray-500">Quizzes Created</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                            <Link href="/teacher/quiz-maker" passHref legacyBehavior>
                                <a className="text-xs text-green-600 mt-2 hover:underline">
                                    Start making a quiz →
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
                                                href={resource.url} // <-- Use 'url' for the link
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