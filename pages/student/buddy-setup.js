
// pages/student/buddy-setup.js (SUPABASE MIGRATION)

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'; // Import Supabase Client

// --- Supabase Configuration (HARDCODED) ---
const SUPABASE_URL = "https://zuafcjaseshxjcptfhkg.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_nSzApJy-q9gkhOjgf00VfA_vr_04rBR"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ---

const avatarOptions = ['🦉', '🤖', '🧘', '🌟', '🐻', '💡'];

export default function BuddySetup() {
    const router = useRouter();
    const [buddyName, setBuddyName] = useState('Zenith');
    const [buddyAvatar, setBuddyAvatar] = useState('🧘');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!buddyName.trim()) return;
        
        setIsSaving(true);
        setError(null);
        
        try {
            // Get the current logged-in user session
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not logged in.");
            }

            // 🛑 SUPABASE WRITE OPERATION 🛑
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ buddy_name: buddyName, buddy_avatar: buddyAvatar })
                .eq('id', user.id); // Assuming your user profile ID matches the auth ID

            if (updateError) {
                throw updateError;
            }

            // Success: Now save a flag to localStorage to quickly bypass the check on the dashboard
            // We use this as a secondary check, but the primary source is now Supabase.
            localStorage.setItem('buddy_setup_complete', 'true'); 

            // Redirect to the chat page
            router.push('/student/buddy');

        } catch (err) {
            console.error("Error saving buddy setup:", err);
            setError(`Failed to save setup: ${err.message}`);
            setIsSaving(false);
        }
    };

    // ... (rest of the component JSX is the same as before) ...
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            <Navbar userRole="Student" />
            <main className="max-w-3xl mx-auto p-8 pt-20">
                <div className="bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-violet-600">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Customise Your Buddy
                    </h1>
                    <p className="text-lg text-gray-600 mb-10">
                        Create your personal **Study & Stress Buddy**. Give them a name and choose an avatar to make this companion truly yours.
                    </p>

                    {error && (
                        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xl font-bold text-gray-700 mb-2">
                                Buddy's Name
                            </label>
                            <input
                                type="text"
                                value={buddyName}
                                onChange={(e) => setBuddyName(e.target.value)}
                                placeholder="e.g., Zenith, Atlas, or Professor"
                                className="w-full p-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            />
                        </div>

                        {/* Avatar Selection */}
                        <div>
                            <label className="block text-xl font-bold text-gray-700 mb-4">
                                Choose an Avatar
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {avatarOptions.map((avatar) => (
                                    <div
                                        key={avatar}
                                        onClick={() => setBuddyAvatar(avatar)}
                                        className={`p-4 text-4xl rounded-full border-4 cursor-pointer transition-all duration-200 ${
                                            buddyAvatar === avatar
                                                ? 'border-violet-600 bg-violet-100 transform scale-110 shadow-lg'
                                                : 'border-gray-200 hover:border-violet-400 bg-white'
                                        }`}
                                    >
                                        {avatar}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="pt-4 border-t border-gray-200">
                             <p className="text-center text-gray-600 text-lg mb-4">
                                Your Buddy will be:
                            </p>
                            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                                <span className="text-5xl mr-4">{buddyAvatar}</span>
                                <span className="text-3xl font-extrabold text-violet-700">{buddyName}</span>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSaving || !buddyName}
                                className="w-full py-4 rounded-xl bg-violet-600 text-white font-bold text-xl shadow-lg hover:bg-violet-700 transition disabled:bg-gray-400"
                            >
                                {isSaving ? 'Saving & Launching...' : 'Save & Start Chatting'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
