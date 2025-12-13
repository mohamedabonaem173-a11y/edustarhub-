import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

const FormInput = ({ label, value, onChange, type, required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-200 mb-1">{label}</label>
    <input
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      placeholder={`Enter your ${label.toLowerCase()}`}
      className="w-full border border-gray-700 rounded-xl p-4 pl-5 bg-gray-900 text-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-lg placeholder-gray-500"
    />
  </div>
);

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpRole, setSignUpRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submittedForReview, setSubmittedForReview] = useState(false);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSubmittedForReview(false);

    try {
      if (isSignUp) {
        // Manual signup (no password stored)
        const { error: insertError } = await supabase
          .from("manual_signups")
          .insert([{ email, full_name: fullName, role: signUpRole }]);
        if (insertError) throw insertError;
        setSubmittedForReview(true);
      } else {
        // Sign in
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", signInData.user.id)
          .single();

        if (profileError || !profile) {
          setMessage(
            "❌ Profile not found. Please contact support."
          );
          return;
        }

        // Pending users
        if (profile.status !== "approved") {
          await router.push("/pending");
          return;
        }

        // Role-based redirect
        if (!profile.role) {
          await router.push("/pending");
          return;
        }

        await router.push(`/${profile.role}/dashboard`);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setMessage("❌ Auth Error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-cyan-500/50 rounded-3xl shadow-[0_0_60px_cyan] p-8 relative overflow-hidden">
        {submittedForReview ? (
          <div className="text-center py-10 px-4">
            <h1 className="text-3xl font-extrabold text-cyan-300 mb-4">
              Application Received!
            </h1>
            <p className="text-gray-300 mb-6">
              Your account is under manual review. Check your email for approval.
            </p>
            <Link href="/" className="text-cyan-400 hover:text-cyan-200">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="flex mb-8 border-b border-gray-600">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 text-xl font-bold transition ${
                  !isSignUp
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 text-xl font-bold transition ${
                  isSignUp
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {isSignUp && (
                <>
                  <FormInput
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    required
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                      Account Type
                    </label>
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value)}
                      className="w-full border border-gray-700 bg-gray-900 text-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                </>
              )}

              <FormInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <FormInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-bold text-lg shadow-[0_0_30px_cyan] hover:shadow-[0_0_50px_cyan] transition-all transform hover:-translate-y-1 disabled:opacity-50"
              >
                {loading
                  ? isSignUp
                    ? "Submitting Request..."
                    : "Signing In..."
                  : isSignUp
                  ? "Request Access"
                  : "Sign In"}
              </button>
              {message && (
                <div
                  className={`text-center mt-2 font-semibold ${
                    message.startsWith("❌") ? "text-red-500" : "text-green-400"
                  } animate-pulse`}
                >
                  {message}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
