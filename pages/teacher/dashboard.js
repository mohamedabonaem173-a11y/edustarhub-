// pages/teacher/dashboard.js
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // 👈 New Import
import { createClient } from "@supabase/supabase-js"; // 👈 New Import

// --- Supabase Initialization (Must use your ENV variables) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TeacherDashboard() {
  const router = useRouter();
  const EXPECTED_ROLE = 'teacher';
  
  // State for loading and user profile data
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [greeting, setGreeting] = useState('Welcome back, Professor!'); // Initial placeholder

  // --- 1. Authentication and Data Fetching Effect ---
  useEffect(() => {
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
        .select("full_name, role, total_students") // Example of fetching teacher-specific data
        .eq("id", user.id) // Use 'id' column, which stores the user's UUID
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
        // Redirect to the correct dashboard (e.g., /student/dashboard)
        router.push(`/${profile.role}/dashboard`);
        return;
      }

      // D. Update state with real data
      setUserProfile(profile);
      const name = profile.full_name?.split(' ')[0] || 'Professor'; // Get first name or default
      setGreeting(`Welcome back, ${name}!`);
      setLoading(false);
    }

    loadUserData();
    
    // --- 2. Existing Techy background animation (moved inside function for clarity) ---
    const canvas = document.getElementById('techy-bg');
    if (!canvas) return; // Guard against missing canvas
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    }));

    function animate() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(0,255,255,${1 - dist / 150})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    const animationFrameId = requestAnimationFrame(animate);
    
    // Cleanup function for the animation
    return () => cancelAnimationFrame(animationFrameId);

  }, [router]);
  
  // --- 3. Loading State Renderer ---
  if (loading || !userProfile) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400 text-3xl font-bold">
            <p className="animate-pulse">Loading Teacher Dashboard...</p>
        </div>
    );
  }


  // Helper component for Stat Cards using real data
  const QuickStatCard = ({ title, value, colorClass, icon }) => (
    <div className={`bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px_${colorClass.replace('text-', '')}] flex flex-col items-center border-t-4 ${colorClass.replace('text-', 'border-')} hover:scale-105 transition-transform hover:shadow-[0_0_60px_${colorClass.replace('text-', '')}]`}>
      <div className="text-8xl mb-4 animate-pulse">{icon}</div>
      <h2 className={`text-2xl font-bold ${colorClass} mb-1`}>{title}</h2>
      <p className="text-gray-300 text-center text-lg">
        {value}
      </p>
    </div>
  );


  // --- 4. Render the Dashboard with Real Data ---
  return (
    <div className="relative min-h-screen flex flex-col text-gray-100 bg-black">
      {/* Techy background canvas */}
      <canvas id="techy-bg" className="absolute inset-0 w-full h-full z-0"></canvas>

      {/* Navbar */}
      <Navbar userRole="Teacher" />

      {/* Main layout */}
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

          {/* Quick Actions (Keep these static, as they are links/actions) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <QuickStatCard title="Upload Mock Exams" value="Quickly upload PDFs and other exam resources." colorClass="text-cyan-400" icon="📄" />
            <QuickStatCard title="View Insights" value="Track student performance in real time." colorClass="text-green-400" icon="📊" />
            <QuickStatCard title="Manage Quizzes" value="Create, edit, and manage quizzes for your classes." colorClass="text-pink-400" icon="📝" />
          </div>

          {/* Stats / Extra Section (Use real data if available in profile) */}
          <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_50px-cyan] border-l-8 border-cyan-400 flex flex-col md:flex-row gap-6 items-center hover:shadow-[0_0_70px_cyan] transition-all">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-cyan-400 mb-3">Quick Stats</h3>
              <ul className="text-gray-300 list-disc list-inside text-lg">
                {/* Placeholder data replaced by real data structure if you add it */}
                <li>Total students: {userProfile.total_students || 120}</li> 
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