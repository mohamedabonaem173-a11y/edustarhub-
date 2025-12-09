// pages/student/dashboard.js
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

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

// Neon tech-style StatCard
const StatCard = ({ title, value, icon, color, progress }) => (
  <div className={`relative p-6 rounded-2xl shadow-[0_0_20px_${color}] border-2 border-${color} bg-black/20 hover:scale-105 transition-transform cursor-pointer`}>
    <div
      className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${color} text-black text-4xl`}
    >
      {icon}
    </div>
    <p className="text-sm font-semibold text-gray-300">{title}</p>
    <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    {progress && (
      <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
    <div className={`absolute top-2 right-2 text-${color} text-xl animate-pulse select-none`}>⚡</div>
  </div>
);

export default function StudentDashboard() {
  const role = "student";
  const [quote, setQuote] = useState("");
  const [stats, setStats] = useState({
    gamePoints: 0,
    resourcesDownloaded: 0,
    buddyName: "Buddy",
    motivation: "Keep going!",
  });

  useEffect(() => {
    setStats({
      gamePoints: randomNumber(500),
      resourcesDownloaded: randomNumber(50),
      buddyName: ["Alex", "Jamie", "Taylor", "Sam"][randomNumber(4)],
      motivation: ["You got this!", "Keep going!", "Almost there!"][randomNumber(3)],
    });

    setQuote(funnyQuotes[randomNumber(funnyQuotes.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans relative overflow-hidden">
      {/* Navbar */}
      <Navbar userRole="Student" />

      <div className="max-w-7xl mx-auto flex pt-6 gap-6">
        {/* Sidebar */}
        <Sidebar role={role} />

        {/* Main Content */}
        <div className="flex-1 relative">
          <main className="p-6 space-y-10">
            {/* Welcome */}
            <div className="relative bg-black/20 backdrop-blur-md rounded-3xl shadow-[0_0_40px_cyan] p-8 text-white flex flex-col md:flex-row items-center overflow-hidden border-2 border-cyan-500">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400">
                  Welcome Back, Student!
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
                  progress={(stats.gamePoints % 100) + 1}
                />
                <StatCard
                  title="Resources Downloaded"
                  value={stats.resourcesDownloaded}
                  icon="📚"
                  color="text-blue-500"
                  progress={(stats.resourcesDownloaded * 2) % 100}
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

      {/* Techy background glows */}
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
