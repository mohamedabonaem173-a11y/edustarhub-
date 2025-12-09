import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Inline Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- Auth Component (Simplified & Styled) ---
function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center animate-bounce">👩‍🏫 Teacher Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Teacher email"
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Logging In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// --- Video Uploader & Link Submitter Component ---
function VideoUploader() {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' or 'link'

  const handleSubmission = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    
    let sourceType = '';
    let sourceUrl = '';
    let successMessage = '';
    
    try {
        if (mode === 'upload' && file) {
            const fileName = `videos/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from('summaries')
              .upload(fileName, file, { cacheControl: '3600', upsert: false });
            if (uploadError) throw uploadError;

            sourceType = 'upload';
            sourceUrl = fileName;
            successMessage = `✅ Video file uploaded successfully!`;

        } else if (mode === 'link' && link) {
            if (!link.includes('youtube.com') && !link.includes('youtu.be')) {
                throw new Error("Please enter a valid YouTube link.");
            }
            sourceType = 'youtube';
            sourceUrl = link;
            successMessage = `✅ YouTube link saved successfully!`;
        } else {
             throw new Error("Please provide a title and either a file or a link.");
        }

        const { error: dbError } = await supabase
            .from('video_library')
            .insert([{ title, type: sourceType, source_url: sourceUrl }]);
        if (dbError) throw dbError;
        
        setTitle('');
        setFile(null);
        setLink('');
        if (document.getElementById('file-input')) document.getElementById('file-input').value = null;

        setMessage(successMessage);

    } catch (error) {
        console.error('Submission Error:', error);
        setMessage(`❌ Submission failed: ${error.message || 'Unknown error.'}`);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-white shadow-lg rounded-2xl max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center animate-bounce">🎥 Add New Video Content</h2>
      
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setMode('upload')}
          className={`px-4 py-2 rounded-lg font-semibold ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
        >
          📁 Upload File
        </button>
        <button
          onClick={() => setMode('link')}
          className={`px-4 py-2 rounded-lg font-semibold ${mode === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
        >
          ▶️ YouTube Link
        </button>
      </div>

      <form onSubmit={handleSubmission} className="space-y-4">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Video Title" 
          required 
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        {mode === 'upload' && (
          <input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            disabled={uploading}
            className="w-full"
          />
        )}

        {mode === 'link' && (
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="YouTube URL"
            required
            disabled={uploading}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 rounded-lg font-semibold ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {uploading ? 'Processing...' : `Submit ${mode === 'upload' ? 'File' : 'Link'}`}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// --- Main Teacher Page Component ---
export default function TeacherVideoLibrary() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return <div className="flex items-center justify-center min-h-screen text-xl font-bold animate-pulse">Checking Teacher Credentials...</div>;
  }
  
  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold animate-bounce">🎬 Teacher Video Library</h1>
        <p className="text-gray-700 mt-2">Upload or link videos for your students to access! 🚀</p>
      </header>

      {session ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-center text-lg">Welcome back, <span className="font-bold">{session.user.email}</span>! 👋</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
          <VideoUploader />
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}
