import { useState } from "react";
import Link from 'next/link';

export default function AcademicSupport() {
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

    const navItems = ["home", "methodology", "features", "pricing", "contact", "aboutUs", "academicSupport", "faq", "terms", "success"];
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
                className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 ${DRAWER_BG} z-50 transition-transform duration-300 
                    ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                onClick={() => setIsMenuOpen(false)}
            >
                <div className={`h-full p-10 overflow-y-auto w-full`} onClick={(e) => e.stopPropagation()}>
                    {/* Close button */}
                    <div className="flex justify-end mb-16">
                        <button
                            className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Close</span>
                        </button>
                    </div>

                    <ul className="space-y-6 mt-10 text-left"> 
                        {navItems.map((tab) => (
                            <li key={tab}>
                                <Link 
                                    href={tab === 'home' ? '/' : `/${tab}`} 
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
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/academyhere.jpg')" }}>
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

                {/* Menu / Utility Buttons */}
                <div className={`absolute top-8 right-6 z-[51] flex space-x-4 items-center`}>
                    <Link href="/auth">
                        <button className={`w-10 h-10 rounded-full flex items-center justify-center ${PRIMARY_BG_ACCENT} text-white transition hover:bg-red-700 shadow-md`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </Link>
                    <button
                        className={`px-4 py-2 rounded-full flex items-center space-x-2 ${PRIMARY_BG_ACCENT} text-white font-semibold transition hover:bg-red-700 shadow-md`}
                        onClick={() => setIsMenuOpen(true)} 
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>Menu</span>
                    </button>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
                    <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold mb-6 leading-none max-w-5xl [text-shadow:0_0_15px_rgba(0,0,0,0.8)]">
                        ACADEMIC SUPPORT
                    </h1>
                    <p className="text-lg max-w-4xl mb-12 font-medium">
                        Personalized guidance whenever you need it, ensuring mastery and confidence in every subject.
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h2 className={`text-4xl font-extrabold mb-6 ${PRIMARY_ACCENT}`}>One-on-One Classes Anytime</h2>
                    <p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed mb-4`}>
                        Despite the amazing features and upcoming tools on the platform, EDUSTARHUB aims to support students at every step of their learning journey. That’s why we offer personalized 1-on-1 classes anytime a student requests them, led by experienced teachers.
                    </p>
                    <p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed mb-4`}>
                        Our academic support ensures that students not only understand the material but also build confidence, develop effective study habits, and achieve mastery in every subject. Whether it’s tackling difficult topics, preparing for exams, or receiving guidance on projects, EDUSTARHUB is committed to being a reliable partner in your academic success.
                    </p>
                </div>
                <div className="flex-1">
                    <img src="/teacher.jpg" alt="Teacher" className="rounded-2xl shadow-xl border border-gray-200 w-full h-auto max-h-[500px] object-cover" />
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className={`bg-gray-900 border-t ${BORDER_COLOR} py-10 px-6 mt-24`}>
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
