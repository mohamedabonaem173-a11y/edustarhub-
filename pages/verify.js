import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_token', token)
        .single();

      if (error || !profile) {
        setMessage('❌ Invalid or expired verification link.');
        return;
      }

      await supabase.from('profiles')
        .update({ is_verified: true, verification_token: null })
        .eq('id', profile.id);

      setMessage('✅ Email verified! Redirecting to login...');
      setTimeout(() => router.push('/signin'), 3000);
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
}
