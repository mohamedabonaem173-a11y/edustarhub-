import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// Fun quotes for dashboard
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

// Stat Card component
const StatCard = ({ title, value, icon, color, progress }) => (
  <div className={`relative p-6 rounded-2xl shadow-[0_0_20px_${color.split('-')[1]}] border-2 border-${color.split('-')[1]} bg-black/20 hover:scale-105 transition cursor-pointer`}>
    <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${color.replace('text-', 'bg-')} text-black text-4xl`}>
      {icon}
    </div>
    <p className="text-sm font-semibold text-gray-300">{title}</p>
    <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    {progress !== undefined && (
      <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
        <div className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }} />
      </div>
    )}
    <div className={`absolute top-2 right-2 text-${color.split('-')[1]} text-xl animate-pulse select-none`}>⚡</div>
  </div>
);

export default function StudentDashboard() {
  const router = useRouter();
  const EXPECTED_ROLE = "student";

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [quote, setQuote] = useState("");
  const [stats, setStats] = useState({
    gamePoints: 0,
    resourcesDownloaded: 0,
    buddyName: "Loading...",
    motivation: "Checking credentials..."
  });

  // --- Load user data and enforce role/status
  useEffect(() => {
    setQuote(funnyQuotes[randomNumber(funnyQuotes.length)]);

    async function loadUserData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return router.push("/auth");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile || error) return router.push("/auth");

      // Pending login logic
      if (profile.status !== "approved") return router.push("/pending");

      // Role check
      if (profile.role !== EXPECTED_ROLE) return router.push(`/${profile.role}/dashboard`);

      setUserProfile(profile);
      setStats({
        gamePoints: profile.game_points || 0,
        resourcesDownloaded: profile.resources_downloaded || 0,
        buddyName: profile.buddy_name || "New Buddy",
        motivation: `Welcome back, ${profile.full_name.split(' ')[0]}!`
      });
      setLoading(false);
    }

    loadUserData();
  }, [router]);

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] to-[#24243e] text-cyan-400 text-3xl font-bold">
        Loading Student Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans relative overflow-hidden">
      <Navbar userRole="Student" />
      <div className="max-w-7xl mx-auto flex pt-6 gap-6">
        <Sidebar role={EXPECTED_ROLE} />

        <div className="flex-1 relative">
          <main className="p-6 space-y-10">
            {/* Welcome */}
            <div className="relative bg-black/20 backdrop-blur-md rounded-3xl shadow-[0_0_40px_cyan] p-8 text-white flex flex-col md:flex-row items-center overflow-hidden border-2 border-cyan-500">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400">
                  Welcome Back, {userProfile.full_name.split(" ")[0]}!
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
                <StatCard title="Game Points" value={stats.gamePoints} icon="🎮" color="text-purple-500" progress={Math.min(100, (stats.gamePoints / 500) * 100)} />
                <StatCard title="Resources Downloaded" value={stats.resourcesDownloaded} icon="📚" color="text-blue-500" progress={Math.min(100, (stats.resourcesDownloaded / 25) * 100)} />
                <StatCard title="Buddy Name" value={stats.buddyName} icon="👯" color="text-pink-500" />
                <StatCard title="Motivation" value={stats.motivation} icon="🔥" color="text-green-500" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
