// pages/student/games.js
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

export default function StudentGamesComingSoon() {
  const role = 'student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col">
      {/* Navbar */}
      <Navbar userRole="Student" />

      <div className="max-w-7xl mx-auto flex pt-4 gap-6 flex-1">
        {/* Sidebar */}
        <Sidebar role={role} />

        {/* Main content */}
        <main className="flex-1 p-12 flex flex-col items-center justify-center gap-12">

          {/* Header Section */}
          <div className="bg-black/30 p-10 rounded-3xl shadow-[0_0_25px_cyan] border-t-8 border-cyan-500 text-center flex flex-col items-center gap-6">
            <div className="text-9xl animate-bounce">🕹️🎉</div>
            <h1 className="text-5xl font-extrabold text-cyan-400">Games Hub Coming Soon!</h1>
            <p className="text-gray-300 text-xl max-w-2xl">
              Get ready for exciting tournaments, awesome prizes, and endless fun!  
              Sharpen your skills and compete with fellow students soon.
            </p>
          </div>

          {/* Tournaments & Prizes */}
          <div className="bg-black/20 p-6 rounded-2xl shadow-[0_0_20px_cyan] border-l-8 border-purple-500 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">🏆 Tournaments & Prizes</h2>
              <p className="text-gray-300 text-lg">
                Participate in friendly competitions and earn cool rewards.  
                Everyone has a chance to win — so get ready to play!
              </p>
            </div>
            <div className="text-8xl animate-spin">🎁</div>
          </div>

          {/* Stay Tuned Section */}
          <div className="bg-black/20 p-6 rounded-2xl shadow-[0_0_20px_cyan] border-l-8 border-green-500 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-green-400 mb-2">⏳ Stay Tuned!</h2>
              <p className="text-gray-300 text-lg">
                The Games Hub will launch soon. Make sure to check back for updates and tournament schedules!
              </p>
            </div>
            <div className="text-8xl animate-bounce">📅</div>
          </div>

        </main>
      </div>

      {/* Subtle animated neon particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-pulse"
            style={{
              width: `${Math.random()*4 + 1}px`,
              height: `${Math.random()*4 + 1}px`,
              backgroundColor: `rgba(0,255,255,${Math.random()*0.4})`,
              top: `${Math.random()*100}%`,
              left: `${Math.random()*100}%`,
              animationDelay: `${Math.random()*5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
