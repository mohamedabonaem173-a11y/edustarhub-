// pages/_app.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // 👈 IMPORTANT: Adjust path if needed
import "../style/globals.css"; // Your existing global CSS import

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Explicitly check for the session on initial load.
    // If there's an #access_token in the URL (from the email link), 
    // this call implicitly processes it and establishes the session.
    supabase.auth.getSession().then(({ data: { session } }) => {
      // We don't need to store the session here, just ensure it's loaded
      setLoading(false);
    }).catch(() => {
      setLoading(false); // Even on error, stop blocking the page
    });

    // 2. Set up a listener for future session changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // This listener ensures components update when auth state changes
        // even though the initial state check is done above.
      }
    );

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // --- Global Loading State ---
  // We hold the rendering of the rest of the app until the session check is complete.
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-cyan-400 text-3xl font-bold">
            <p className="animate-pulse">Initializing Security Protocol...</p>
        </div>
    );
  }

  // Once loading is false, render the current page component
  return <Component {...pageProps} />;
}

export default MyApp;