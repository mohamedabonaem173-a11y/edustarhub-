// components/Sidebar.js

import Link from 'next/link';
import { useRouter } from 'next/router';

// Define navigation links for each role
const teacherLinks = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: '🏠' },
    { name: 'Manage Resources', href: '/teacher/manage', icon: '📂' },
    { name: 'Upload Resources', href: '/teacher/upload', icon: '⬆️' },
    // THE MISSING LINK: Quiz Maker
    { name: 'Quiz Maker', href: '/teacher/quiz-maker', icon: '📝' }, 
];

const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: '🏠' },
    { name: 'View Resources', href: '/student/resources', icon: '📚' },
    { name: 'Take Quiz', href: '/student/take-quiz', icon: '🧠' },
    { name: 'Games & Fun', href: '/student/games', icon: '🕹️' },
];

export default function Sidebar({ role }) {
    const router = useRouter();
    const links = role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <nav className="w-56 bg-white p-4 shadow-lg rounded-xl h-fit sticky top-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </h3>
            <ul className="space-y-2">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} passHref legacyBehavior>
                            <a
                                className={`
                                    flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
                                    ${router.pathname === link.href 
                                        ? 'bg-violet-600 text-white shadow-md font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span>{link.name}</span>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}