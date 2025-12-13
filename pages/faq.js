import { useState } from "react";
import Link from "next/link";

export default function FAQ() {
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

  const faqData = [
    {
      question: "Is EDUSTARHUB free to use?",
      answer:
        "Yes! Currently, the platform is completely free. In the future, it will transition to a paid model, but for now, enjoy full access at no cost.",
    },
    {
      question: "Which subjects are available?",
      answer:
        "We cover a wide range of subjects including Maths, Science, English, and more. New subjects are constantly being added.",
    },
    {
      question: "Can I track my progress?",
      answer:
        "Absolutely! The dashboard provides detailed reports, performance tracking, and personalized study recommendations.",
    },
    {
      question: "Are the resources teacher-approved?",
      answer:
        "Yes, every resource is carefully crafted by experienced educators to ensure high-quality, exam-focused content.",
    },
    {
      question: "Can I use EDUSTARHUB on mobile?",
      answer:
        "Not at the moment, but mobile access is coming soon! Once available, the platform will be fully responsive and work on smartphones and tablets.",
    },
    {
      question: "Are there any upcoming features?",
      answer:
        "Yes! We’re constantly improving. Expect interactive quizzes, 1-on-1 sessions, gamified tools, and much more awesome features coming soon!",
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
          style={{ backgroundImage: "url('/faqhero.jpg')" }}
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
        <div className="absolute top-8 right-6 z-[51]">
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
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-lg max-w-4xl mb-12 font-medium">
            Answers to the most common questions about EDUSTARHUB.
          </p>
        </div>
      </section>

      {/* --- FAQ CONTENT --- */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-12">
        {faqData.map((faq, index) => (
          <div key={index} className={`${CARD_BG} p-8 rounded-2xl shadow-xl border ${BORDER_COLOR}`}>
            <h3 className={`text-3xl font-bold mb-4 ${PRIMARY_ACCENT}`}>{faq.question}</h3>
            <p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed`}>{faq.answer}</p>
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
    