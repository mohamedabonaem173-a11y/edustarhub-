import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animateFeature, setAnimateFeature] = useState([false, false, false]);

  // --- Design Constants ---
  const MAIN_BG = "bg-white";
  const PRIMARY_ACCENT = "text-red-600";
  const PRIMARY_BG_ACCENT = "bg-red-600";
  const TEXT_COLOR = "text-gray-900";
  const CARD_BG = "bg-gray-100";
  const SECONDARY_TEXT_COLOR = "text-gray-600";
  const BORDER_COLOR = "border-gray-200";
  const DRAWER_BG = "bg-gray-900";
  const DRAWER_TEXT_COLOR = "text-white";
  const DRAWER_ACCENT_COLOR = "text-red-500";

  // --- Navigation Data ---
  const fullPageNavItems = ["methodology", "features", "pricing", "contact", "aboutUs", "academicSupport", "faq"];
  const navItems = ["home", ...fullPageNavItems];

  const tabDisplayNames = {
    home: "Home",
    methodology: "Methodology",
    terms: "TOS/Copyright",
    aboutUs: "About Us",
    features: "Features",
    academicSupport: "Academic Support",
    faq: "FAQ",
    pricing: "Pricing",
    success: "Success",
    contact: "Contact",
  };

  // --- Content Data ---
  const testimonials = [
    { name: "Hope", quote: "EDUSTARHUB changed how I prepare for exams. The content is concise and the dashboard keeps me completely focused. I saw a huge jump in my scores!" },
    { name: "Karim", quote: "The interactive revision tools are a game-changer. I finally feel like I understand the physics concepts, not just memorizing them. Platform is very good." },
    { name: "Omar", quote: "I love the clean, easy-to-use interface. It makes organizing my IGCSE notes effortless. Highly recommend for any student feeling overwhelmed." },
    { name: "Ahmed", quote: "The teachers' resources are top-notch. It's like having the best tutor available 24/7. Platform is very good!" },
    { name: "Gabriel", quote: "I was struggling with Biology, but Dr. Yusuf’s lessons are incredibly clear and engaging. The progress tracking motivates me daily." },
    { name: "Layla", quote: "Studying doesn't feel like a chore anymore. EDUSTARHUB is genuinely designed with the student in mind. My confidence is through the roof." },
    { name: "Noah", quote: "I finally found one place for all my subjects. No more switching between websites and losing track of my goals. Platform is very good!" },
  ];

  const faqItems = [
    { question: "Which exam boards and subjects do you cover?", answer: "We focus primarily on IGCSE and GCSE curricula, covering core subjects like Physics, Biology, Chemistry, and Math. We are constantly expanding our subject library." },
    { question: "How long is the 'Early Access' free?", answer: "Early Access is free indefinitely for the first group of users who sign up. We will announce pricing for new users well in advance once the platform exits the Early Access phase." },
    { question: "Is the content created by real teachers?", answer: "Yes, every quiz, resource, and practice test is designed and verified by experienced, certified educators specializing in the GCSE and IGCSE systems." },
    { question: "How does the platform help me track my progress?", answer: "Our dashboard provides visual reports on quiz scores, time spent studying, and mastery levels for each topic, giving you clear insights into where you need to focus." },
  ];

  const termsContent = {
    title: "Terms of Service & Copyright Agreement (The Huge Contract)",
    sections: [
      {
        heading: "1. Ownership and Intellectual Property (The Core Agreement)",
        content: "All content, resources, text, design, graphics, quizzes, lessons, course materials, educator profiles, and underlying software code ('The Content') published or made available on the EDUSTARHUB platform are the **sole and exclusive property of EDUSTARHUB**, protected under international copyright, trademark, and intellectual property laws. **All rights are expressly reserved by EDUSTARHUB.**",
      },
      {
        heading: "2. Permitted Educational Use (Non-Commercial License)",
        content: "EDUSTARHUB grants registered users a limited, non-exclusive, non-transferable license to access and use The Content strictly for **personal, non-commercial educational purposes**, such as studying, personal revision, and self-assessment. This license is revoked immediately upon unauthorized commercial use or breach of these terms.",
      },
      {
        heading: "3. STRICTLY PROHIBITED COMMERCIAL USE AND REDISTRIBUTION",
        content: "Users are **EXPRESSLY AND STRICTLY PROHIBITED** from using, reproducing, or distributing The Content for **ANY COMMERCIAL PURPOSE WHATSOEVER**. Prohibited activities include, but are not limited to: <ul><li>**Selling, licensing, renting, or leasing** any part of The Content, including digital copies of quizzes or notes.</li><li>Using The Content to prepare materials for commercial tutoring, private courses, or external training programs.</li><li>Posting or uploading The Content to any public forum, website, file-sharing service, or repository (e.g., GitHub, Chegg, Course Hero) for public or non-personal access.</li><li>Reproducing, copying, or distributing The Content, whether digitally or in print, for sale, profit, or mass dissemination.</li><li>**Reverse engineering** or attempting to derive the source code or proprietary methodology of the platform.</li></ul>Any unauthorized commercial use constitutes a severe violation of copyright and will result in **immediate termination of the user account and aggressive legal action** to the fullest extent permitted by international law, seeking both injunctive relief and monetary damages.",
      },
      {
        heading: "4. Digital Millennium Copyright Act (DMCA) Compliance",
        content: "EDUSTARHUB actively enforces its copyright. Any unauthorized use of EDUSTARHUB content found outside the platform should be reported immediately via the Contact tab. We fully comply with the DMCA and other international statutes to protect our proprietary materials.",
      },
    ],
  };

  const methodologyContent = {
    title: "Our Learning Methodology: How EDUSTARHUB Guarantees Mastery",
    points: [
      { icon: "🧠", title: "Assess & Target", description: "We start with adaptive quizzes to identify your exact weaknesses. We don't waste time on what you already know, focusing your energy where it matters most." },
      { icon: "🔬", title: "Interactive Deep Dive", description: "Lessons move beyond static text. Our expert-led videos, simulations, and interactive tools ensure you build deep conceptual understanding, not just surface knowledge." },
      { icon: "🏆", title: "Validate & Achieve", description: "Final mastery quizzes and simulated exam papers validate your learning. Our progress trackers provide clear, actionable feedback, transforming weakness into confidence and success." },
    ],
  };

  // --- Animate Features on Load ---
  useEffect(() => {
    if (animateFeature.every(a => a === false)) {
      setAnimateFeature([true, false, false]);
      const timers = [
        setTimeout(() => setAnimateFeature([true, true, false]), 300),
        setTimeout(() => setAnimateFeature([true, true, true]), 600),
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, []);

  const handleNavClick = (tabId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(tabId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    else window.location.href = tabId === "home" ? "/" : `/${tabId}`;
  };

  return (
    <div className={`font-sans ${TEXT_COLOR} ${MAIN_BG} min-h-screen`}>

      {/* Drawer Menu */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 ${DRAWER_BG} z-50 transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={() => setIsMenuOpen(false)}>
        <div className="h-full p-10 overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-end mb-16">
            <button className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700`} onClick={() => setIsMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Close</span>
            </button>
          </div>

          {/* Navigation */}
          <ul className="space-y-6 mt-10 text-left">
            {navItems.map(tab => (
              <li key={tab}>
                <Link href={tab === "home" ? "/" : `/${tab}`} onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 text-4xl font-extrabold transition ${DRAWER_TEXT_COLOR} hover:${DRAWER_ACCENT_COLOR}`}>
                  <span className={`${DRAWER_ACCENT_COLOR} text-4xl leading-none`}>●</span>
                  <span className={DRAWER_TEXT_COLOR}>{tabDisplayNames[tab]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <main>
        {/* --- Hero Section --- */}
        <section id="home" className="relative h-screen w-full">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/online.jpg')" }}>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Logo */}
          <div className="absolute top-8 left-6 z-40">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className={`text-4xl font-extrabold ${PRIMARY_ACCENT}`}>M</div>
                <div className="text-xl font-extrabold tracking-tight text-white">EDUSTARHUB</div>
              </div>
            </Link>
          </div>

          {/* Menu & Sign In */}
          <div className={`absolute top-8 right-6 z-[51] flex space-x-4 items-center ${isMenuOpen ? 'hidden' : 'flex'}`}>
            <Link href="/auth">
              <button className={`w-10 h-10 rounded-full flex items-center justify-center ${PRIMARY_BG_ACCENT} text-white hover:bg-red-700 shadow-md`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </Link>

            {/* Menu Button */}
            <button className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold hover:bg-red-700 shadow-md`} onClick={() => setIsMenuOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </button>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold mb-6 leading-none max-w-5xl [text-shadow:0_0_15px_rgba(0,0,0,0.8)]">
              FOCUS ON MASTERY,<br />NOT MANAGEMENT.
            </h1>
            <p className="text-lg max-w-4xl mb-12 font-medium">
              "We handle the planning and organization so you can concentrate entirely on achieving academic success."
            </p>
            <Link href="/auth">
              <button className={`px-14 py-4 ${PRIMARY_BG_ACCENT} text-white rounded-xl text-2xl font-bold hover:bg-red-700 transition shadow-2xl`}>
                Sign In
              </button>
            </Link>
          </div>
        </section>

        {/* --- Methodology Section --- */}
        <section id="methodology" className="py-24 px-6 max-w-6xl mx-auto text-center">
          <h2 className={`text-5xl font-extrabold mb-16 ${PRIMARY_ACCENT}`}>{methodologyContent.title}</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {methodologyContent.points.map((point, index) => (
              <div key={index} className={`p-8 ${CARD_BG} rounded-2xl shadow-lg border ${BORDER_COLOR} transition-shadow duration-300 hover:shadow-xl`}>
                <p className="text-6xl mb-4">{point.icon}</p>
                <h3 className={`text-2xl font-bold mb-3 ${TEXT_COLOR}`}>{point.title}</h3>
                <p className={`${SECONDARY_TEXT_COLOR}`}>{point.description}</p>
              </div>
            ))}
          </div>
          <Link href="/methodology">
            <button className={`mt-12 px-8 py-3 bg-white ${PRIMARY_ACCENT} font-semibold rounded-xl shadow-md transition border border-red-500 hover:bg-gray-100`}>
              Explore Our Methodology in Depth
            </button>
          </Link>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className="text-5xl font-extrabold text-center mb-20">Powerful Features Designed for Success</h2>
          <div className="space-y-20">
            {/* Feature 1 */}
            <div className={`grid md:grid-cols-2 gap-16 items-center p-8 ${CARD_BG} rounded-2xl shadow-lg border ${BORDER_COLOR} transition-all duration-700 ${animateFeature[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div><h3 className={`text-4xl font-bold mb-4 ${PRIMARY_ACCENT}`}>📊 Easy-to-use Dashboard</h3><p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed`}>Everything you need in one clean dashboard. Manage revision, quizzes, scores, and resources effortlessly.</p></div>
              <img src="/dashboard.jpg" alt="Dashboard" className={`rounded-2xl shadow-xl border ${BORDER_COLOR} hover:scale-105 transition duration-300`} />
            </div>

            {/* Feature 2 */}
            <div className={`grid md:grid-cols-2 gap-16 items-center p-8 ${CARD_BG} rounded-2xl shadow-lg border ${BORDER_COLOR} transition-all duration-700 ${animateFeature[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="md:order-2"><h3 className={`text-4xl font-bold mb-4 ${PRIMARY_ACCENT}`}>🧠 Revision Tools Hub</h3><p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed`}>Fun and interactive revision tools designed to help students master content faster.</p></div>
              <img src="/revisontools.jpg" alt="Revision Tools" className={`rounded-2xl shadow-xl border ${BORDER_COLOR} hover:scale-105 transition duration-300 md:order-1`} />
            </div>

            {/* Feature 3 */}
            <div className={`grid md:grid-cols-2 gap-16 items-center p-8 ${CARD_BG} rounded-2xl shadow-lg border ${BORDER_COLOR} transition-all duration-700 ${animateFeature[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div><h3 className={`text-4xl font-bold mb-4 ${PRIMARY_ACCENT}`}>📂 All Resources Created by Real Teachers</h3><p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed`}>Every resource is crafted by experienced educators, ensuring high-quality, reliable, and exam-focused content.</p></div>
              <img src="/teacher.jpg" alt="Teacher Resources" className={`rounded-2xl shadow-xl border ${BORDER_COLOR} hover:scale-105 transition duration-300`} />
            </div>
          </div>
        </section>

        {/* --- Success / Testimonials Section --- */}
        <section id="success" className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className={`text-5xl font-extrabold text-center mb-16 ${PRIMARY_ACCENT}`}>Student Success Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <div key={index} className={`p-6 ${PRIMARY_BG_ACCENT} rounded-2xl shadow-xl text-white flex flex-col justify-between h-full hover:shadow-2xl transition`}>
                <p className="mb-6">"{review.quote}"</p>
                <h3 className="font-bold text-lg">{review.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section id="faq" className="py-24 px-6 max-w-4xl mx-auto text-left">
          <h2 className={`text-5xl font-extrabold text-center mb-16 ${PRIMARY_ACCENT}`}>Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-300 pb-6">
                <h3 className="text-2xl font-semibold mb-2">{faq.question}</h3>
                <p className={`${SECONDARY_TEXT_COLOR}`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        

      </main>
    </div>
  );
}
