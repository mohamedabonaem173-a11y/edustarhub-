// pages/student/profile.js

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient';

export default function StudentProfile() {
    const role = 'student';
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState({
        id: null,
        email: '',
        full_name: '',
        role: 'student',
    });
    
    // State for password change form
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passMessage, setPassMessage] = useState('');
    const [passLoading, setPassLoading] = useState(false);

    // --- 1. Fetch User Data ---
    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                const user = session?.user;

                if (!user) {
                    setMessage('User session not found.');
                    return;
                }

                // Fetch profile data from the 'profiles' table
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select('full_name, role')
                    .eq('id', user.id)
                    .single();

                if (error && status !== 406) throw error; // 406 means no data, often harmless

                setProfile({
                    id: user.id,
                    email: user.email,
                    full_name: data?.full_name || '',
                    role: data?.role || 'student', // Default to student if missing
                });

            } catch (error) {
                console.error("Error loading user data:", error);
                setMessage('Error loading profile data.');
            } finally {
                setLoading(false);
            }
        }
        getProfile();
    }, []);

    // --- 2. Handle Profile Update (Full Name) ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updates = {
                id: profile.id,
                full_name: profile.full_name,
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            
            // Also update metadata so future sessions get the name instantly
            await supabase.auth.updateUser({
                data: { full_name: profile.full_name }
            });

            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
        }
    };
    
    // --- 3. Handle Password Change ---
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPassLoading(true);
        setPassMessage('');

        if (newPassword !== confirmPassword) {
            setPassMessage('Error: Passwords do not match.');
            setPassLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPassMessage('Error: Password must be at least 6 characters.');
            setPassLoading(false);
            return;
        }

        try {
            // Note: Supabase handles the password change via the update endpoint
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setPassMessage('Password updated successfully! Please note: You may need to re-login.');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            console.error("Error changing password:", error);
            setPassMessage('Error changing password. Please try again.');
        } finally {
            setPassLoading(false);
            setTimeout(() => setPassMessage(''), 8000); 
        }
    };

    return (
        <div className="min-h-screen bg-gray-50"> 
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">👤 My Profile</h1>
                        <p className="text-gray-600 mt-2">Update your personal details and manage your security settings.</p>
                    </div>

                    {loading ? (
                        <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                            <p className="text-xl text-violet-600">Loading profile data...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* --- Profile Details Card --- */}
                            <div className="bg-white rounded-xl shadow-xl p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4 mb-6">Personal Information</h2>
                                
                                {message && (
                                    <div className={`p-3 mb-4 rounded-lg font-medium text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    
                                    {/* Email (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 border-b border-dashed pb-2">{profile.email}</p>
                                    </div>
                                    
                                    {/* Role (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Account Role</label>
                                        <p className="mt-1 text-lg font-semibold text-violet-600">{profile.role.toUpperCase()}</p>
                                    </div>
                                    
                                    {/* Full Name (Editable) */}
                                    <div>
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-violet-500 focus:border-violet-500"
                                            required
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition disabled:bg-violet-300"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Update Profile'}
                                    </button>
                                </form>
                            </div>

                            {/* --- Password Change Card --- */}
                            <div className="bg-white rounded-xl shadow-xl p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4 mb-6">Security & Password</h2>

                                {passMessage && (
                                    <div className={`p-3 mb-4 rounded-lg font-medium text-sm ${passMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {passMessage}
                                    </div>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    
                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            id="new_password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-violet-500 focus:border-violet-500"
                                            placeholder="Enter new password (min 6 chars)"
                                            required
                                        />
                                    </div>
                                    
                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                        <input
                                            id="confirm_password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-violet-500 focus:border-violet-500"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition disabled:bg-red-300"
                                        disabled={passLoading}
                                    >
                                        {passLoading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}