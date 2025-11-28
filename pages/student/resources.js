// pages/student/resources.js - FINAL STABLE STYLING

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient';
// REMOVED: import { FileText, Download, Search } from 'lucide-react'; 
import Link from 'next/link'; // Make sure Link is imported

const RESOURCES_TABLE = 'resources';
const CATEGORIES = ['All Resources', 'Exams & Revision', 'Math', 'Science', 'History', 'Literature'];

// Helper component for a Resource Card
const ResourceCard = ({ resource }) => {
    // Determine icon and color based on file type (basic logic)
    const fileType = (resource.file_type || 'N/A').toUpperCase();
    let icon = '📄'; // Default emoji
    let colorClass = 'bg-blue-100 text-blue-700';

    if (fileType.includes('PDF')) {
        icon = '📜';
        colorClass = 'bg-red-100 text-red-700';
    } else if (fileType.includes('DOC') || fileType.includes('TXT')) {
        icon = '📝';
        colorClass = 'bg-indigo-100 text-indigo-700';
    } else if (fileType.includes('JPG') || fileType.includes('PNG')) {
        icon = '🖼️';
        colorClass = 'bg-green-100 text-green-700';
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between h-full">
            <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 rounded-xl ${colorClass} text-2xl`}>
                    {icon}
                </div>
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{resource.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1 line-clamp-2">{resource.title}</h3>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {resource.description || "No description provided."}
            </p>

            <div className="mt-auto">
                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                    <p>Type: <span className="font-semibold">{fileType}</span></p>
                    <p>Added: <span className="font-semibold">{new Date(resource.created_at).toLocaleDateString()}</span></p>
                </div>
                
                <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
                >
                    ⬇️ Download
                </a>
            </div>
        </div>
    );
};

export default function ResourceHub() {
    const role = 'student';
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All Resources');
    const [searchQuery, setSearchQuery] = useState('');

    // --- Fetch Resources ---
    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        let query = supabase
            .from(RESOURCES_TABLE)
            .select('id, title, category, created_at, url, file_type, description') 
            .order('created_at', { ascending: false });

        // Apply Category Filter
        if (selectedCategory !== 'All Resources') {
            query = query.eq('category', selectedCategory);
        }

        // Apply Search Filter
        if (searchQuery.trim()) {
            query = query.ilike('title', `%${searchQuery.trim()}%`);
        }

        try {
            const { data, error } = await query;

            if (error) throw error;
            
            setResources(data);

        } catch (err) {
            console.error("Error fetching student resources:", err);
            setError('Failed to load resources. Check RLS policies or database connectivity.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchQuery]);

    useEffect(() => {
        // Simple User ID fetch (can be improved)
        async function getUserId() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
            }
        }
        getUserId();

        fetchResources();
    }, [fetchResources]); 

    // --- Handlers ---
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery(''); // Clear search when category changes
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    return (
        <div className="min-h-screen bg-gray-100"> 
            <Navbar userRole="Student" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Resource Hub</h1>
                    <p className="text-gray-500 mb-10">Find and download educational resources uploaded by your teachers.</p>
                    
                    {/* --- CATEGORY AND SEARCH FILTERS --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="text-lg font-semibold text-gray-700">Filter By Category:</span>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryChange(category)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 
                                            ${selectedCategory === category 
                                                ? 'bg-indigo-600 text-white shadow-md' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                                        }
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search resources by title..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {/* Replaced Lucide Search icon with a simple emoji */}
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
                        </div>
                    </div>
                    
                    {/* --- RESOURCE GRID --- */}
                    <div className="pb-8">
                        {error && (
                            <div className="p-4 mb-4 rounded-lg font-medium bg-red-100 text-red-700">
                                **Database Error:** {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center p-12">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                                <p className="text-xl text-gray-600">Searching and loading resources...</p>
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-dashed border-gray-300">
                                <p className="text-xl font-semibold text-gray-500">No resources found matching your criteria.</p>
                                <p className="text-gray-400 mt-2">Try a different search term or click "All Resources" above.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {resources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}