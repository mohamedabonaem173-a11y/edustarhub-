import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function PendingPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-md w-full bg-gray-800/90 border border-cyan-500 rounded-3xl p-8 text-center shadow-[0_0_40px_cyan]">
        <h1 className="text-3xl font-extrabold text-cyan-400 mb-4">
          Account Under Review
        </h1>
        <p className="text-gray-300 mb-6">
          Your account has been created successfully, but it is still under
          review by our team.
        </p>
        <p className="text-gray-400 mb-8">
          You’ll receive an email once your access has been approved.
        </p>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
