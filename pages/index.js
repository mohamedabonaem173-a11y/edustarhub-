import Link from 'next/link';
// import Navbar from '../components/Navbar'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* <Navbar /> */}
      
      <main className="max-w-7xl mx-auto px-6 py-20"> 
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-indigo-800 tracking-tight">
              EDUSTARHUB — <br className="hidden md:inline"/>Focus on Mastery, <br className="hidden md:inline"/>Not Management.
            </h1>
            
            {/* 🛑 UPGRADED PITCH: Focus on Structured Practice and Teacher Support 🛑 */}
            <p className="mt-8 text-gray-700 text-xl leading-relaxed">
              A unified platform dedicated to improving GCSE and IGCSE outcomes through **structured, adaptive practice** and the seamless organization of teacher-created resources. We streamline content creation so educators can focus purely on teaching.
            </p>

            <div className="mt-12 flex space-x-6">
              {/* Primary CTA Button */}
              <Link 
                href="/auth" 
                className="px-10 py-4 rounded-full bg-violet-600 text-white font-bold text-lg shadow-xl hover:bg-violet-700 transition transform hover:-translate-y-1" 
              >
                Explore the Platform
              </Link>
              {/* Secondary CTA Button */}
              <a 
                className="px-10 py-4 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow-md hover:bg-gray-100 transition" 
                href="#value"
              >
                View Educational Philosophy
              </a>
            </div>
          </div>

          {/* Right Column: Why EDUSTARHUB Card (Focusing on Structured Assessment) */}
          <div>
            <div className="bg-white rounded-3xl p-10 shadow-2xl border-t-4 border-violet-500 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                📚 Core Pillars of EDUSTARHUB
              </h3>
              <ul className="space-y-4 text-gray-700 text-lg">
                
                {/* Replaced AI/Instant with Educational Value */}
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">✨</span> 
                  **Structured Assessment:** Create and deploy comprehensive, standards-aligned practice tests effortlessly.
                </li>
                
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">✅</span>
                  **Mastery Tracking:** Automated scoring and analysis shift the focus to student progress, not just grading.
                </li>
                
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">🧠</span>
                  **Guided Revision:** Every question includes built-in, detailed explanations to guide student learning.
                </li>
                
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">📂</span> 
                  Seamless centralized organization of all classroom resources.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* New Section: Value Proposition (Teacher vs. Student) */}
        <section id="value" className="mt-32 py-16">
            <h2 className="text-4xl font-extrabold mb-12 text-center text-indigo-800">Commitment to High-Quality Education</h2>
            <div className="grid md:grid-cols-2 gap-10">
                
                {/* Teacher Benefits */}
                <div className="p-10 bg-white rounded-2xl shadow-xl border-l-4 border-indigo-500">
                    <h3 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                        👨‍🏫 For Educators: Efficiency & Focus
                    </h3>
                    <ul className="space-y-3 text-gray-700 text-lg">
                        <li className="flex items-start">
                            <span className="text-indigo-500 text-xl mr-3">•</span> 
                            **Content Creation:** Quickly generate high-quality practice tests from any topic or document.
                        </li>
                        <li className="flex items-start">
                            <span className="text-indigo-500 text-xl mr-3">•</span> 
                            **Consistency:** Ensure every student receives the same structured materials and resources.
                        </li>
                        <li className="flex items-start">
                            <span className="text-indigo-500 text-xl mr-3">•</span> 
                            **Resource Management:** A single, secure hub for all department-wide teaching files.
                        </li>
                    </ul>
                </div>

                {/* Student Benefits */}
                <div className="p-10 bg-white rounded-2xl shadow-xl border-l-4 border-violet-500">
                    <h3 className="text-3xl font-bold text-violet-600 mb-4 flex items-center">
                        🚀 For Students: Ownership & Engagement
                    </h3>
                    <ul className="space-y-3 text-gray-700 text-lg">
                        <li className="flex items-start">
                            <span className="text-violet-500 text-xl mr-3">•</span> 
                            **Accessibility:** 24/7 access to all necessary revision guides and practice materials.
                        </li>
                        <li className="flex items-start">
                            <span className="text-violet-500 text-xl mr-3">•</span> 
                            **Active Revision:** Interactive quizzes and engaging activities (like the Quiz Bowl we planned) promote recall.
                        </li>
                        <li className="flex items-start">
                            <span className="text-violet-500 text-xl mr-3">•</span> 
                            **Confidence Building:** Instant, detailed feedback helps students self-correct and build mastery.
                        </li>
                    </ul>
                </div>
            </div>
        </section>


        {/* How it works section (Updated to reflect the Structured workflow) */}
        <section id="how" className="mt-24 py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-indigo-800">The 3-Step Educational Workflow</h2>
          <div className="grid md:grid-cols-3 gap-10 px-10">
            
            {/* Step 1: Sign up (Keep this) */}
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-violet-600 mb-3">1. Unify Accounts</h4>
              <p className="text-gray-700 leading-relaxed">Teachers and students securely create accounts based on their specific educational roles.</p>
            </div>
            
            {/* Step 2: Content Creation (Focus on Structured content) */}
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-violet-600 mb-3">2. Structure Content</h4>
              <p className="text-gray-700 leading-relaxed">Teachers quickly structure topic-based practice tests, complete with explanations, ready for immediate deployment.</p>
            </div>
            
            {/* Step 3: Students Engage (Focus on active learning) */}
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-violet-600 mb-3">3. Activate Learning</h4>
              <p className="text-gray-700 leading-relaxed">Students access their personalized dashboards for resources, take structured quizzes, and engage in active revision.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="max-w-7xl mx-auto px-6 py-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} EDUSTARHUB. Dedicated to educational excellence.
      </footer>
    </div>
  )
}