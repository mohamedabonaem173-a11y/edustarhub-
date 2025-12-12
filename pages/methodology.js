import { useState } from "react";
import Link from "next/link";

export default function Methodology() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Design Constants (same as homepage) ---
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

  // --- Navigation Items ---
  const navItems = [
    "home",
    "methodology",
    "features",
    "pricing",
    "contact",
    "aboutUs",
    "academicSupport",
    "faq",
    "terms",
    "success",
  ];

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

  // --- Founder Story & Methodology ---
  const founderStory = `
    <p>This platform was created by a student who found studying and revising to be incredibly boring—a tedious chore dominated by static textbooks, endless note-taking, and overwhelming revision guides.</p>
    <p>He realized the problem wasn't the subjects themselves, but the <strong>method</strong> used to teach and revise them. Studying felt inefficient, confusing, and completely disconnected from the engaging, interactive world modern students live in.</p>
    <h3 class="text-2xl font-bold mt-6 mb-3 ${PRIMARY_ACCENT}">The Problem We Solved:</h3>
    <ul class="list-disc list-inside ${SECONDARY_TEXT_COLOR} space-y-2 mb-6">
      <li>❌ Wasted Time: Hours spent re-reading material you already know.</li>
      <li>❌ Shallow Learning: Memorizing facts just before an exam, only to forget them later.</li>
      <li>❌ Overwhelm: Too many disparate resources (videos, notes, quizzes, apps) scattered everywhere.</li>
    </ul>
    <h3 class="text-2xl font-bold mt-6 mb-3 ${PRIMARY_ACCENT}">The EduStarHub Solution:</h3>
    <p>Frustrated with this reality, the founder created EDUSTARHUB to revolutionize the learning process. Our methodology isn't just a set of steps; it's a practical, student-focused solution designed to <strong>eliminate boredom and guarantee conceptual mastery.</strong></p>
    <p>By combining adaptive technology, gamified learning tools, and expert-vetted content, we created a platform that handles all the organizational stress. This way, you can stop fighting to find the right materials and start focusing 100% on learning deeply, efficiently, and even enjoyably.</p>
    <p>Our goal is simple: to transform revision from a painful necessity into an empowering, structured journey that leads directly to top grades and genuine confidence.</p>
  `;

  const methodologyData = [
    {
      icon: "🧠",
      title: "Phase 1: Assess & Target",
      subtitle: "Precision Diagnostics to Pinpoint Weaknesses",
      description:
        "We utilize adaptive, AI-driven quizzes that go beyond surface-level testing. Our system quickly identifies the specific concepts and knowledge gaps where you need the most support, creating a personalized learning roadmap. This eliminates wasted time on material you already understand, ensuring every study minute is productive.",
      details: [
        "Adaptive quiz engine that adjusts difficulty.",
        "Detailed topic-level score reports.",
        "Automatic prioritization of low-mastery areas.",
        "Time-saving personalized study plans.",
      ],
      imageSrc: "/phase1.jpg",
      theme: "bg-red-50",
    },
    {
      icon: "🔬",
      title: "Phase 2: Interactive Deep Dive",
      subtitle: "Engagement-Focused Learning for Conceptual Mastery",
      description:
        "Learning is active, not passive. Our platform offers a mix of expert-led video lessons, animated simulations, and interactive practice tools. Content is broken down into micro-lessons designed for maximum retention, ensuring you don't just memorize facts, but truly grasp the underlying scientific and mathematical concepts.",
      details: [
        "Expert-led, concise video micro-lessons.",
        "Interactive 3D simulations for complex topics.",
        "Guided practice with step-by-step solutions.",
        "Flashcards and review modes built on spaced repetition.",
      ],
      imageSrc: "/phase2.jpg",
      theme: "bg-blue-50",
    },
    {
      icon: "🏆",
      title: "Phase 3: Validate & Achieve",
      subtitle: "Exam Simulation and Confidence Building",
      description:
        "The final phase validates your learning through timed, simulated exam environments that replicate the real IGCSE/GCSE experience. Clear performance metrics and actionable feedback transform your weaknesses into proven strengths, building the confidence required to achieve top grades.",
      details: [
        "Full-length, timed exam simulations.",
        "Instant feedback and detailed marking scheme breakdowns.",
        "Progress tracking across all subjects and topics.",
        "Final mastery certification for key modules.",
      ],
      imageSrc: "/phase3.jpg",
      theme: "bg-green-50",
    },
  ];

  return (
    <div className={`font-sans ${TEXT_COLOR} ${MAIN_BG} min-h-screen`}>
      {/* --- DRAWER MENU --- */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 ${DRAWER_BG} z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="h-full p-10 overflow-y-auto w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end mb-16">
            <button
              className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700`}
              onClick={() => setIsMenuOpen(false)}
            >
              Close
            </button>
          </div>
          <ul className="space-y-6 mt-10 text-left">
            {navItems.map((tab) => (
              <li key={tab}>
                <Link
                  href={tab === "home" ? "/" : `/${tab}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 text-4xl font-extrabold transition ${DRAWER_TEXT_COLOR} hover:${DRAWER_ACCENT_COLOR}`}
                >
                  <span className={`${DRAWER_ACCENT_COLOR} text-4xl leading-none`}>●</span>
                  <span className={DRAWER_TEXT_COLOR}>{tabDisplayNames[tab]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/heromethod.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        {/* Logo */}
        <div className="absolute top-8 left-6 z-40">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className={`text-4xl font-extrabold ${PRIMARY_ACCENT} leading-none`}>M</div>
              <div className="text-xl font-extrabold tracking-tight text-white">EDUSTARHUB</div>
            </div>
          </Link>
        </div>
        {/* Menu button */}
        <div className={`absolute top-8 right-6 z-[51]`}>
          <button
            className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700 shadow-md`}
            onClick={() => setIsMenuOpen(true)}
          >
            Menu
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold mb-6 leading-none max-w-5xl [text-shadow:0_0_15px_rgba(0,0,0,0.8)]">
            EDUSTARHUB: ENGINEERED FOR MASTERY
          </h1>
        </div>
      </section>

      {/* --- FOUNDER STORY --- */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div
          className={`${CARD_BG} p-8 rounded-2xl shadow-xl border ${BORDER_COLOR} text-left`}
          dangerouslySetInnerHTML={{ __html: founderStory }}
        />
      </section>

      {/* --- METHODOLOGY PHASES --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-20">
        {methodologyData.map((step, index) => (
          <div
            key={index}
            className={`p-8 md:p-12 rounded-3xl shadow-xl transition-shadow duration-300 hover:shadow-2xl border ${BORDER_COLOR} ${CARD_BG} flex flex-col md:flex-row gap-10 items-center`}
          >
            {/* Content */}
            <div className={`flex-1 ${index % 2 !== 0 ? "md:order-2" : ""}`}>
              <p className="text-6xl mb-4">{step.icon}</p>
              <h2 className={`text-4xl font-extrabold mb-2 ${PRIMARY_ACCENT}`}>{step.title}</h2>
              <h3 className={`text-2xl font-semibold mb-6 ${TEXT_COLOR}`}>{step.subtitle}</h3>
              <p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed mb-8`}>{step.description}</p>
              <ul className="space-y-3">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-3 text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 flex-shrink-0 ${PRIMARY_ACCENT}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className={`${TEXT_COLOR}`}>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className={`flex-1 w-full flex justify-center items-center ${index % 2 !== 0 ? "md:order-1" : ""}`}>
              <img src={step.imageSrc} alt={step.title} className="rounded-2xl shadow-xl w-full h-auto object-cover max-h-96" />
            </div>
          </div>
        ))}
      </section>

      {/* --- FOOTER --- */}
      <footer className={`bg-gray-900 border-t ${BORDER_COLOR} py-10 px-6`}>
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className={`text-2xl font-extrabold tracking-tight text-white`}>EDUSTARHUB</div>
          <p className="text-gray-400">Study Smarter. Achieve Mastery.</p>
          <div className="text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} EDUSTARHUB. All rights reserved.</p>
            <p>
              For support, contact us at{" "}
              <a href="mailto:support@edustarhub.com" className={`hover:${PRIMARY_ACCENT} transition`}>
                support@edustarhub.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
