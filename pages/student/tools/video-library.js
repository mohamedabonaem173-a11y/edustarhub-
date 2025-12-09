import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Inline Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getYoutubeEmbedUrl(url) {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

export default function StudentVideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('video_library')
          .select('id, title, type, source_url')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const videosWithUrls = data.map(video => {
          let finalUrl = video.source_url;
          let icon = '🔗';
          
          if (video.type === 'upload') {
            const { data: publicUrlData } = supabase
              .storage
              .from('summaries')
              .getPublicUrl(video.source_url);
            finalUrl = publicUrlData?.publicUrl;
            icon = '🎥';
          } else if (video.type === 'youtube') {
            icon = '▶️';
          }

          return { ...video, displayUrl: finalUrl, icon };
        });
        
        setVideos(videosWithUrls);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load video library.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 font-mono text-cyan-400">
        <h2 className="text-3xl font-bold mb-2 animate-pulse">📺 Loading Video Library...</h2>
        <p className="text-gray-400">Connecting to Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 font-mono text-red-500">
        <h2 className="text-3xl font-bold mb-2 animate-pulse">⚠️ Error Loading Data</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-12 font-mono text-gray-100">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-cyan-400 animate-bounce tracking-wider">🎬 Student Video Library</h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Access educational videos shared by your teacher! ⚡
        </p>
      </header>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">
          <span className="text-6xl mb-4 animate-pulse">🤖</span>
          <p className="text-xl md:text-2xl">No videos have been added yet.</p>
          <p className="mt-2 text-gray-400">Check back later! ⏰</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <li
              key={video.id}
              className="bg-gray-850 p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-shadow border border-cyan-600 flex flex-col items-center justify-center"
            >
              <a
                href={video.displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-center space-y-3"
              >
                <span className="text-6xl animate-bounce">{video.icon}</span>
                <span className="font-semibold text-lg md:text-xl text-cyan-400 hover:underline">
                  {video.title}
                </span>
                <span className="text-gray-400 text-sm md:text-base">
                  {video.type === 'upload' ? 'Local Upload' : 'YouTube Link'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
