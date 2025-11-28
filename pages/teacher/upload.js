// pages/teacher/upload.js - FINAL STABLE VERSION

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient';

const RESOURCES_TABLE = 'resources';
const RESOURCE_BUCKET = 'resources'; 

export default function UploadResources() {
    const role = 'teacher';
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Math');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState(''); 
    
    // State for file input element reference
    const fileInputRef = useState(null); 

    useEffect(() => {
        async function getUserId() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
            }
            setLoading(false);
        }
        getUserId();
    }, []);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!title || !file || !userId) {
            setMessage('Please provide a title and select a file.');
            return;
        }

        setLoading(true);

        try {
            // 1. Upload the file to Supabase Storage
            const fileExtension = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
            const filePath = `${userId}/${fileName}`; // Store under user ID folder

            const { error: uploadError } = await supabase.storage
                .from(RESOURCE_BUCKET)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get the public URL for the file
            const { data: { publicUrl } } = supabase.storage
                .from(RESOURCE_BUCKET)
                .getPublicUrl(filePath);

            if (!publicUrl) throw new Error("Failed to get public URL after upload.");

            // 3. Save the metadata to the 'resources' table
            // MAPPING TO YOUR COLUMNS:
            const resourceData = {
                user_id: userId,
                title: title.trim(),
                category: category,
                description: description.trim(), 
                url: publicUrl, // Maps to the 'url' column
                file_type: fileExtension, // Maps to the 'file_type' column
            };

            const { error: dbError } = await supabase
                .from(RESOURCES_TABLE)
                .insert([resourceData]);

            if (dbError) {
                console.error('DATABASE INSERT FAILURE:', dbError);
                setMessage(`File uploaded, but failed to save metadata. Please check RLS policies (Action 2) or Supabase logs. Error code: ${dbError.code}`);
                return;
            }

            setMessage('Resource uploaded and metadata saved successfully!');
            
            // 4. Clean up the form fields
            setTitle('');
            setFile(null);
            setDescription('');
            // Use the ref to safely clear the file input value
            if (fileInputRef.current) {
                 fileInputRef.current.value = '';
            }


        } catch (error) {
            console.error('Upload Error:', error);
            setMessage(`Upload failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!userId) return <div className="min-h-screen flex items-center justify-center">Please log in as a teacher.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userRole="Teacher" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">⬆️ Upload New Resources</h1>

                    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-xl">
                        <form onSubmit={handleFileUpload} className="space-y-6">
                            
                            {message && (
                                <div className={`p-3 rounded-lg font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Resource Title (e.g., Algebra Study Guide)</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option>Math</option>
                                    <option>Science</option>
                                    <option>History</option>
                                    <option>Literature</option>
                                    <option>Exams & Revision</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <div>
                                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Select File</label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    ref={fileInputRef} // <-- Assign the ref here
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Upload Resource'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}