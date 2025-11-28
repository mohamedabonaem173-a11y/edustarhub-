// pages/signin.js - CORRECTED VERSION

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [signInRole, setSignInRole] = useState('student'); // 'student' or 'teacher'
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [signUpRole, setSignUpRole] = useState('student');
    const [message, setMessage] = useState('');

    // --- AUTH LOGIC (CORRECTED) ---
    async function handleAuth(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // ------------------ SIGN UP LOGIC ------------------
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: signUpRole,
                        }
                    }
                });

                if (error) throw error;
                
                // CRITICAL: Insert profile data for role-based access
                if (data?.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({
                            id: data.user.id,
                            email: data.user.email,
                            role: signUpRole,
                            full_name: fullName
                        });
                    
                    if (profileError) throw profileError;
                }
                
                setMessage('Success! Check your email for the confirmation link.');
                
            } else {
                // ------------------ SIGN IN LOGIC (FIXED) ------------------
                const { error } = await supabase.auth.signInWithPassword({
                    email, 
                    password
                });
                
                if (error) throw error;
                
                // 1. Set the success message
                setMessage('Signed in successfully! Redirecting...');
                
                // 2. Determine the dashboard path using the selected role
                const dashboardPath = `/${signInRole}/dashboard`; 
                
                // 3. EXECUTE THE REDIRECTION using the Next.js router
                // This will perform the page transition to the dashboard.
                await router.push(dashboardPath); 
                
                // Important: Since we are navigating, we exit the function here.
                return; 
            }
            
        } catch (error) {
            console.error("Auth Error:", error.message);
            setMessage("Auth Error: " + (error.message || "An unknown error occurred."));
        } finally {
            // Only stop loading if we are still on this page (i.e., an error occurred during Sign In/Sign Up)
            if (message === '' || message.startsWith('Auth Error:')) {
                setLoading(false);
            }
        }
    }

    // --- RETURN STATEMENT (UI REMAINS THE SAME) ---
    return (
        <div className="min-h-screen bg-[#F5F0FF] flex items-center justify-center p-4">
            
            {/* Centered Auth Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-3xl p-8 border-t-4 border-violet-500">
                
                {/* Toggle between Sign In and Sign Up */}
                <div className="flex mb-8 border-b border-gray-200">
                    <button 
                        onClick={() => setIsSignUp(false)} 
                        className={`flex-1 py-3 text-lg font-semibold transition ${
                            !isSignUp ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => setIsSignUp(true)} 
                        className={`flex-1 py-3 text-lg font-semibold transition ${
                            isSignUp ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-6">
                    {isSignUp ? 'Create Account' : 'Sign In to EDUSTARHUB'}
                </h1>
                
                <form onSubmit={handleAuth} className="space-y-5">
                    
                    {/* --- ROLE TOGGLE (Only for Sign In) --- */}
                    {!isSignUp && (
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                            <button 
                                type="button"
                                onClick={() => setSignInRole('student')}
                                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                                    signInRole === 'student' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'
                                }`}
                            >
                                Student
                            </button>
                            <button 
                                type="button"
                                onClick={() => setSignInRole('teacher')}
                                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                                    signInRole === 'teacher' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-600 hover:bg-white'
                                }`}
                            >
                                Teacher
                            </button>
                        </div>
                    )}
                    
                    {/* --- SIGN UP FIELDS --- */}
                    {isSignUp && (
                        <>
                            <FormInput
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                type="text"
                                required
                            />
                            
                            {/* Role Dropdown for Sign Up (Student/Teacher) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                                <select
                                    value={signUpRole}
                                    onChange={(e) => setSignUpRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                                    required
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <FormInput
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />

                    {/* Password */}
                    <FormInput
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                    />

                    {/* Auth Button */}
                    <button 
                        type="submit" 
                        className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-lg shadow-lg hover:bg-violet-700 transition transform hover:-translate-y-0.5 disabled:bg-violet-300" 
                        disabled={loading}
                    >
                        {loading ? (isSignUp ? 'Creating...' : 'Signing In...') : (isSignUp ? 'Sign Up' : `Sign In as ${isSignUp ? signUpRole : signInRole}`)}
                    </button>
                    
                    {/* Message Area */}
                    {message && (
                        <div className={`text-sm pt-2 text-center font-medium ${message.startsWith('Auth Error') ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </div>
                    )}
                </form>
                
                {/* Sign Up / Back to Home Link */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    {!isSignUp ? (
                        <span>
                            Don't have an account?{' '}
                            <button 
                                onClick={() => setIsSignUp(true)} 
                                className="text-violet-600 font-semibold hover:text-violet-800 transition"
                            >
                                Sign up now
                            </button>
                        </span>
                    ) : (
                        <Link href="/" className="hover:text-violet-600 transition">
                            ← Back to Home
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}

// Simple helper component for better input styling
const FormInput = ({ label, value, onChange, type, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                value={value}
                onChange={onChange}
                type={type}
                className="w-full border border-gray-300 rounded-lg p-3 pl-4 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                required={required}
                placeholder={`Enter your ${label.toLowerCase()}`}
            />
        </div>
    </div>
);