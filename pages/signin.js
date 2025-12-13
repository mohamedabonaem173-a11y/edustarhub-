import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Ensure this points to your configured client
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  // Controls the display of the success/review message
  const [submittedForReview, setSubmittedForReview] = useState(false); 


  // --- MANUAL ACCOUNT CREATION HANDLER ---
  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSubmittedForReview(false); // Reset on new attempt

    try {
      if (isSignUp) {
        // --- MANUAL SIGN UP LOGIC (Insertion to manual_signups table) ---
        
        // 1. Prepare data (Note: password is intentionally NOT stored here)
        const submissionData = {
          email,
          full_name: fullName, 
          role: signUpRole,
        };

        // 2. Insert the data into the manual_signups staging table
        const { error: insertError } = await supabase
          .from('manual_signups')
          .insert([submissionData]);

        if (insertError) {
          // Check for unique violation (email already submitted)
          if (insertError.code === '23505') { 
            throw new Error("This email is already registered for review. Please check your email inbox (or spam folder) for credentials.");
          }
          throw insertError;
        }
        
        // 3. Set success state to show the confirmation message
        setSubmittedForReview(true);
        
      } else {
        // --- ORIGINAL SIGN IN LOGIC (Remains UNCHANGED) ---
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        // Fetch the current user's actual role from the database for accurate redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single();

        const actualRole = profile?.role || signInRole; 

        setMessage('🚀 Signed in successfully! Redirecting...');
        await router.push(`/${actualRole}/dashboard`);
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setMessage('❌ Auth Error: ' + (err.message || 'An unknown error occurred.'));
    } finally {
      setLoading(false);
    }
  }

  // --- Component Rendering (JSX) ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-cyan-500/50 rounded-3xl shadow-[0_0_60px_cyan] p-8 relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-cyan-400 rounded-3xl animate-pulse mix-blend-overlay pointer-events-none"></div>

        {/* The main content block will be conditional based on submittedForReview */}
        {submittedForReview ? (
          
          <div className="text-center py-10 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-400 mb-6 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-300 mb-4 drop-shadow-lg">
              Application Received!
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              Thank you for requesting access to EDUSTARHUB.
            </p>
            <div className="bg-gray-900 border border-cyan-500/50 p-5 rounded-xl">
              <p className="text-lg font-semibold text-white">
                Your account is under **manual review**.
              </p>
              <p className="text-gray-400 mt-2">
                Please check your email (and spam folder) within the next **6 to 8 hours** for your personalized login credentials.
              </p>
            </div>
            <div className="mt-8 text-center text-gray-400 text-sm">
              <Link href="/" className="hover:text-cyan-400 transition">← Back to Home</Link>
            </div>
          </div>

        ) : (
          <>
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
              {isSignUp ? 'Request Account Access' : 'Sign In to EDUSTARHUB'}
            </h1>

            <form onSubmit={handleAuth} className="space-y-6">
              {/* Sign In Role Selection (Only needed for Sign In) */}
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

              {/* Sign Up Fields */}
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
                {loading ? (isSignUp ? 'Submitting Request...' : 'Signing In...') : (isSignUp ? 'Request Access' : `Sign In as ${signInRole}`)}
              </button>

              {message && <div className={`text-center mt-2 font-semibold ${message.startsWith('❌') ? 'text-red-500' : 'text-green-400'} animate-pulse`}>
                {message}
              </div>}
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
              {!isSignUp ? (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-cyan-400 font-bold hover:text-cyan-200 transition">Request access now</button>
                </span>
              ) : (
                <Link href="/" className="hover:text-cyan-400 transition">← Back to Home</Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}