// pages/teacher/insights.js
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useEffect } from 'react';

export default function TeacherInsightsComingSoon() {
  const role = 'teacher';

  // --- Techy background animation ---
  useEffect(() => {
    const canvas = document.getElementById('techy-bg');
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

    animate();
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col text-gray-100 bg-black">

      {/* Techy background canvas */}
      <canvas id="techy-bg" className="absolute inset-0 w-full h-full z-0"></canvas>

      {/* Navbar */}
      <Navbar userRole="Teacher" />

      {/* Layout with Sidebar inside */}
      <div className="flex w-full max-w-7xl mx-auto pt-4 gap-6 flex-1 relative z-10">

        {/* Sidebar */}
        <Sidebar role={role} className="bg-gray-900/90 border-r-2 border-cyan-500 shadow-[0_0_30px_cyan] w-64" />

        {/* Main Content */}
        <main className="flex-1 p-10 flex flex-col items-center justify-center gap-12">

          {/* Header / Coming Soon Card */}
          <div className="bg-gray-900/80 p-10 rounded-3xl shadow-[0_0_50px_cyan] text-center border-t-8 border-cyan-400 flex flex-col items-center gap-6 hover:shadow-[0_0_70px_cyan] transition-all">
            <div className="text-9xl animate-bounce">📊🔍</div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-lg">
              Insights Hub Coming Soon!
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl max-w-2xl drop-shadow">
              Track student progress, view analytics, and gain actionable insights.  
              Soon you'll be able to make data-driven decisions with ease.
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px-purple] border-l-8 border-purple-500 flex flex-col md:flex-row items-center gap-6 hover:shadow-[0_0_60px-purple] transition-all">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-400 mb-2 drop-shadow">
                📈 Progress & Performance
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                Analyze quizzes, mock exams, and other metrics to identify top performers and students needing support.
              </p>
            </div>
            <div className="text-8xl md:text-9xl animate-spin">🧠</div>
          </div>

          {/* Reminder Section */}
          <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px-green] border-l-8 border-green-500 flex flex-col md:flex-row items-center gap-6 hover:shadow-[0_0_60px-green] transition-all">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-2 drop-shadow">
                ⏳ Stay Tuned!
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                The Insights Hub is under development. Check back soon to explore powerful analytics for your students.
              </p>
            </div>
            <div className="text-8xl md:text-9xl animate-bounce">🚀</div>
          </div>

        </main>
      </div>
    </div>
  );
}
