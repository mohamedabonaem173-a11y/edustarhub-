import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Inline Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- Auth Component ---
function Auth({ onSignedIn }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🧑‍🏫 Teacher Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Teacher email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-150 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
        >
          {loading ? 'Logging In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// --- File Uploader Component ---
function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setMessage('');

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = fileName;

    try {
      const { error: uploadError } = await supabase.storage
        .from('summaries')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('unit_summaries')
        .insert([{ file_name: file.name, storage_path: filePath }]);

      if (dbError) throw dbError;

      setMessage('✅ File uploaded successfully!');
      setFile(null);
      if (document.getElementById('file-input')) document.getElementById('file-input').value = null;

    } catch (error) {
      console.error('Upload/DB Error:', error);
      setMessage(`❌ Upload failed: ${error.message || 'Unknown error.'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8 mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">📁 Upload New Unit Summary</h2>
      <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          id="file-input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          disabled={uploading}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          type="submit"
          disabled={uploading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-150 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && (
        <p className={`mt-3 font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// --- Main Teacher Page Component ---
export default function TeacherSummarizer() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) return (
    <div className="flex items-center justify-center h-screen text-gray-500 font-medium">
      Checking Teacher Credentials...
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-50 pb-12">
      <header className="bg-yellow-400 text-white py-6 shadow-md text-center">
        <h1 className="text-3xl font-extrabold">📝 Teacher Unit Summarizer</h1>
      </header>

      <main className="px-6 md:px-12 mt-6">
        {session ? (
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 mb-4">Welcome back, <strong>{session.user.email}</strong>!</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="mb-6 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
            <FileUploader />
          </div>
        ) : (
          <Auth />
        )}
      </main>
    </div>
  );
}
