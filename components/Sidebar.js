// components/Sidebar.js (FINAL, CLEAN, AND FIXED)

import Link from 'next/link';
import { useRouter } from 'next/router';

// Define navigation links for each role
const teacherLinks = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: '🏠' },
    { name: 'Insight Engine', href: '/teacher/insights', icon: '📊' }, 
    { name: 'Quiz Maker', href: '/teacher/quiz-maker', icon: '📝' }, 
    { name: 'Manage Quizzes', href: '/teacher/quiz-manage', icon: '✅' }, 
    { name: 'Manage Resources', href: '/teacher/manage', icon: '📂' },
    { name: 'Upload Resources', href: '/teacher/upload', icon: '⬆️' },
];

const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: '🏠' },
    { name: 'View Resources', href: '/student/resources', icon: '📚' },
    { name: 'Take Quiz', href: '/student/quizzes', icon: '🧠' }, 
    { name: 'Study & Stress Buddy', href: '/student/buddy', icon: '🧘' },
    { name: 'Games & Fun', href: '/student/games', icon: '🕹️' },
];

export default function Sidebar({ role }) {
    const router = useRouter();
    
    // Check if links is defined before proceeding (fixes potential ReferenceError)
    const links = role === 'teacher' ? teacherLinks : studentLinks;

    return (
        // REFINED: Reduced width to w-52 and simplified styling
        <nav className="w-52 bg-white p-4 h-fit sticky top-4 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">
                {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </h3>
            <ul className="space-y-1">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link 
                            href={link.href} 
                            // REFINED: Subtle hover/active state
                            className={`
                                flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150
                                ${router.pathname === link.href 
                                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }
                            `}
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}