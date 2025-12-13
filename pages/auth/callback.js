// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from "@supabase/supabase-js"; 

// --- Supabase Initialization ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Verifying email token...');

  useEffect(() => {
    // 1. Function to process the token and session
    async function handleSessionCheck() {
      setStatus('Waiting for session establishment...');

      // The key is to wait for the Supabase client to process the URL fragment 
      // which contains the access_token and refresh_token.
      
      // Use getSession() to check if the client has successfully parsed the tokens.
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Session found! Proceed to role check and redirect.
        handleRoleRedirect(session.user.id);
      } else {
        // If no session is found after a few moments, the link failed or expired.
        // The most likely cause is the error you already saw: otp_expired.
        setStatus('Session not established. Link may be invalid or expired. Redirecting...');
        // We redirect to signin to allow the user to try again or sign in normally.
        router.push('/signin?error=link_failed'); 
      }
    }
    
    // 2. Function to fetch the role and redirect
    const handleRoleRedirect = async (userId) => {
        setStatus('Fetching user profile and role...');
        
        // Fetch the user's profile information to get the role
        const { data, error } = await supabase
            .from('profiles') 
            .select('role')   
            .eq('id', userId) 
            .single();

        if (error || !data || !data.role) {
            console.error('Error fetching user role, profile missing:', error?.message);
            setStatus('Profile incomplete. Please contact support.');
            router.push('/signin?error=profile_incomplete'); 
            return;
        }

        setStatus(`Success! Redirecting to ${data.role} dashboard...`);
        router.push(`/${data.role}/dashboard`);
    };

    // Execute the session check logic
    handleSessionCheck();
    
    // No cleanup necessary as we are not using a continuous subscription
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f0c29] to-[#24243e] text-cyan-400">
        <div className="text-center">
            <h1 className="text-4xl font-bold animate-pulse mb-4">Verification in Progress...</h1>
            <p className="text-xl">{status}</p>
        </div>
    </div>
  );
}