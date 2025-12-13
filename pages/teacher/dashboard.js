import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// QuickStatCard component
const QuickStatCard = ({ title, value, colorClass, icon }) => (
  <div className={`bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px_${colorClass.replace('text-', '')}] flex flex-col items-center border-t-4 ${colorClass.replace('text-', 'border-')} hover:scale-105 transition-transform hover:shadow-[0_0_60px_${colorClass.replace('text-', '')}]`}>
    <div className="text-8xl mb-4 animate-pulse">{icon}</div>
    <h2 className={`text-2xl font-bold ${colorClass} mb-1`}>{title}</h2>
    <p className="text-gray-300 text-center text-lg">{value}</p>
  </div>
);

export default function TeacherDashboard() {
  const router = useRouter();
  const EXPECTED_ROLE = "teacher";

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [greeting, setGreeting] = useState("Welcome back, Professor!");

  useEffect(() => {
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

      // Pending login
      if (profile.status !== "approved") return router.push("/pending");

      // Role-based redirect
      if (profile.role !== EXPECTED_ROLE) return router.push(`/${profile.role}/dashboard`);

      setUserProfile(profile);
      const firstName = profile.full_name?.split(" ")[0] || "Professor";
      setGreeting(`Welcome back, ${firstName}!`);
      setLoading(false);
    }

    loadUserData();
  }, [router]);

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 text-3xl font-bold">
        Loading Teacher Dashboard...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col text-gray-100 bg-black">
      {/* Navbar */}
      <Navbar userRole="Teacher" />

      <div className="flex w-full max-w-7xl mx-auto pt-4 gap-6 flex-1 relative z-10">
        {/* Sidebar */}
        <Sidebar role={EXPECTED_ROLE} className="bg-gray-900/90 border-r-2 border-cyan-500 shadow-[0_0_30px_cyan] w-64" />

        {/* Main Content */}
        <main className="flex-1 p-10 flex flex-col gap-10">
          {/* Greeting Card */}
          <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_50px_cyan] flex flex-col md:flex-row items-center gap-6 border-l-8 border-cyan-400 hover:shadow-[0_0_70px_cyan] transition-all">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-lg">{greeting}</h1>
              <p className="text-gray-300 mt-3 text-lg md:text-xl drop-shadow">
                Here's an overview of your dashboard and latest activities.
              </p>
            </div>
            <div className="text-8xl md:text-9xl animate-bounce">👩‍🏫</div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <QuickStatCard title="Upload Mock Exams" value="Quickly upload PDFs and other exam resources." colorClass="text-cyan-400" icon="📄" />
            <QuickStatCard title="View Insights" value="Track student performance in real time." colorClass="text-green-400" icon="📊" />
            <QuickStatCard title="Manage Quizzes" value="Create, edit, and manage quizzes for your classes." colorClass="text-pink-400" icon="📝" />
          </div>

          {/* Quick Stats / Extra Info */}
          <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_50px_cyan] border-l-8 border-cyan-400 flex flex-col md:flex-row gap-6 items-center hover:shadow-[0_0_70px_cyan] transition-all">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-cyan-400 mb-3">Quick Stats</h3>
              <ul className="text-gray-300 list-disc list-inside text-lg">
                <li>Total students: {userProfile.total_students || 0}</li>
                <li>Active quizzes this week: 5</li>
                <li>Pending submissions: 12</li>
              </ul>
            </div>
            <div className="text-9xl md:text-[10rem] animate-bounce">📈</div>
          </div>
        </main>
      </div>
    </div>
  );
}
