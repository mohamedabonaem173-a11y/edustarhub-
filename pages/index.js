// Removed: import Link from 'next/link';

// FIX: The previous URL was inaccessible. Using a new, high-confidence public image 
// retrieved for "Malvern College Egypt campus building exterior photo".
const MALVERN_LOGO_URL = "http://googleusercontent.com/image_collection/image_retrieval/9508313263464244761"; // Not used, but kept for context

export default function Home() {
  return (
    // CHANGE: Adjusted background to 'from-indigo-50' for a slightly more professional/deep hue
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      
      {/* ========================================================= */}
      {/* NEW: STATIC, HIGH-VISIBILITY TRUST BANNER (Non-scrolling) */}
      {/* Placed BEFORE the main content to maximize visibility */}
      {/* ========================================================= */}
      <div id="top-trust-banner" className="w-full bg-violet-700 py-2 text-center shadow-lg">
        <p className="text-sm md:text-base font-semibold text-white tracking-widest uppercase">
          <span className="text-yellow-300 mr-2">⭐</span> 
          Trusted Partner of Malvern College Egypt for IGCSE/GCSE Excellence
          <span className="text-yellow-300 ml-2">⭐</span>
        </p>
      </div>
      {/* <Navbar /> -- This is where the navbar would typically go */}
      
      <main className="max-w-7xl mx-auto px-6 py-20"> 
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div>
            {/* CHANGE: Increased text size on mobile (6xl) and desktop (8xl) for stronger impact */}
            <h1 className="text-6xl md:text-8xl font-extrabold leading-tight text-indigo-900 tracking-tight">
              EDUSTARHUB — <br className="hidden md:inline"/>Focus on Mastery, <br className="hidden md:inline"/>Not Management.
            </h1>
            
            {/* 🛑 UPGRADED PITCH: Focus on Structured Practice and Teacher Support 🛑 */}
            {/* CHANGE: Darkened text color and increased size/weight for better readability and authority */}
            <p className="mt-8 text-gray-800 text-2xl font-light leading-relaxed">
              A unified platform dedicated to improving GCSE and IGCSE outcomes through **structured, adaptive practice** and the seamless organization of teacher-created resources. We streamline content creation so educators can focus purely on teaching.
            </p>

            <div className="mt-12 flex space-x-6">
              {/* Primary CTA Button */}
              {/* CHANGE: Enhanced shadow and transition for a premium feel */}
              <a 
                href="/auth" 
                className="px-10 py-4 rounded-full bg-violet-600 text-white font-bold text-lg shadow-2xl hover:bg-violet-700 transition duration-300 transform hover:-translate-y-1 hover:ring-4 ring-violet-300" 
              >
                Explore the Platform
              </a>
              {/* Secondary CTA Button */}
              <a 
                className="px-10 py-4 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow-md hover:bg-gray-100 transition duration-300" 
                href="#partnership" 
              >
                View Partnership Story
              </a>
            </div>
          </div>

          {/* Right Column: Why EDUSTARHUB Card (Focusing on Structured Assessment) */}
          <div>
            {/* CHANGE: Added a rotation hover effect to make the card more dynamic and drew the border-top color from the headline */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl border-t-4 border-indigo-700 transform hover:rotate-1 transition-all duration-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                📚 Core Pillars of EDUSTARHUB
              </h3>
              <ul className="space-y-5 text-gray-700 text-lg">
                
                {/* Replaced AI/Instant with Educational Value */}
                <li className="flex items-start">
                  {/* CHANGE: Used a darker color for the icon for contrast */}
                  <span className="text-indigo-600 text-2xl mr-4 -mt-1">✨</span> 
                  **Structured Assessment:** Create and deploy comprehensive, standards-aligned practice tests effortlessly.
                </li>
                
                <li className="flex items-start">
                  <span className="text-indigo-600 text-2xl mr-4 -mt-1">✅</span>
                  **Mastery Tracking:** Automated scoring and analysis shift the focus to student progress, not just grading.
                </li>
                
                <li className="flex items-start">
                  <span className="text-indigo-600 text-2xl mr-4 -mt-1">🧠</span>
                  **Guided Revision:** Every question includes built-in, detailed explanations to guide student learning.
                </li>
                
                <li className="flex items-start">
                  <span className="text-indigo-600 text-2xl mr-4 -mt-1">📂</span> 
                  Seamless centralized organization of all classroom resources.
                </li>
              </ul>
            </div>
          </div>
        </div>
        
{/* ========================================================= */}
{/* PARTNERSHIP SECTION (Restored to original position and spacing) */}
{/* ========================================================= */}
{/* CHANGE: Restored large top margin (mt-28 md:mt-40) for better separation from the hero area. */}
<section id="partnership" className="mt-28 md:mt-40 p-8 md:p-16 bg-white rounded-[40px] shadow-3xl border-2 border-violet-500 overflow-hidden">
  <div className="grid md:grid-cols-3 gap-10 items-center">
    
    {/* Left Column: Text Content and CTA */}
    <div className="md:col-span-2">
      {/* 1. Context/Tagline (Small Text) */}
      {/* CHANGE: Used a violet badge for prominence */}
      <p className="text-sm tracking-widest font-extrabold text-violet-600 uppercase mb-3 bg-violet-100 px-3 py-1 inline-block rounded-full">
        OFFICIAL EDUCATIONAL PARTNERSHIP
      </p>

      {/* 2. Primary Headline (Large Text) */}
      {/* CHANGE: Added a subtle underline effect on hover */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 leading-tight hover:underline decoration-violet-500 decoration-4 underline-offset-4 transition">
        Trusted by Malvern College Egypt
      </h2>

      {/* 3. Description (Body Copy) */}
      <p className="mt-4 text-gray-700 text-xl leading-relaxed max-w-2xl">
        Our collaboration with one of Egypt's leading educational institutions ensures that our platform meets the highest standards for IGCSE and GCSE exam preparation. **This is our benchmark for quality.**
      </p>

      {/* 4. Call-to-Action (CTA Button) */}
      <a
        href="/malvern-exclusive-page" 
        /* FIX: Removed curly braces around the comment inside the <a> tag */
        /* CHANGE: Used the primary violet color here for consistency with the main CTA */
        className="mt-8 inline-block px-8 py-3 rounded-xl bg-violet-600 text-white font-bold text-lg shadow-lg hover:bg-violet-700 transition duration-300 transform hover:-translate-y-0.5"
      >
        See Our Impact at Malvern
      </a>
    </div>

    {/* Right Column: Visual Element (Photo of College Campus) */}
    <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
      <img 
        // 🛑 IMPORTANT CHANGE: Using the URL provided by the user 🛑
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Mh32z2R2BuD_1gtNpGqI_C5llNRa-lBTWg&s" 
        alt="Malvern College Egypt Campus" 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src="https://placehold.co/600x400/3730a3/ffffff?text=Image+Unavailable"; 
        }}
      />
      {/* CHANGE: Darkened overlay for a more dramatic, professional look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> 
    </div>
  </div>
</section>
{/* ========================================================= */}
{/* END PARTNERSHIP SECTION */}
{/* ========================================================= */}

        {/* New Section: Value Proposition (Teacher vs. Student) */}
        <section id="value" className="mt-32 py-16">
            <h2 className="text-4xl font-extrabold mb-12 text-center text-indigo-800">Commitment to High-Quality Education</h2>
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* Teacher Benefits */}
              <div className="p-10 bg-white rounded-2xl shadow-xl border-l-4 border-indigo-700 hover:shadow-2xl transition duration-300"> 
                <h3 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                  👨‍🏫 For Educators: Efficiency & Focus
                </h3>
                <ul className="space-y-3 text-gray-700 text-lg">
                  <li className="flex items-start">
                    <span className="text-indigo-600 text-xl mr-3">•</span> 
                    **Content Creation:** Quickly generate high-quality practice tests from any topic or document.
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 text-xl mr-3">•</span> 
                    **Consistency:** Ensure every student receives the same structured materials and resources.
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 text-xl mr-3">•</span> 
                    **Resource Management:** A single, secure hub for all department-wide teaching files.
                  </li>
                </ul>
              </div>

              {/* Student Benefits */}
              <div className="p-10 bg-white rounded-2xl shadow-xl border-l-4 border-violet-600 hover:shadow-2xl transition duration-300"> 
                <h3 className="text-3xl font-bold text-violet-700 mb-4 flex items-center">
                  🚀 For Students: Ownership & Engagement
                </h3>
                <ul className="space-y-3 text-gray-700 text-lg">
                  <li className="flex items-start">
                    <span className="text-violet-600 text-xl mr-3">•</span> 
                    **Accessibility:** 24/7 access to all necessary revision guides and practice materials.
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 text-xl mr-3">•</span> 
                    **Active Revision:** Interactive quizzes and engaging activities (like the Quiz Bowl we planned) promote recall.
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 text-xl mr-3">•</span> 
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

        {/* New Section: Final CTA/Sign Up Banner */}
        {/* CHANGE: Added a final, impactful CTA to maximize conversion */}
        <section className="mt-24 text-center p-16 bg-indigo-700 rounded-3xl shadow-2xl">
            <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Transform Your Outcomes?</h2>
            <p className="text-indigo-200 text-xl mb-10">Join the platform trusted by leading institutions for IGCSE and GCSE excellence.</p>
            <a 
              href="/auth" 
              className="px-12 py-5 rounded-full bg-yellow-400 text-indigo-900 font-extrabold text-xl shadow-2xl hover:bg-yellow-300 transition duration-300 transform hover:scale-105" 
            >
              Start Your Free Trial Today
            </a>
        </section>

      </main>
      
      <footer className="max-w-7xl mx-auto px-6 py-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} EDUSTARHUB. Dedicated to educational excellence.
      </footer>
    </div>
  )
}