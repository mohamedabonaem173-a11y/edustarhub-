// pages/teacher/upload.js

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

export default function TeacherUpload() {
  const role = 'teacher';
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [fileType, setFileType] = useState('');
  const [examBoard, setExamBoard] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);

    if (!file || !title || !subject || !category) {
      setError('Title, subject, category, and file are required.');
      return;
    }

    setUploading(true);

    try {
      // Get teacher ID
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to upload.');
      const teacherId = session.user.id;

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('resources')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Save metadata in database (file_url = storage path!)
      const { error: dbError } = await supabase.from('resources').insert([{
        title,
        description,
        subject,
        category,
        file_type: fileType || fileExt,
        exam_board,
        file_url: storageData.path, // key fix!
        teacher_id: teacherId
      }]);

      if (dbError) throw dbError;

      setSuccess('Resource uploaded successfully!');
      setFile(null);
      setTitle('');
      setDescription('');
      setSubject('');
      setCategory('');
      setFileType('');
      setExamBoard('');

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole="Teacher" />
      <div className="max-w-7xl mx-auto flex pt-4">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-6">📤 Upload Resource</h1>

          {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}

          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
            <input type="text" placeholder="Resource Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="File Type (optional)" value={fileType} onChange={(e)=>setFileType(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="Exam Board (optional)" value={examBoard} onChange={(e)=>setExamBoard(e.target.value)} className="w-full p-3 border rounded-lg" />
            <textarea placeholder="Description (optional)" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-3 border rounded-lg" />
            <input type="file" onChange={handleFileChange} className="w-full" />

            <button onClick={handleUpload} disabled={uploading} className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
