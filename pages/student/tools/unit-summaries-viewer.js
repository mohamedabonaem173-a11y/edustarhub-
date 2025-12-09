import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Inline Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function StudentSummarizer() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('unit_summaries')
          .select('id, file_name, storage_path')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const summariesWithUrls = data.map(summary => {
          const { data: publicUrlData } = supabase
            .storage
            .from('summaries')
            .getPublicUrl(summary.storage_path);

          return {
            ...summary,
            downloadUrl: publicUrlData?.publicUrl,
          };
        });

        setSummaries(summariesWithUrls);
      } catch (err) {
        console.error('Error fetching summaries:', err);
        setError('Failed to load unit summaries from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <h2 className="text-3xl font-bold mb-2 text-cyan-400 animate-pulse">📚 Loading Unit Summaries...</h2>
        <p className="text-gray-400">Connecting to Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <h2 className="text-3xl font-bold mb-2 text-red-500">⚠️ Error Loading Data</h2>
        <p className="text-red-400 mb-1">{error}</p>
        <p className="text-gray-400">Please check your Supabase connection or RLS policies.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-12 font-mono text-gray-100">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-cyan-400 tracking-wider">📖 Unit Summaries</h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Click any summary below to view or download. Hack your learning! ⚡
        </p>
      </header>

      {summaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">
          <span className="text-6xl mb-4 animate-pulse">🤖</span>
          <p className="text-xl md:text-2xl">No unit summaries have been uploaded yet.</p>
          <p className="mt-2 text-gray-400">Please check back later! ⏰</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <li
              key={summary.id}
              className="bg-gray-850 p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-shadow border border-cyan-600"
            >
              <a
                href={summary.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-center space-y-3"
              >
                <span className="text-6xl">📄</span>
                <span className="font-semibold text-lg md:text-xl text-cyan-400 hover:underline">
                  {summary.file_name}
                </span>
                <span className="text-gray-400 text-sm md:text-base">Click to download</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
