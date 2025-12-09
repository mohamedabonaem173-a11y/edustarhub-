// components/Sidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';

// Teacher links
const teacherLinks = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: '🏠' },
    { name: 'Insight Engine', href: '/teacher/insights', icon: '📊' }, 
    { name: 'Quiz Maker', href: '/teacher/quiz-maker', icon: '📝' }, 
    { name: 'Manage Quizzes', href: '/teacher/quiz-manage', icon: '✅' }, 
    { name: 'Manage Resources', href: '/teacher/manage', icon: '📂' },
    { name: 'Upload Resources', href: '/teacher/upload', icon: '⬆️' },
    { name: 'Manage Tools Hub', href: '/teacher/tools-hub', icon: '🔧' },

    // New link for Mock Exam Submissions
    { name: 'Mock Exam Submissions', href: '/teacher/mock-exam-submissions', icon: '📄' },
    
    // --- Office Hours links removed ---
    { name: 'Messages', href: '/teacher/messages', icon: '💬' },
];

// Student links
const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: '🏠' },
    { name: 'View Resources', href: '/student/resources', icon: '📚' },
    { name: 'Revision Tools', href: '/student/revision-tools', icon: '📖' },
    { name: 'Take Quiz', href: '/student/quizzes', icon: '🧠' }, 
    { name: 'Study & Stress Buddy', href: '/student/buddy', icon: '🧘' },
    { name: 'Games & Fun', href: '/student/games', icon: '🕹️' },

    // --- Office Hours links removed ---
    { name: 'Messages', href: '/student/messages', icon: '💬' },
];

export default function Sidebar({ role }) {
    const router = useRouter();
    const links = role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <nav className="w-52 bg-white p-4 h-fit sticky top-4 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">
                {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </h3>
            <ul className="space-y-1">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link 
                            href={link.href} 
                            className={`
                                flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150
                                ${router.pathname.startsWith(link.href) 
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
