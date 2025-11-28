// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct: '../lib/supabaseClient'

// Accept userRole as a prop
export default function Navbar({ userRole = 'User' }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call the Supabase sign out method
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout Error:', error.message);
                alert('There was an error logging out. Please try again.');
                return;
            }
            
            // Clear role choice from local storage
            localStorage.removeItem("roleChoice");

            // Redirect to the sign-in page
            router.push('/signin');
        } catch (error) {
            console.error('Unexpected Logout Error:', error);
        }
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-extrabold text-indigo-800 tracking-tight">
                            EDUSTARHUB
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Use the prop value for display */}
                        <span className="text-gray-600 text-sm hidden sm:inline">
                            Logged in as: **{userRole}**
                        </span>
                        
                        {/* Log Out Button */}
                        <button 
                            onClick={handleLogout} // Calls the working handler
                            className="px-4 py-2 rounded-full bg-violet-50 text-violet-700 font-semibold text-sm hover:bg-violet-100 transition"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}