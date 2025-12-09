// pages/teacher/manage.js - Fully functional with inline edit modal

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient'; 

const RESOURCE_BUCKET_NAME = 'resources';
const CATEGORIES = ['Exams & Revision', 'Math', 'Science', 'History', 'Literature'];

export default function TeacherManage() {
  const role = 'teacher';
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState(null);
  const [message, setMessage] = useState('');
  const [editResource, setEditResource] = useState(null); // resource being edited
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Fetch teacher ID
  useEffect(() => {
    async function fetchTeacherId() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setTeacherId(session.user.id);
      else {
        setLoading(false);
        setMessage('Please log in to view your resources.');
      }
    }
    fetchTeacherId();
  }, []);

  // Fetch resources uploaded by this teacher
  useEffect(() => {
    async function fetchResources() {
      if (!teacherId) return;
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('resources')
          .select('id, title, category, created_at, url, file_type')
          .eq('teacher_id', teacherId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setMessage('Failed to load your resources. Check console for details.'); 
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [teacherId]);

  // Delete resource
  const handleDelete = async (resourceId, resourceTitle, fileUrl) => {
    if (!window.confirm(`Are you sure you want to delete: ${resourceTitle}?`)) return;
    setLoading(true);
    setMessage('Deleting resource...');

    try {
      // Delete from storage if fileUrl exists
      if (fileUrl) {
        const filePath = fileUrl.split('/resources/')[1]; 
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from(RESOURCE_BUCKET_NAME)
            .remove([filePath]);
          if (storageError && storageError.message !== 'The resource was not found') {
            console.warn("Storage Delete Warning:", storageError);
          }
        }
      }

      // Delete DB entry
      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId)
        .eq('teacher_id', teacherId);
      if (dbError) throw dbError;

      setResources(prev => prev.filter(r => r.id !== resourceId));
      setMessage(`Resource "${resourceTitle}" deleted successfully.`);
    } catch (error) {
      console.error("Deletion Failed:", error);
      setMessage('Failed to delete resource. Check console for details.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Open edit modal
  const openEditModal = (resource) => {
    setEditResource(resource);
    setEditTitle(resource.title);
    setEditCategory(resource.category || CATEGORIES[0]);
  };

  // Save edits
  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty.");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase
        .from('resources')
        .update({ title: editTitle, category: editCategory })
        .eq('id', editResource.id)
        .eq('teacher_id', teacherId);

      if (error) throw error;

      setResources(prev => prev.map(r => r.id === editResource.id ? { ...r, title: editTitle, category: editCategory } : r));
      setMessage(`Resource "${editTitle}" updated successfully.`);
      closeEditModal();
    } catch (error) {
      console.error("Edit Failed:", error);
      setMessage('Failed to update resource. Check console for details.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const closeEditModal = () => {
    setEditResource(null);
    setEditTitle('');
    setEditCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="Teacher" />
      <div className="max-w-7xl mx-auto flex pt-4">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">📂 Manage My Uploaded Files</h1>
            <p className="text-gray-600 mt-2">View, edit, or remove the resources you have uploaded.</p>
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
            <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
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
                  {resources.map(resource => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{resource.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 hover:underline">
                          .{resource.file_type}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(resource.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => openEditModal(resource)} className="text-indigo-600 hover:text-indigo-900 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(resource.id, resource.title, resource.url)} className="text-red-600 hover:text-red-900 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- Inline Edit Modal --- */}
          {editResource && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4">Edit Resource</h2>
                <label className="block mb-2 font-medium">Title</label>
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border p-2 rounded mb-4"/>
                <label className="block mb-2 font-medium">Category</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full border p-2 rounded mb-4">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="flex justify-end space-x-2">
                  <button onClick={closeEditModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
