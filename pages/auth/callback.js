// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from "@supabase/supabase-js";

// --- Supabase Initialization (Must use your ENV variables) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Verifying account and credentials...');

  useEffect(() => {
    // 1. Listen for the authentication state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // This 'SIGNED_IN' event fires after the email token is processed
        if (event === 'SIGNED_IN' && session) {
          handleRoleRedirect(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          // Fallback if the session is somehow invalidated
          setStatus('Verification failed. Redirecting to sign in...');
          router.push('/signin?error=verification_failed');
        } else if (event === 'INITIAL_SESSION') {
            // Handle cases where the session is already present but no sign-in event fires
            if (session) {
                handleRoleRedirect(session.user.id);
            }
        }
      }
    );

    // 2. Function to fetch the role and redirect
    const handleRoleRedirect = async (userId) => {
        setStatus('Fetching your user profile...');
        
        // Fetch the user's profile information to get the role
        const { data, error } = await supabase
            .from('profiles') 
            .select('role')   
            .eq('id', userId) // Use 'id' as per your schema
            .single();

        if (error || !data || !data.role) {
            console.error('Error fetching user role, profile missing:', error?.message);
            // Send them to an onboarding or error page if profile/role is missing
            router.push('/signin?error=profile_incomplete');
            return;
        }

        setStatus(`Redirecting to ${data.role} dashboard...`);

        // 3. Conditional Redirect based on the role
        router.push(`/${data.role}/dashboard`);
    };

    // 4. Cleanup
    return () => subscription.unsubscribe();
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