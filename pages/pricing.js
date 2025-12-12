import { useState } from "react";
import Link from "next/link";

export default function Pricing() {
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Close</span>
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
          style={{ backgroundImage: "url('/pricing-hero.jpg')" }}
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

        {/* Menu Button */}
        <div className={`absolute top-8 right-6 z-[51]`}>
          <button
            className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700 shadow-md`}
            onClick={() => setIsMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Menu</span>
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold mb-6 leading-none max-w-5xl [text-shadow:0_0_15px_rgba(0,0,0,0.8)]">
            EDUSTARHUB PRICING
          </h1>
          <p className="text-lg max-w-4xl mb-12 font-medium">
            Full access is currently <strong>0 EGP</strong>. Enjoy free access while we finalize the platform. Soon it will become paid.
          </p>
        </div>
      </section>

      {/* --- PRICING CARD WITH RIBBON --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative">
        <div className={`p-10 ${CARD_BG} rounded-3xl shadow-xl border ${BORDER_COLOR} flex flex-col md:flex-row items-center gap-10 relative`}>
          {/* Ribbon */}
          <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 bg-red-600 text-white px-4 py-1 rounded-bl-lg font-bold text-sm rotate-12 shadow-lg">
            Coming Soon: Paid Access
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-5xl font-extrabold mb-4 ${PRIMARY_ACCENT}`}>Free Access</h2>
            <p className="text-4xl font-bold mb-6">{`0 EGP`}</p>
            <ul className="space-y-3 mb-6 text-lg text-gray-700">
              <li>✅ Full platform access</li>
              <li>✅ All revision tools included</li>
              <li>✅ Progress tracking and analytics</li>
              <li>✅ Teacher-created resources</li>
            </ul>
            <p className={`${SECONDARY_TEXT_COLOR} text-lg`}>
              *This platform will become paid once fully launched.*
            </p>
          </div>

          {/* Image */}
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <img
              src="/students-success.jpg"
              alt="Students Success"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover border"
            />
          </div>
        </div>
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
