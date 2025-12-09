// pages/student/revision-tools.js (Techy Version)
import Link from 'next/link';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar'; 

const ToolCard = ({ title, description, icon, bgColor, linkHref }) => {
    return (
        <div className={`p-8 rounded-2xl shadow-[0_0_20px_${bgColor}] flex flex-col justify-between h-full transition-transform duration-300 hover:scale-[1.05] cursor-pointer ${bgColor}`}>
            <div className="mb-8">
                <span className="text-4xl mb-4 block">{icon}</span> 
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white text-opacity-80 leading-relaxed">{description}</p>
            </div>
            
            <Link 
                href={linkHref}
                className="inline-flex items-center justify-center px-4 py-2 border border-white text-sm font-semibold rounded-lg text-black bg-white hover:bg-gray-200 transition duration-150 mt-auto shadow-md"
            >
                Launch Tool →
            </Link>
        </div>
    );
};

export default function RevisionToolsHub() {
    const role = 'student';

    const tools = [
        {
            title: "Flashcard Builder",
            description: "Create, save, and practice with personalized digital flashcards.",
            icon: '🧠',
            bgColor: 'bg-purple-700 shadow-purple-500', 
            linkHref: "/student/tools/flashcard-builder"
        },
        {
            title: "Unit Summaries", 
            description: "Access final unit notes and resources uploaded by your teachers.",
            icon: '📖',
            bgColor: 'bg-pink-600 shadow-pink-500', 
            linkHref: "/student/tools/unit-summaries-viewer"
        },
        {
            title: "Spaced Repetition Tracker",
            description: "Optimize your study schedule based on forgetting curves for maximum retention.",
            icon: '⏰',
            bgColor: 'bg-teal-600 shadow-teal-500', 
            linkHref: "/student/tools/spaced-repetition"
        },
        {
            title: "Video Learning Library",
            description: "Access curated video lessons covering all subjects and complex topics for visual learning.",
            icon: '📺',
            bgColor: 'bg-red-600 shadow-red-500', 
            linkHref: "/student/tools/video-library"
        },
        {
            title: "Full Practice Mocks",
            description: "Simulate real exam conditions with timed, full-length practice tests to gauge readiness.",
            icon: '💯',
            bgColor: 'bg-green-700 shadow-green-500', 
            linkHref: "/student/tools/practice-mocks"
        },
        {
            title: "Terminology & Glossary",
            description: "Quickly look up definitions and key terms across all your subjects for clarity.",
            icon: '🔎',
            bgColor: 'bg-gray-600 shadow-gray-500', 
            linkHref: "/student/tools/glossary"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    
                    {/* --- Page Header --- */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h1 className="text-4xl font-bold mb-2 text-cyan-400 flex items-center">
                                🚀 Revision Tools Hub
                            </h1>
                            <p className="text-gray-400">Sharpen your skills and prepare for victory!</p>
                        </div>
                        <hr className="mt-4 border-gray-700" />
                    </div>

                    {/* --- Techy Card Grid --- */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {tools.map((tool) => (
                            <ToolCard
                                key={tool.title}
                                title={tool.title}
                                description={tool.description}
                                icon={tool.icon}
                                bgColor={tool.bgColor}
                                linkHref={tool.linkHref}
                            />
                        ))}
                    </div>

                </main>
            </div>

            {/* Optional subtle neon pulse */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-30 animate-pulse"
                        style={{
                            width: `${Math.random()*4 + 1}px`,
                            height: `${Math.random()*4 + 1}px`,
                            backgroundColor: `rgba(0,255,255,${Math.random()*0.4})`,
                            top: `${Math.random()*100}%`,
                            left: `${Math.random()*100}%`,
                            animationDelay: `${Math.random()*5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
