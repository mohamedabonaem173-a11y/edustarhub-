// pages/student/dashboard.js - STABILITY RESTORED VERSION

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 
import Link from 'next/link';

const RESOURCES_TABLE = 'resources'; 

export default function StudentDashboard() {
    const role = 'student';
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [error, setError] = useState(null);

    // --- User Initialization ---
    useEffect(() => {
        async function getUserId() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
            }
        }
        getUserId();
    }, []);

    // --- Fetch ALL resources for the Student Dashboard ---
    const fetchAllResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const { data, error } = await supabase
                .from(RESOURCES_TABLE)
                .select('id, title, category, created_at, url, file_type') 
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            
            setResources(data);

        } catch (err) {
            console.error("Error fetching student resources on dashboard:", err);
            setError('Failed to load resources from the database.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllResources();
    }, [fetchAllResources]); 

    const getLoggedInUserName = () => {
        // Placeholder, integrate user fetching logic later
        return "Learner";
    }

    // --- Placeholder Data for Gamification ---
    const gamePoints = 40;
    const downloadedCount = 0; 
    const totalResources = resources.length;
    const learningProgress = totalResources > 0 ? Math.round((downloadedCount / totalResources) * 100) : 0;
    const hasBadges = false; 
    const recentResourcesCount = resources.length;
    
    // --- Helper Component for Styled Stats Cards (using simple text/emojis) ---
    const StatCard = ({ title, value, detail, icon, iconColor, linkHref }) => {
        const content = (
            <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-b-4 border-transparent hover:border-indigo-500 cursor-pointer flex items-start space-x-4">
                <div className={`p-3 rounded-full ${iconColor} bg-opacity-10 text-2xl`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-4xl font-extrabold text-gray-900 mt-1">{value}</p>
                    {detail && <p className={`text-xs mt-2 ${iconColor.replace('text', 'text-opacity-80')}`}>{detail}</p>}
                </div>
            </div>
        );

        return linkHref ? (
            <Link href={linkHref} passHref legacyBehavior>
                <a>{content}</a>
            </Link>
        ) : (
            content
        );
    };

    return (
        <div className="min-h-screen bg-gray-100"> 
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, <span className="text-indigo-600">{getLoggedInUserName()}!</span></h1>
                    <p className="text-gray-500 mb-10">Your journey through the arena continues. View your progress below.</p>
                    
                    {/* --- GAMIFICATION STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        
                        <StatCard
                            title="Game Points"
                            value={gamePoints}
                            detail="Go to the arena to earn more points!"
                            icon="⚡" // Using Emoji instead of lucide icon
                            iconColor="text-yellow-500"
                            linkHref="/student/games"
                        />
                        
                        <StatCard
                            title="Learning Progress"
                            value={`${learningProgress}%`}
                            detail={`Completed ${downloadedCount} of ${totalResources} resources.`}
                            icon="📈" // Using Emoji instead of lucide icon
                            iconColor="text-blue-500"
                        />

                        <StatCard
                            title="Achievements"
                            value={hasBadges ? '1 Badge' : 'N/A'}
                            detail={hasBadges ? 'You earned a badge! View details.' : 'No badges earned yet.'}
                            icon="🏅" // Using Emoji instead of lucide icon
                            iconColor="text-purple-500"
                        />
                    </div>

                    {/* --- RECENT RESOURCES SECTION --- */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                📚 Recently Added Resources 
                            </h2>
                            <span className="text-sm font-semibold text-gray-500 bg-indigo-50 px-3 py-1 rounded-full">{recentResourcesCount} Total</span>
                        </div>
                        
                        {error && (
                            <div className="p-4 mb-4 rounded-lg font-medium bg-red-100 text-red-700">
                                **Database Error:** {error}
                            </div>
                        )}

                        {loading ? (
                            <p className="text-lg text-gray-600 p-4">Loading resources...</p>
                        ) : resources.length === 0 ? (
                            <p className="text-gray-500 p-4 border rounded-lg bg-gray-50">No recent resources found. Ask your teacher to upload some!</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {resources.map((resource) => (
                                    <li key={resource.id} className="py-4 flex justify-between items-center transition duration-150 hover:bg-gray-50 rounded-lg px-2 -mx-2">
                                        <div className="flex-1 min-w-0">
                                            <a 
                                                href={resource.url}
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition truncate block"
                                            >
                                                {resource.title}
                                            </a>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Category: <span className="font-medium text-gray-700">{resource.category}</span>
                                                <span className="mx-2">•</span>
                                                Type: <span className="font-medium text-purple-600">{(resource.file_type || 'N/A').toUpperCase()}</span>
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 ml-4">{new Date(resource.created_at).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Link href="/student/resources" passHref legacyBehavior>
                            <a className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition border-b border-dashed border-indigo-400">
                                View all resources and subjects →
                            </a>
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}