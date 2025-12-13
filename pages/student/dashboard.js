// pages/student/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js"; // Necessary for Auth and Data Fetching
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// --- Supabase Initialization (Must use your ENV variables) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fun quotes
const funnyQuotes = [
  "Your brain is a supercomputer. Don't forget to plug in. 🤯",
  "Keep calm and pretend you understand everything. 😎",
  "Math is hard, coffee is easy. ☕",
  "Learning today, bossing tomorrow. 💪",
  "Brain loading… please wait… 🧠💻",
  "Knowledge is power… and snacks are life. 🍕",
  "Turn that frown into a degree! 🎓",
  "One small step for study, one giant leap for your GPA!"
];

const randomNumber = (max) => Math.floor(Math.random() * max);

// Neon tech-style StatCard (remains the same)
const StatCard = ({ title, value, icon, color, progress }) => (
  <div className={`relative p-6 rounded-2xl shadow-[0_0_20px_${color.split('-')[1]}] border-2 border-${color.split('-')[1]} bg-black/20 hover:scale-105 transition-transform cursor-pointer`}>
    <div
      className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${color.replace('text-', 'bg-')} text-black text-4xl`}
    >
      {icon}
    </div>
    <p className="text-sm font-semibold text-gray-300">{title}</p>
    <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    {progress !== undefined && (
      <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
        <div
          className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
    <div className={`absolute top-2 right-2 text-${color.split('-')[1]} text-xl animate-pulse select-none`}>⚡</div>
  </div>
);

export default function StudentDashboard() {
  const router = useRouter();
  const EXPECTED_ROLE = "student";
  
  // State for loading and user profile data
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  // State for the random quote
  const [quote, setQuote] = useState("");
  
  // State for the stats, initialized to zero/loading state
  const [stats, setStats] = useState({
    gamePoints: 0,
    resourcesDownloaded: 0,
    buddyName: "Loading...",
    motivation: "Checking credentials...",
  });

  // --- 1. Authentication and Data Fetching Effect ---
  useEffect(() => {
    setQuote(funnyQuotes[randomNumber(funnyQuotes.length)]);

    async function loadUserData() {
      setLoading(true);
      
      // A. Check for authenticated user session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in: Redirect to sign-in page
        router.push("/signin");
        return;
      }
      
      // B. Fetch the user's specific profile data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, role, game_points, resources_downloaded, buddy_name, buddy_avatar")
        // Use 'id' column, which stores the user's UUID
        .eq("id", user.id) 
        .single();

      if (error || !profile) {
        console.error("Profile Fetch Error:", error?.message || "Profile not found.");
        supabase.auth.signOut();
        router.push("/signin?error=profile_missing");
        return;
      }

      // C. Role Verification
      if (profile.role !== EXPECTED_ROLE) {
        console.warn(`User is a ${profile.role} attempting to access ${EXPECTED_ROLE} dashboard.`);
        // Redirect to the correct dashboard or sign-in
        router.push(`/${profile.role}/dashboard`);
        return;
      }

      // D. Update state with real data
      setUserProfile(profile);
      setStats({
        gamePoints: profile.game_points || 0,
        resourcesDownloaded: profile.resources_downloaded || 0,
        buddyName: profile.buddy_name || "New Buddy",
        motivation: profile.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}!` : "Keep learning!",
      });
      setLoading(false);
    }

    loadUserData();
  }, [router]);

  // --- 2. Loading and Error State Renderer ---
  if (loading || !userProfile) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] to-[#24243e] text-cyan-400 text-3xl font-bold">
            <p className="animate-pulse">Loading Student Dashboard...</p>
        </div>
    );
  }
  
  // Use the real full_name for the welcome message
  const welcomeName = userProfile.full_name || "Student";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans relative overflow-hidden">
      {/* Navbar */}
      <Navbar userRole="Student" />

      <div className="max-w-7xl mx-auto flex pt-6 gap-6">
        {/* Sidebar */}
        <Sidebar role={EXPECTED_ROLE} />

        {/* Main Content */}
        <div className="flex-1 relative">
          <main className="p-6 space-y-10">
            {/* Welcome */}
            <div className="relative bg-black/20 backdrop-blur-md rounded-3xl shadow-[0_0_40px_cyan] p-8 text-white flex flex-col md:flex-row items-center overflow-hidden border-2 border-cyan-500">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400">
                  Welcome Back, {welcomeName}!
                </h1>
                <p className="text-lg md:text-xl italic text-blue-300">"{quote}"</p>
              </div>
            </div>

            {/* Stats Cards */}
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-shadow-lg">
                Your Stats
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Game Points"
                  value={stats.gamePoints}
                  icon="🎮"
                  color="text-purple-500"
                  // Calculate progress based on actual points vs a target (e.g., 500)
                  progress={Math.min(100, (stats.gamePoints / 500) * 100)} 
                />
                <StatCard
                  title="Resources Downloaded"
                  value={stats.resourcesDownloaded}
                  icon="📚"
                  color="text-blue-500"
                  progress={Math.min(100, (stats.resourcesDownloaded / 25) * 100)} // e.g., target 25
                />
                <StatCard
                  title="Buddy Name"
                  value={stats.buddyName}
                  icon="👯"
                  color="text-pink-500"
                />
                <StatCard
                  title="Motivation"
                  value={stats.motivation}
                  icon="🔥"
                  color="text-green-500"
                />
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ... (Techy background glows and style tag) ... */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-50 animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: `rgba(0,255,255,${Math.random()})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 2px 8px rgba(0,255,255,0.6);
        }
      `}</style>
    </div>
  );
}