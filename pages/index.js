import Link from 'next/link';
// If you use a Navbar component, uncomment the import line below 
// and the <Navbar /> tag inside the return statement.
// import Navbar from '../components/Navbar'; 

export default function Home() {
  return (
    // Added a subtle gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* If you use a Navbar component, uncomment this line: */}
      {/* <Navbar /> */}
      
      <main className="max-w-7xl mx-auto px-6 py-20"> 
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Headline and CTAs */}
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-indigo-800 tracking-tight">
              EDUSTARHUB — <br className="hidden md:inline"/>GCSE & IGCSE support
            </h1>
            <p className="mt-8 text-gray-700 text-xl leading-relaxed">
              High-quality revision materials, practice exams, and teacher-uploaded worksheets — all in one place. Sign up as a student or teacher and start learning or sharing resources.
            </p>

            <div className="mt-12 flex space-x-6">
              {/* Primary CTA Button */}
              <Link 
                href="/auth" 
                className="px-10 py-4 rounded-full bg-violet-600 text-white font-bold text-lg shadow-xl hover:bg-violet-700 transition transform hover:-translate-y-1" 
              >
                Get Started
              </Link>
              {/* Secondary CTA Button */}
              <a 
                className="px-10 py-4 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold shadow-md hover:bg-gray-100 transition" 
                href="#how"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Right Column: Why EDUSTARHUB Card */}
          <div>
            <div className="bg-white rounded-3xl p-10 shadow-2xl border-t-4 border-violet-500 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Why EDUSTARHUB?</h3>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">•</span> 
                  Centralized teacher uploads (worksheets & exams)
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">•</span>
                  Student dashboards with easy access to resources
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">•</span>
                  Cloud-hosted files — accessible anywhere
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 text-2xl mr-4 -mt-1">•</span> 
                  Simple role-based accounts
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <section id="how" className="mt-32 py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-indigo-800">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10 px-10">
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-violet-600 mb-3">1. Sign up</h4>
              <p className="text-gray-700 leading-relaxed">Create a student or teacher account in seconds using magic link authentication.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-violet-600 mb-3">2. Teachers upload</h4>
              <p className="text-gray-700 leading-relaxed">Teachers securely upload worksheets and exams to the cloud storage bucket.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300">
              <h4 className="text-2xl font-bold text-violet-600 mb-3">3. Students learn</h4>
              <p className="text-gray-700 leading-relaxed">Students instantly access, view, or download materials from their personalized dashboard.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}