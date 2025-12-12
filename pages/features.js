import { useState } from "react";
import Link from 'next/link';

export default function Features() {
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

    const featuresData = [
        {
            icon: "📊",
            title: "Easy-to-use Dashboard",
            description: "Everything you need in one clean dashboard. Manage revision, quizzes, scores, and resources effortlessly.",
            image: "/dashboard.jpg"
        },
        {
            icon: "🧠",
            title: "Revision Tools Hub",
            description: "Fun and interactive revision tools designed to help students master content faster.",
            image: "/revisontools.jpg"
        },
        {
            icon: "📂",
            title: "Teacher-Created Resources",
            description: "Every resource is crafted by experienced educators, ensuring high-quality, reliable, and exam-focused content.",
            image: "/teacher.jpg"
        }
    ];

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
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/academicsupport.jpg')" }}>
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
                        EDUSTARHUB FEATURES
                    </h1>
                    <p className="text-lg max-w-4xl mb-12 font-medium">
                        Powerful tools and resources designed to make learning fun, interactive, and effective.
                    </p>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-24 px-6 max-w-6xl mx-auto space-y-20">
                {featuresData.map((feature, index) => (
                    <div key={index} className={`grid md:grid-cols-2 gap-16 items-center p-8 ${CARD_BG} rounded-2xl shadow-lg border ${BORDER_COLOR} transition-all duration-700`}>
                        <div className={index % 2 !== 0 ? 'md:order-2' : ''}>
                            <h3 className={`text-4xl font-bold mb-4 ${PRIMARY_ACCENT}`}>{feature.icon} {feature.title}</h3>
                            <p className={`${SECONDARY_TEXT_COLOR} text-lg leading-relaxed`}>{feature.description}</p>
                        </div>
                        <img src={feature.image} alt={feature.title} className={`rounded-2xl shadow-xl border ${BORDER_COLOR} hover:scale-105 transition duration-300`} />
                    </div>
                ))}
            </section>

            {/* --- MORE FEATURES COMING SOON --- */}
            <section className="py-40 bg-gray-100 flex items-center justify-center">
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-red-600 text-center">
                    MORE FEATURES COMING SOON
                </h2>
            </section>

        </div>
    );
}
