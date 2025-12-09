// pages/teacher/mock-exam-submissions.js
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Inline Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TeacherMockExamSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all mock exam submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('mock_exam_submissions')
          .select('id, student_name, file_url, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setSubmissions(data || []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">📄 Mock Exam Submissions</h1>

      {loading && (
        <p className="text-gray-600 text-lg">Loading submissions...</p>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700 font-medium">
          Error fetching submissions: {error.message || JSON.stringify(error)}
        </div>
      )}

      {!loading && submissions.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl shadow-lg border border-gray-300">
          <p className="text-xl text-gray-600 font-semibold">No submissions yet.</p>
        </div>
      )}

      {!loading && submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col">
              <h2 className="text-lg font-bold text-indigo-700 mb-2">{s.student_name}</h2>
              <p className="text-gray-500 text-sm mb-4">
                Submitted: {new Date(s.created_at).toLocaleString()}
              </p>

              <iframe
                src={s.file_url}
                className="w-full flex-1 rounded-lg border border-gray-300"
                style={{ minHeight: '300px' }}
                title={`Submission - ${s.student_name}`}
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
