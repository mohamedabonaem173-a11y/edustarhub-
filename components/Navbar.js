// components/Navbar.js (FINAL, CLEAN, AND FIXED)

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct

// Accept userRole as a prop
export default function Navbar({ userRole = 'User' }) {
    const router = useRouter();
    // State to track the current theme mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 1. EFFECT: Initialize dark mode state based on local storage or system preference
    useEffect(() => {
        const savedPreference = localStorage.getItem('theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine initial mode (saved preference > system preference > default to light)
        const initialMode = savedPreference === 'dark' || (savedPreference === null && systemPreference);
        setIsDarkMode(initialMode);
    }, []);

    // 2. EFFECT: Apply 'dark' class to HTML root and update local storage when state changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Toggles the dark mode state
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout Error:', error.message);
                alert('There was an error logging out. Please try again.');
                return;
            }
            
            // Clear role choice and theme preference upon logout
            localStorage.removeItem("roleChoice");
            localStorage.removeItem("theme"); 

            // Redirect to the sign-in page
            router.push('/signin');
        } catch (error) {
            console.error('Unexpected Logout Error:', error);
        }
    };

    // Determine the user's dashboard link
    const dashboardLink = userRole === 'Teacher' ? '/teacher/dashboard' : '/student/dashboard';


    return (
        // Navbar container with fixed dark mode styling
        <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    <div className="flex-shrink-0 flex items-center">
                        <Link href={dashboardLink} className="text-2xl font-extrabold text-indigo-800 dark:text-indigo-400 tracking-tight">
                            EDUSTARHUB
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        
                        {/* DARK MODE TOGGLE BUTTON */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? (
                                // Sun icon (Dark mode is currently ON)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                // Moon icon (Dark mode is currently OFF)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        
                        {/* User Status */}
                        <span className="text-gray-600 dark:text-gray-300 text-sm hidden sm:inline">
                            Logged in as: **{userRole}**
                        </span>
                        
                        {/* Log Out Button */}
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}