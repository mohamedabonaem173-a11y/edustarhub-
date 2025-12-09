// pages/teacher/tools-hub.js

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

// --- Helper Component: The Card for Each Tool (MODIFIED BUTTON TEXT) ---
const ToolCard = ({ title, description, link, icon, colorClass }) => (
    <Link 
        href={link}
        className={`
            block p-6 rounded-xl shadow-lg flex flex-col justify-between h-full transition-transform duration-300 hover:scale-[1.03] 
            ${colorClass} text-white hover:shadow-xl
        `}
    >
        <div className="mb-8">
            <span className="text-5xl mb-4 block">{icon}</span>
            <h2 className="text-2xl font-bold mb-1">{title}</h2>
            <p className="text-sm opacity-90">{description}</p>
        </div>
        
        <div className="mt-auto"> 
            <span 
                className="inline-flex items-center justify-center px-4 py-2 border border-white text-sm font-semibold rounded-lg text-black bg-white hover:bg-gray-100 transition duration-150"
            >
                Manage Tool →
            </span>
        </div>
    </Link>
);


export default function TeacherToolsHub() {
    const role = 'teacher';

    const teacherTools = [
        // --- CONTENT CREATION TOOLS ---
        {
            title: '📝 Flashcard Builder',
            description: 'Create, manage, and publish flashcard sets for your students to practice and master.',
            link: '/teacher/tools/flashcard-builder', 
            icon: '🧠',
            colorClass: 'bg-indigo-700',
        },
        {
            title: '📖 Unit Summarizer',
            description: 'Create and structure final study guides and unit summaries for student resource distribution.',
            link: '/teacher/tools/unit-summarizer', 
            icon: '📚',
            colorClass: 'bg-pink-700',
        },
        {
            title: '✏️ Quiz Maker',
            description: 'Design and build new quizzes from scratch or adapt existing question banks.',
            link: '/teacher/quiz-maker', 
            icon: '📝',
            colorClass: 'bg-orange-700',
        },

        // --- MANAGEMENT TOOLS (Sidebar links included for consistency) ---
        {
            title: '✅ Manage Quizzes',
            description: 'View, edit, activate, and archive all existing quiz assignments.',
            link: '/teacher/quiz-manage', 
            icon: '📋',
            colorClass: 'bg-teal-700',
        },
        {
            title: '📂 Manage Resources',
            description: 'Organize and curate all uploaded documents, links, and study materials.',
            link: '/teacher/manage', 
            icon: '🗂️',
            colorClass: 'bg-green-700',
        },
        {
            title: '⬆️ Upload Resources',
            description: 'Quickly upload new documents, PDFs, or links for student access.',
            link: '/teacher/upload', 
            icon: '📤',
            colorClass: 'bg-red-700',
        },
        
        // --- NEW: Student-Aligned Tools for Teacher Management ---
        {
            title: '⏰ Spaced Repetition Settings',
            description: 'View aggregated data on student study habits and set global SR parameters.',
            link: '/teacher/tools/sr-settings', 
            icon: '⏱️',
            colorClass: 'bg-cyan-700',
        },
        {
            title: '📺 Video Library Manager',
            description: 'Curate, add, and organize educational video links for student viewing.',
            link: '/teacher/tools/video-manager', 
            icon: '📽️',
            colorClass: 'bg-yellow-700',
        },
        {
            title: '💯 Full Practice Mocks Manager',
            description: 'Create, schedule, and manage full-length mock exams and review results.',
            link: '/teacher/tools/mocks-manager', 
            icon: '📈',
            colorClass: 'bg-purple-600',
        },
        {
            title: '🔎 Terminology & Glossary Builder',
            description: 'Maintain and publish class-specific glossaries and key terminology.',
            link: '/teacher/tools/glossary-builder', 
            icon: '🔠',
            colorClass: 'bg-gray-700',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userRole="Teacher" />
            
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🔧 Manage Tools Hub</h1>
                    <p className="text-gray-500 mb-8">Access the tools you need to create engaging and effective revision resources for your classes.</p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {teacherTools.map((tool, index) => (
                            <ToolCard key={index} {...tool} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}