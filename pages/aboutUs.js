import { useState } from "react";
import Link from "next/link";

export default function AboutUs() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // --- About Us Text ---
  const founderStory = `
    <p class="mb-4">
      This platform was created by a student who hated studying because it felt boring, repetitive, and overwhelming. Endless textbooks, tedious notes, and scattered revision resources made learning feel like a chore rather than a journey. The founder wanted to change that, creating a platform where studying is engaging, interactive, and effective.
    </p>
    <p class="mb-4">
      Our platform is built to help students not just memorize, but truly understand concepts. From adaptive quizzes to gamified learning, every feature is designed to reduce frustration, save time, and boost confidence. We believe every student deserves a study experience that excites and motivates them.
    </p>
    <p class="mb-4">
      EDUSTARHUB is more than just a learning platform; it is a vision for a new way of studying, where students can take control of their learning journey, track progress effortlessly, and feel empowered to reach their full potential.
    </p>
  `;

  const ourAim = `
    <p class="mb-4">
      Our aim is simple: to provide students with multiple ways to learn, explore, and revise content, helping them fall in love with learning. We want to create a platform that transforms studying from a boring task into a fun and interactive adventure.
    </p>
    <p class="mb-4">
      By combining adaptive technology, engaging exercises, and expert-vetted content, we aim to foster curiosity, understanding, and mastery in every student. Our goal is to make education not only effective but also inspiring.
    </p>
    <p class="mb-4">
      Ultimately, we want students to feel confident, motivated, and fully prepared to achieve their goals. EDUSTARHUB is here to support every step of that journey.
    </p>
  `;

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
          style={{ backgroundImage: "url('/about-hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-6 z-40">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className={`text-4xl font-extrabold ${PRIMARY_ACCENT} leading-none`}>M</div>
              <div className={`text-xl font-extrabold tracking-tight text-white`}>EDUSTARHUB</div>
            </div>
          </Link>
        </div>

        {/* Menu Button */}
        <div className="absolute top-8 right-6 z-[51]">
          <button
            className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700 shadow-md`}
            onClick={() => setIsMenuOpen(true)}
          >
            Menu
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold mb-6 leading-none max-w-5xl [text-shadow:0_0_15px_rgba(0,0,0,0.8)]">
            ABOUT EDUSTARHUB
          </h1>
        </div>
      </section>

      {/* --- FOUNDER STORY --- */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-12">
        <div>
          <h2 className={`text-5xl font-extrabold ${PRIMARY_ACCENT} mb-6`}>Founder Story</h2>
          <div
            className="text-2xl md:text-3xl leading-relaxed text-gray-800 text-left"
            dangerouslySetInnerHTML={{ __html: founderStory }}
          />
        </div>

        <div>
          <h2 className={`text-5xl font-extrabold ${PRIMARY_ACCENT} mb-6`}>Our Aim</h2>
          <div
            className="text-2xl md:text-3xl leading-relaxed text-gray-800 text-left"
            dangerouslySetInnerHTML={{ __html: ourAim }}
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={`bg-gray-900 border-t ${BORDER_COLOR} py-10 px-6`}>
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="text-2xl font-extrabold tracking-tight text-white">EDUSTARHUB</div>
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
