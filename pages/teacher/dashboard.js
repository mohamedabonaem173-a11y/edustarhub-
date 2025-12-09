// pages/teacher/dashboard.js
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useState, useEffect } from 'react';

export default function TeacherDashboard() {
  const role = 'teacher';
  const [greeting] = useState('Welcome back, Professor!');

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

      {/* Main layout */}
      <div className="flex w-full max-w-7xl mx-auto pt-4 gap-6 flex-1 relative z-10">

        {/* Sidebar */}
        <Sidebar role={role} className="bg-gray-900/90 border-r-2 border-cyan-500 shadow-[0_0_30px_cyan] w-64" />

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
            <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px_cyan] flex flex-col items-center border-t-4 border-cyan-400 hover:scale-105 transition-transform hover:shadow-[0_0_60px_cyan]">
              <div className="text-8xl mb-4 animate-pulse">📄</div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-1">Upload Mock Exams</h2>
              <p className="text-gray-300 text-center text-lg">
                Quickly upload PDFs and other exam resources for students.
              </p>
            </div>

            <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px-green] flex flex-col items-center border-t-4 border-green-400 hover:scale-105 transition-transform hover:shadow-[0_0_60px-green]">
              <div className="text-8xl mb-4 animate-pulse">📊</div>
              <h2 className="text-2xl font-bold text-green-400 mb-1">View Insights</h2>
              <p className="text-gray-300 text-center text-lg">
                Track student performance and engagement in real time.
              </p>
            </div>

            <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_40px-pink] flex flex-col items-center border-t-4 border-pink-400 hover:scale-105 transition-transform hover:shadow-[0_0_60px-pink]">
              <div className="text-8xl mb-4 animate-pulse">📝</div>
              <h2 className="text-2xl font-bold text-pink-400 mb-1">Manage Quizzes</h2>
              <p className="text-gray-300 text-center text-lg">
                Create, edit, and manage quizzes for your classes.
              </p>
            </div>
          </div>

          {/* Stats / Extra Section */}
          <div className="bg-gray-900/80 p-8 rounded-3xl shadow-[0_0_50px-cyan] border-l-8 border-cyan-400 flex flex-col md:flex-row gap-6 items-center hover:shadow-[0_0_70px_cyan] transition-all">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-cyan-400 mb-3">Quick Stats</h3>
              <ul className="text-gray-300 list-disc list-inside text-lg">
                <li>Total students: 120</li>
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
