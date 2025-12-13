// pages/signin.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

// Helper Input Component
const FormInput = ({ label, value, onChange, type, required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-200 mb-1">{label}</label>
    <input
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      className="w-full border border-gray-700 rounded-xl p-4 pl-5 bg-gray-900 text-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-lg placeholder-gray-500"
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
  </div>
);

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInRole, setSignInRole] = useState('student');
  const [signUpRole, setSignUpRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle authentication
  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Generate verification token
        const verificationToken = uuidv4();

        // Supabase signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role: signUpRole } },
        });
        if (error) throw error;

        // Insert profile
        await supabase.from('profiles').insert([{
          id: data.user.id,
          email,
          full_name: fullName,
          role: signUpRole,
          is_verified: false,
          verification_token: verificationToken,
        }]);

        // Send verification email via API
        const sendRes = await fetch('/api/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, fullName, verificationToken }),
        });

        if (!sendRes.ok) throw new Error('Failed to send verification email');

        setMessage('✅ Signup successful! Check your email for the verification link.');

      } else {
        // Sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        const userId = signInData.user.id;

        // Insert profile if missing
        const { data: existing } = await supabase.from('profiles').select().eq('id', userId);
        if (existing.length === 0) {
          await supabase.from('profiles').insert([{
            id: userId,
            full_name: signInData.user.user_metadata?.full_name || '',
            role: signInData.user.user_metadata?.role || 'student',
          }]);
        }

        setMessage('🚀 Signed in successfully! Redirecting...');
        await router.push(`/${signInRole}/dashboard`);
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setMessage('❌ Auth Error: ' + (err.message || 'An unknown error occurred.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-cyan-500/50 rounded-3xl shadow-[0_0_60px_cyan] p-8 relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-cyan-400 rounded-3xl animate-pulse mix-blend-overlay pointer-events-none"></div>

        {/* Toggle */}
        <div className="flex mb-8 border-b border-gray-600">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 text-xl font-bold transition ${!isSignUp ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 text-xl font-bold transition ${isSignUp ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-cyan-300 mb-6 drop-shadow-lg">
          {isSignUp ? 'Create Account' : 'Sign In to EDUSTARHUB'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isSignUp && (
            <div className="flex bg-gray-900 rounded-xl p-1 gap-2">
              <button type="button" onClick={() => setSignInRole('student')}
                className={`flex-1 py-3 rounded-xl font-bold transition ${signInRole === 'student' ? 'bg-cyan-600 text-black shadow-[0_0_20px_cyan]' : 'text-gray-400 hover:bg-gray-700'}`}>
                Student
              </button>
              <button type="button" onClick={() => setSignInRole('teacher')}
                className={`flex-1 py-3 rounded-xl font-bold transition ${signInRole === 'teacher' ? 'bg-cyan-600 text-black shadow-[0_0_20px_cyan]' : 'text-gray-400 hover:bg-gray-700'}`}>
                Teacher
              </button>
            </div>
          )}

          {isSignUp && (
            <>
              <FormInput label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} type="text" required />
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">Account Type</label>
                <select value={signUpRole} onChange={e => setSignUpRole(e.target.value)}
                  className="w-full border border-gray-700 bg-gray-900 text-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </>
          )}

          <FormInput label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          <FormInput label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required />

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-bold text-lg shadow-[0_0_30px_cyan] hover:shadow-[0_0_50px_cyan] transition-all transform hover:-translate-y-1 disabled:opacity-50">
            {loading ? (isSignUp ? 'Creating...' : 'Signing In...') : (isSignUp ? 'Sign Up' : `Sign In as ${signInRole}`)}
          </button>

          {message && <div className={`text-center mt-2 font-semibold ${message.startsWith('❌') ? 'text-red-500' : 'text-green-400'} animate-pulse`}>
            {message}
          </div>}
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          {!isSignUp ? (
            <span>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-cyan-400 font-bold hover:text-cyan-200 transition">Sign up now</button>
            </span>
          ) : (
            <Link href="/" className="hover:text-cyan-400 transition">← Back to Home</Link>
          )}
        </div>
      </div>
    </div>
  );
}
