import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// --- Inline Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function MockExamStartPage() {
  const router = useRouter();
  const { fileUrl, examId, studentId } = router.query;

  const [blankPage, setBlankPage] = useState(null);
  const [midCheckpoints, setMidCheckpoints] = useState([]);
  const [finalAnswer, setFinalAnswer] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(75 * 60); // 75 minutes

  // ---- Fullscreen + Exam Security ----
  useEffect(() => {
    if (!fileUrl) return;

    const enterFullscreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    };
    enterFullscreen();

    const beforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);

    const handleBlur = () => {
      setViolationCount(prev => {
        const newCount = prev + 1;
        alert(`⚠️ Switching tabs is not allowed! Violations: ${newCount}`);
        if (newCount >= 3) {
          alert('Exam auto-submitted due to multiple violations.');
          handleAutoSubmit();
        }
        return newCount;
      });
      window.focus();
    };
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, [fileUrl]);

  // ---- Countdown Timer ----
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Time is up! Exam will be auto-submitted.');
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  // ---- Upload handler ----
  const handleUpload = async (file, type) => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${studentId}-${examId}-${type}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('exam-uploads')
        .upload(fileName, file);

      if (error) throw error;

      const url = supabase.storage.from('exam-uploads').getPublicUrl(fileName).publicUrl;

      switch (type) {
        case 'blank': setBlankPage(url); break;
        case 'mid': setMidCheckpoints(prev => [...prev, url]); break;
        case 'final': setFinalAnswer(url); break;
        case 'id': setIdPhoto(url); break;
      }

    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  // ---- Auto-submit ----
  const handleAutoSubmit = () => {
    alert('Exam auto-submitted! Check your uploads.');
    router.push('/student/dashboard'); // Redirect to main dashboard
  };

  // ---- Missing File ----
  if (!fileUrl)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-xl text-center border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Missing Exam File</h1>
          <p className="text-gray-700">
            The exam file could not be loaded. Please return and try again.
          </p>
        </div>
      </div>
    );

  const allUploadsDone = blankPage && midCheckpoints.length > 0 && finalAnswer && idPhoto;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center space-y-6">
      
      {/* Exam Header + Timer */}
      <div className="w-full max-w-5xl text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900">📝 Mock Exam Session</h1>
        <p className="text-gray-600">
          Fullscreen mode & exam safety tools are active. Do <strong>not</strong> switch tabs.
        </p>
        <div className="text-xl font-bold text-red-600">Time Left: {formatTime(timeLeft)}</div>
      </div>

      {/* Exam Container */}
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl border border-gray-300 overflow-hidden">
        
        {/* Top Exam Bar */}
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
          <span className="font-semibold text-lg">📘 Exam In Progress</span>
          <span className="text-sm opacity-80">Stay focused — good luck!</span>
        </div>

        {/* PDF Viewer (larger) */}
        <iframe
          src={fileUrl}
          className="w-full"
          style={{ height: '110vh' }}
          title="Mock Exam PDF"
        ></iframe>

        {/* Upload Section */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">📷 Upload Your Exam Photos</h2>

          <div>
            <label className="block mb-1 font-medium">Blank Page Photo</label>
            <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'blank')} />
            {blankPage && <p className="text-green-600 mt-1">Uploaded</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Mid-Exam Checkpoints</label>
            <input type="file" accept="image/*" multiple onChange={e => Array.from(e.target.files).forEach(f => handleUpload(f, 'mid'))} />
            {midCheckpoints.length > 0 && <p className="text-green-600 mt-1">{midCheckpoints.length} files uploaded</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Final Answer Photo</label>
            <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'final')} />
            {finalAnswer && <p className="text-green-600 mt-1">Uploaded</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">ID Next to Paper</label>
            <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], 'id')} />
            {idPhoto && <p className="text-green-600 mt-1">Uploaded</p>}
          </div>

          <button
            onClick={handleAutoSubmit}
            disabled={!allUploadsDone || uploading}
            className={`mt-4 px-6 py-3 font-semibold rounded-lg transition
              ${allUploadsDone ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
