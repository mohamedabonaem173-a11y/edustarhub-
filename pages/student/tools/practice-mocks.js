import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import { supabase } from '../../../lib/supabaseClient';

export default function PracticeMocksPage() {
  const role = 'student';
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMocks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('mocks')
          .select('*')
          .order('uploaded_at', { ascending: false });

        if (error) throw error;

        // Attach public URLs from Supabase storage
        const mocksWithUrls = data.map((mock) => {
          const { data: fileData } = supabase.storage
            .from('mocks')
            .getPublicUrl(mock.file_name);
          return { ...mock, public_url: fileData?.publicUrl || '#' };
        });

        setMocks(mocksWithUrls);
      } catch (err) {
        console.error('Error fetching mocks:', err.message);
        setMocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMocks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 font-mono text-gray-100">
      <Navbar userRole="Student" />

      <div className="max-w-7xl mx-auto flex pt-4">
        <Sidebar role={role} />

        <main className="flex-1 p-8">
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-2">💯 Practice Mock Exams</h1>
          <p className="text-gray-400 mb-8">
            Attempt teacher-uploaded mock exams under exam conditions. Fullscreen mode is recommended.
          </p>

          <div className="p-6 bg-gray-850 rounded-xl mb-10 border-l-4 border-cyan-500 shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">⚠️ Exam Conditions</h2>
            <ul className="text-gray-300 list-disc list-inside space-y-1 text-sm">
              <li>Full-screen mode is enforced for fairness.</li>
              <li>Switching tabs may flag your attempt.</li>
              <li>Treat this session as an official exam.</li>
            </ul>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading mock exams...</p>
          ) : mocks.length === 0 ? (
            <div className="text-center p-12 rounded-xl border-2 border-dashed border-cyan-600 bg-gray-850">
              <span className="text-5xl mb-4 block animate-pulse">📚</span>
              <p className="text-xl font-semibold text-gray-100 mb-2">No Practice Mocks Available</p>
              <p className="text-gray-400">Your teacher has not uploaded any mocks yet. Check back soon!</p>
              <Link
                href="/student/revision-tools-hub"
                className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-200 border-b border-dashed border-cyan-500"
              >
                Back to Tools Hub
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mocks.map((mock) => (
                <div
                  key={mock.id}
                  className="bg-gray-850 p-6 rounded-xl shadow-lg border-t-4 border-cyan-500 flex flex-col justify-between hover:shadow-cyan-500/50 transition duration-200"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2 truncate">{mock.original_name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{mock.description || 'No description'}</p>
                    <p className="text-sm text-gray-300">
                      Uploaded at: <span className="font-semibold">{new Date(mock.uploaded_at).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <Link
                    href={`/student/mock-exam-start?fileUrl=${encodeURIComponent(mock.public_url)}`}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-cyan-500 hover:bg-cyan-400 transition duration-150 shadow-md hover:shadow-cyan-600/50"
                  >
                    Start Exam
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
