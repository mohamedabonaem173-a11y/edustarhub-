import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-lg border border-cyan-500/50 rounded-3xl shadow-[0_0_60px_cyan] p-8 relative overflow-hidden">

        {/* Platform Name */}
        <h1 className="text-4xl font-extrabold text-cyan-300 text-center mb-6 drop-shadow-lg">
          EDUSTARHUB
        </h1>

        <div className="text-center py-10 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-yellow-400 mb-6 drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2 className="text-3xl font-extrabold text-cyan-300 mb-4 drop-shadow-lg">
            Your Account is Pending Approval
          </h2>

          <p className="text-gray-300 text-lg mb-6">
            Thank you for signing up. Your account is currently under manual review.
          </p>

          <p className="bg-gray-900 border border-cyan-500/50 p-5 rounded-xl text-gray-200 text-lg font-semibold mb-6">
            Please check your email (including spam) within the next 6-8 hours for your login credentials.
          </p>

          <Link
            href="/"
            className="text-cyan-400 font-bold hover:text-cyan-200 transition text-lg"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
