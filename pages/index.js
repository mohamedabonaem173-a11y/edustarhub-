// pages/index.js

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a2240] text-[#e0e6ff]">

      {/* ========================================================= */}
      {/* TRUST BANNER */}
      <div id="top-trust-banner" className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 py-2 text-center shadow-md border-b border-white/20 overflow-hidden">
        <div className="text-white font-semibold tracking-wide">
          <span className="text-yellow-300 mr-2">⭐</span>
          Trusted Partner of Malvern College Egypt • IGCSE / GCSE Excellence • 100% Mastery-Driven Learning
          <span className="text-yellow-300 ml-2">⭐</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <div>
            <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight bg-clip-text text-white">
              EDUSTARHUB — <br className="hidden md:inline" />
              Focus on Mastery, <br className="hidden md:inline" />
              Not Management.
            </h1>

            <p className="mt-8 text-indigo-100 text-2xl font-light leading-relaxed">
              A unified platform dedicated to improving GCSE and IGCSE outcomes through 
              <strong className="text-cyan-300"> structured, adaptive practice</strong> and seamless 
              organization of teacher-created resources. We give educators the tools to focus on what 
              matters most — <strong className="text-cyan-300">student mastery</strong>.
            </p>

            <div className="mt-12 flex space-x-6">
              <a 
                href="/auth" 
                className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(56,189,248,0.6)] transition duration-300 transform hover:-translate-y-1"
              >
                Explore the Platform
              </a>

              <a 
                className="px-10 py-4 rounded-full border border-cyan-300 bg-[#0f1530] text-cyan-200 font-semibold shadow-md hover:bg-[#1b2550] transition duration-300" 
                href="#partnership"
              >
                View Partnership Story
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-[#11172e] rounded-3xl p-10 shadow-2xl border-t-4 border-cyan-400 transform transition-all duration-500">
              <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                📚 Core Pillars of EDUSTARHUB
              </h3>
              <ul className="space-y-5 text-indigo-100 text-lg">
                <li className="flex items-start">
                  <span className="text-cyan-400 text-2xl mr-4 -mt-1">✨</span> 
                  <strong className="text-cyan-300">Structured Assessment:</strong> Create and deploy comprehensive, standards-aligned practice tests effortlessly.
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 text-2xl mr-4 -mt-1">✅</span>
                  <strong className="text-cyan-300">Mastery Tracking:</strong> Automated scoring and analysis shift the focus to student progress, not just grading.
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 text-2xl mr-4 -mt-1">🧠</span>
                  <strong className="text-cyan-300">Guided Revision:</strong> Every question includes detailed explanations to guide student learning.
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 text-2xl mr-4 -mt-1">📂</span> 
                  Seamless centralized organization of all classroom resources.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PARTNERSHIP SECTION */}
        <section id="partnership" className="mt-28 md:mt-40 p-8 md:p-16 bg-[#0f1530] rounded-[40px] shadow-3xl border-2 border-cyan-400">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2">
              <p className="text-sm tracking-widest font-extrabold text-cyan-300 uppercase mb-3 bg-[#1b2550] px-3 py-1 inline-block rounded-full">
                OFFICIAL EDUCATIONAL PARTNERSHIP
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-200 leading-tight hover:underline decoration-cyan-400 decoration-4 underline-offset-4 transition">
                Trusted by Malvern College Egypt
              </h2>
              <p className="mt-4 text-indigo-200 text-xl leading-relaxed max-w-2xl">
                Our collaboration with one of Egypt's leading educational institutions ensures that our platform meets the highest standards for IGCSE and GCSE exam preparation. This is our benchmark for quality.
              </p>
              <a
                href="/malvern-exclusive-page"
                className="mt-8 inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-lg shadow-lg transition duration-300 transform hover:-translate-y-0.5"
              >
                See Our Impact at Malvern
              </a>
            </div>
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Mh32z2R2BuD_1gtNpGqI_C5llNRa-lBTWg&s"
                alt="Malvern College Egypt Campus"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00000088] to-transparent"></div>
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION */}
        <section id="value" className="mt-32 py-16">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-cyan-300 tracking-wide">
            Commitment to High-Quality Education
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-10 bg-[#11172e] rounded-2xl shadow-xl border-l-4 border-cyan-400 hover:shadow-2xl transition duration-300">
              <h3 className="text-3xl font-bold text-indigo-200 mb-4 flex items-center">
                👨‍🏫 For Educators: Efficiency & Focus
              </h3>
              <ul className="space-y-3 text-indigo-200 text-lg">
                <li className="flex items-start"><span className="text-cyan-400 text-xl mr-3">•</span> <strong>Content Creation:</strong> Quickly generate high-quality practice tests from any topic or document.</li>
                <li className="flex items-start"><span className="text-cyan-400 text-xl mr-3">•</span> <strong>Consistency:</strong> Ensure every student receives the same structured materials and resources.</li>
                <li className="flex items-start"><span className="text-cyan-400 text-xl mr-3">•</span> <strong>Resource Management:</strong> A single, secure hub for all teaching files.</li>
              </ul>
            </div>

            <div className="p-10 bg-[#11172e] rounded-2xl shadow-xl border-l-4 border-indigo-500 hover:shadow-2xl transition duration-300">
              <h3 className="text-3xl font-bold text-cyan-300 mb-4 flex items-center">
                🚀 For Students: Ownership & Engagement
              </h3>
              <ul className="space-y-3 text-indigo-200 text-lg">
                <li className="flex items-start"><span className="text-indigo-400 text-xl mr-3">•</span> <strong>Accessibility:</strong> 24/7 access to all necessary revision guides and practice materials.</li>
                <li className="flex items-start"><span className="text-indigo-400 text-xl mr-3">•</span> <strong>Active Revision:</strong> Interactive quizzes and activities promote recall.</li>
                <li className="flex items-start"><span className="text-indigo-400 text-xl mr-3">•</span> <strong>Confidence Building:</strong> Instant feedback helps students self-correct and build mastery.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section id="how" className="mt-24 py-16 bg-[#0f1530] rounded-3xl shadow-xl border border-cyan-300/40">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-cyan-300">
            The 3-Step Educational Workflow
          </h2>
          <div className="grid md:grid-cols-3 gap-10 px-10">
            <div className="p-8 bg-[#11172e] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-indigo-200 mb-3">1. Unify Accounts</h4>
              <p className="text-indigo-200 leading-relaxed">Teachers and students securely create accounts based on their roles.</p>
            </div>
            <div className="p-8 bg-[#11172e] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-indigo-200 mb-3">2. Structure Content</h4>
              <p className="text-indigo-200 leading-relaxed">Teachers create topic-based structured practice tests with explanations.</p>
            </div>
            <div className="p-8 bg-[#11172e] rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-indigo-200 mb-3">3. Activate Learning</h4>
              <p className="text-indigo-200 leading-relaxed">Students access personalized dashboards, quizzes, and active revision tools.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA – FREE OFFER */}
        <section className="mt-24 text-center p-16 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-xl">
            Ready to Transform Your Outcomes?
          </h2>
          <p className="text-indigo-100 text-xl mb-6">
            For a limited time, EDUSTARHUB is completely FREE while we finalize our early-access program.
          </p>

          <div className="mt-6 p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 max-w-md mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Early Access Offer</h3>
            <p className="text-4xl font-extrabold text-green-300 mb-3">FREE</p>
            <p className="text-white/80 text-lg mb-4">Full Access • Limited Time • No Payment Required</p>

            <button 
              onClick={() => { window.location.href = '/auth'; }} 
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all w-full"
            >
              Start Free Access
            </button>
          </div>
        </section>

      </main>

      <footer className="max-w-7xl mx-auto px-6 py-10 text-center text-indigo-300 text-sm">
        &copy; {new Date().getFullYear()} EDUSTARHUB. Dedicated to educational excellence.
      </footer>
    </div>
  );
}
