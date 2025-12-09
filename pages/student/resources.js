// pages/student/resources.js
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { supabase } from '../../lib/supabaseClient';

const RESOURCES_TABLE = 'resources';
const CATEGORIES = ['All Resources', 'Exams & Revision', 'Math', 'Science', 'History', 'Literature'];

const ResourceCard = ({ resource }) => {
  const fileType = (resource.file_type || 'N/A').toUpperCase();
  let icon = '📄';
  let colorClass = 'bg-blue-900 text-blue-400 border-blue-400';

  if (fileType.includes('PDF')) { icon='📜'; colorClass='bg-red-900 text-red-400 border-red-400'; }
  else if (fileType.includes('DOC') || fileType.includes('TXT')) { icon='📝'; colorClass='bg-indigo-900 text-indigo-400 border-indigo-400'; }
  else if (fileType.includes('JPG') || fileType.includes('PNG')) { icon='🖼️'; colorClass='bg-green-900 text-green-400 border-green-400'; }

  return (
    <div className={`bg-black/20 border-2 ${colorClass} rounded-xl shadow-[0_0_15px_${colorClass}] p-6 flex flex-col justify-between h-full hover:scale-105 transition-transform cursor-pointer`}>
      <div className="flex items-start space-x-4 mb-4">
        <div className={`p-3 rounded-xl ${colorClass} text-2xl`}>{icon}</div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{resource.category}</span>
          <h3 className="text-xl font-bold mt-1 line-clamp-2 text-white">{resource.title}</h3>
        </div>
      </div>
      <p className="text-sm text-gray-300 mb-4 line-clamp-3">{resource.description || 'No description provided.'}</p>

      <div className="mt-auto">
        <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-3">
          <p>Type: <span className="font-semibold">{fileType}</span></p>
          <p>Added: <span className="font-semibold">{new Date(resource.created_at).toLocaleDateString()}</span></p>
        </div>

        <button
          onClick={() => window.open(resource.file_url, '_blank')}
          className="mt-4 w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition shadow-lg"
        >
          ⬇️ Download
        </button>
      </div>
    </div>
  );
};

export default function ResourceHub() {
  const role = 'student';
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Resources');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from(RESOURCES_TABLE)
      .select('id,title,category,created_at,file_type,description,file_url')
      .order('created_at',{ascending:false});

    if (selectedCategory !== 'All Resources') query = query.eq('category', selectedCategory);
    if (searchQuery.trim()) query = query.ilike('title', `%${searchQuery.trim()}%`);

    try {
      const { data, error } = await query;
      if (error) throw error;
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Check database connectivity or RLS policies.');
    } finally { setLoading(false); }
  }, [selectedCategory, searchQuery]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Navbar userRole="Student" />
      <div className="max-w-7xl mx-auto flex pt-4">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-4 text-cyan-400">📚 Resource Hub</h1>

          {/* Filters */}
          <div className="bg-black/30 border-2 border-cyan-500 p-6 rounded-2xl shadow-[0_0_20px_cyan] mb-8">
            <div className="flex items-center space-x-2 mb-6 flex-wrap">
              <span className="text-lg font-semibold text-cyan-400">Filter By Category:</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                    className={`px-4 py-2 text-sm rounded-full ${selectedCategory===cat?'bg-cyan-600 text-black shadow-md':'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <input type="text" placeholder="Search resources by title..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-xl bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"/>
          </div>

          {/* Resource Grid */}
          {error && <div className="p-4 mb-4 bg-red-900 text-red-400 rounded">{error}</div>}

          {loading ? (
            <div className="text-center p-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-xl text-gray-400">Loading resources...</p>
            </div>
          ) : resources.length===0 ? (
            <div className="text-center p-12 bg-black/20 rounded-xl shadow-[0_0_15px_cyan] border border-cyan-500">
              <p className="text-xl font-semibold text-gray-400">No resources found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
