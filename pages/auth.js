// pages/signin.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Helper input component
const FormInput = ({ label, value, onChange, type, required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-200 mb-1">
      {label}
    </label>
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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signUpRole, setSignUpRole] = useState('student');
  const [message, setMessage] = useState('');

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // --- SIGN UP via Supabase ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: signUpRole },
          },
        });

        if (error) throw error;

        const userId = data.user.id;

        // --- INSERT PROFILE WITH EMAIL + FULL NAME ---
        const { data: existing } = await supabase
          .from('profiles')
          .select()
          .eq('id', userId);

        if (!existing || existing.length === 0) {
          await supabase.from('profiles').insert([{
            id: userId,
            email: data.user.email,
            full_name: fullName || data.user.user_metadata?.full_name || '',
            role: signUpRole,
            created_at: new Date(),
            is_verified: false, // optional flag for verification
          }]);
        }

        // --- SEND CONFIRMATION EMAIL VIA SERVER ROUTE ---
        try {
          await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, fullName, userId }),
          });
          setMessage('✅ Success! Check your email for confirmation.');
        } catch (brevoError) {
          console.error('Brevo Error:', brevoError);
          setMessage('❌ Signup successful but failed to send confirmation email.');
        }
      } else {
        // --- SIGN IN ---
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        const userId = signInData.user.id;

        // --- ENSURE PROFILE EXISTS ---
        const { data: existing } = await supabase.from('profiles').select().eq('id', userId);
        if (!existing || existing.length === 0) {
          await supabase.from('profiles').insert([{
            id: userId,
            email: signInData.user.email,
            full_name: signInData.user.user_metadata?.full_name || '',
            role: signInData.user.user_metadata?.role || 'student',
            created_at: new Date(),
            is_verified: true,
          }]);
        }

        // --- OPTIONAL: check verification before redirect ---
        const profile = existing[0];
        if (profile && profile.is_verified === false) {
          setMessage('⚠️ Please verify your email before accessing dashboard.');
        } else {
          setMessage('🚀 Signed in successfully! Redirecting...');
          await router.push(`/${signInRole}/dashboard`);
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-cyan-500/50 rounded-3xl shadow-[0_0_60px_cyan] p-8 relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-cyan-400 rounded-3xl animate-pulse pointer-events-none"></div>

        {/* Toggle */}
        <div className="flex mb-8 border-b border-gray-600">
          <button onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 text-xl font-bold ${!isSignUp ? 'text-cyan-400 border-b-2' : 'text-gray-400'}`}>
            Sign In
          </button>
          <button onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 text-xl font-bold ${isSignUp ? 'text-cyan-400 border-b-2' : 'text-gray-400'}`}>
            Sign Up
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-center text-cyan-300 mb-6">
          {isSignUp ? 'Create Account' : 'Sign In to EDUSTARHUB'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isSignUp && (
            <div className="flex bg-gray-900 rounded-xl p-1 gap-2">
              <button type="button" onClick={() => setSignInRole('student')}
                className={`flex-1 py-3 rounded-xl font-bold ${signInRole === 'student' ? 'bg-cyan-600 text-black' : 'text-gray-400'}`}>
                Student
              </button>
              <button type="button" onClick={() => setSignInRole('teacher')}
                className={`flex-1 py-3 rounded-xl font-bold ${signInRole === 'teacher' ? 'bg-cyan-600 text-black' : 'text-gray-400'}`}>
                Teacher
              </button>
            </div>
          )}

          {isSignUp && (
            <>
              <FormInput label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} type="text" required />
              <select
                value={signUpRole}
                onChange={e => setSignUpRole(e.target.value)}
                className="w-full bg-gray-900 text-gray-200 rounded-xl p-3"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}

          <FormInput label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          <FormInput label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required />

          <button disabled={loading} className="w-full py-4 rounded-xl bg-cyan-500 font-bold text-black">
            {loading ? (isSignUp ? 'Creating...' : 'Signing In...') : (isSignUp ? 'Sign Up' : `Sign In as ${signInRole}`)}
          </button>

          {message && (
            <div className={`text-center font-semibold ${message.startsWith('❌') ? 'text-red-500' : 'text-green-400'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-gray-400">
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
