// pages/teacher/manage.js - FINAL DEFINITIVE FIX (Using user_id column)

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 

const RESOURCE_BUCKET_NAME = 'resources'; 

export default function TeacherManage() {
    const role = 'teacher';
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function getUserId() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
            } else {
                setLoading(false);
                setMessage('Please log in to view your resources.');
            }
        }
        getUserId();
    }, []);

    useEffect(() => {
        async function fetchResources() {
            if (!userId) return;

            try {
                // Fetching using the CRITICAL 'user_id' column for filtering
                const { data, error } = await supabase
                    .from('resources')
                    // Select: title, category, created_at, id, url (for link/delete), file_type
                    .select('id, title, category, created_at, url, file_type') 
                    // Filter: Use 'user_id'
                    .eq('user_id', userId) 
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                setResources(data);
            } catch (error) {
                console.error("Error fetching resources:", error);
                // Updated message to reflect the problem area
                setMessage('Failed to load your resources. (Check RLS policy and the **user_id** column)'); 
            } finally {
                setLoading(false);
            }
        }
        fetchResources();
    }, [userId]); 

    // --- DELETE FUNCTIONALITY ---
    const handleDelete = async (resourceId, resourceTitle, fileUrl) => {
        if (!window.confirm(`Are you sure you want to delete the resource: ${resourceTitle}?`)) {
            return;
        }

        setLoading(true);
        setMessage('Deleting resource...');

        try {
            // Calculate the file path from the public URL (fileUrl is resource.url)
            const urlParts = fileUrl.split('/');
            const bucketIndex = urlParts.indexOf(RESOURCE_BUCKET_NAME);
            const filePath = urlParts.slice(bucketIndex + 1).join('/'); 

            // Delete the file from Supabase Storage
            const { error: storageError } = await supabase.storage
                .from(RESOURCE_BUCKET_NAME)
                .remove([filePath]); 

            if (storageError && storageError.message !== 'The resource was not found') {
                 console.error("Storage Delete Error:", storageError);
            }

            // Delete the entry from the 'resources' database table
            const { error: dbError } = await supabase
                .from('resources')
                .delete()
                .eq('id', resourceId);

            if (dbError) throw dbError;

            setResources(resources.filter(r => r.id !== resourceId));
            setMessage(`Resource "${resourceTitle}" deleted successfully.`);

        } catch (error) {
            console.error("Deletion Failed:", error);
            setMessage('Failed to delete resource. Check console for details.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000); 
        }
    };
    // --- END DELETE FUNCTIONALITY ---


    return (
        <div className="min-h-screen bg-gray-50"> 
            <Navbar userRole="Teacher" /> 
            
            <div className="max-w-7xl mx-auto flex pt-4"> 
                <Sidebar role={role} />
                
                <main className="flex-1 p-8">
                    
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">📂 Manage My Uploaded Files</h1>
                        <p className="text-gray-600 mt-2">View, edit, or remove the educational resources you have contributed.</p>
                    </div>

                    {message && (
                        <div className={`p-4 mb-4 rounded-lg font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                            <p className="text-xl text-violet-600">Loading your files...</p>
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                            <h2 className="text-xl text-gray-500">You haven't uploaded any resources yet.</h2>
                            <p className="mt-2 text-gray-400">Visit the "Upload Resources" page to get started!</p>
                        </div>
                    ) : (
                        // Table View
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {resources.map((resource) => (
                                        <tr key={resource.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{resource.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a 
                                                    href={resource.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-indigo-600 hover:text-indigo-900 hover:underline"
                                                >
                                                    .{resource.file_type}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(resource.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                
                                                <button 
                                                    onClick={() => alert(`Pretending to edit: ${resource.title}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 hover:underline transition duration-150"
                                                >
                                                    Edit
                                                </button>
                                                
                                                <button 
                                                    onClick={() => handleDelete(resource.id, resource.title, resource.url)}
                                                    className="text-red-600 hover:text-red-900 hover:underline transition duration-150"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}