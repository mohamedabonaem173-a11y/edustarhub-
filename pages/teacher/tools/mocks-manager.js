// pages/teacher/tools/mocks-manager.js

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import { supabase } from '../../../lib/supabaseClient.js';

export default function MocksManager() {
    const role = 'teacher';
    const teacherId = '29e544fa-8322-4417-9b87-6c76f34583f7'; // your teacher UUID

    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch uploaded mocks
    const fetchFiles = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('mocks')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('Error fetching mocks:', error);
            setError('Failed to load mocks.');
            setFiles([]);
        } else {
            setFiles(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle file upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        try {
            const fileName = `${teacherId}_${Date.now()}_${selectedFile.name}`;

            // Upload file to Storage
            const { error: uploadError } = await supabase
                .storage
                .from('mocks')  // your bucket name
                .upload(fileName, selectedFile, { upsert: false });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase
                .storage
                .from('mocks')
                .getPublicUrl(fileName);

            const publicUrl = urlData.publicUrl;

            // Insert metadata into DB
            const { data: dbData, error: dbError } = await supabase
                .from('mocks')
                .insert([{
                    teacher_id: teacherId,
                    file_name: fileName,
                    original_name: selectedFile.name,
                    file_type: selectedFile.type,
                    description,
                    public_url: publicUrl
                }])
                .select();

            if (dbError) throw dbError;

            setFiles([dbData[0], ...files]);
            setSelectedFile(null);
            setDescription('');
        } catch (err) {
            console.error('Upload error:', err);
            setError(`Failed to upload file: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userRole="Teacher" />
            <div className="max-w-7xl mx-auto flex pt-4">
                <Sidebar role={role} />
                <main className="flex-1 p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">📁 Mocks Manager</h1>
                    <p className="text-gray-500 mb-6">Upload any file type for your students.</p>

                    {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

                    {/* Upload Form */}
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                        <form onSubmit={handleUpload} className="space-y-3">
                            <div>
                                <label className="block text-gray-700">Description (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !selectedFile}
                                className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-150 ${loading || !selectedFile ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                Upload
                            </button>
                        </form>
                    </div>

                    {/* Uploaded Files List */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-3">Uploaded Files ({files.length})</h2>
                        {loading && <p className="text-indigo-600">Loading files...</p>}
                        <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {!loading && files.length === 0 && <p className="text-gray-500">No files uploaded yet.</p>}
                            {files.map(file => (
                                <li key={file.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                                    <a href={file.public_url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 truncate flex-grow">
                                        {file.original_name}
                                    </a>
                                    {file.file_type && <span className="ml-4 text-gray-500 text-sm">{file.file_type}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    );
}
