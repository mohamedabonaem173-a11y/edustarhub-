// lib/auth.js - The Robust, Final Version

import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient'; // Import the client

// --- 1. CONTEXT SETUP ---
const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  isStudent: false,
  isTeacher: false,
  logout: () => {},
});

// --- 2. AUTH PROVIDER COMPONENT ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetches the user's custom profile (role, subscription) from the database
  const fetchUserProfile = async (userId) => {
    if (!userId || !supabase) return setProfile(null);
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, is_subscribed')
      .eq('id', userId)
      .single();

    setProfile(profileData || null);
  };

  useEffect(() => {
    // Check if the supabase client is actually defined before accessing its properties
    if (!supabase) {
        console.error("Supabase client failed to initialize. Check your environment variables or lib/supabaseClient.js file.");
        setLoading(false);
        return; // Stop execution if client is undefined
    }

    // A. Initial session check and listener setup
    const setupAuthListener = async () => {
        // 1. Check for initial session immediately
        const { data: { session } } = await supabase.auth.getSession();
        const initialUser = session?.user || null;
        setUser(initialUser);
        if (initialUser) {
            await fetchUserProfile(initialUser.id);
        }
        setLoading(false);
        
        // 2. Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                const currentUser = session?.user || null;
                setUser(currentUser);
                if (currentUser) {
                    fetchUserProfile(currentUser.id);
                } else {
                    setProfile(null);
                }
                // Only set loading false once the initial state is resolved by the listener
                setLoading(false); 
            }
        );

        // Cleanup function for the listener
        return () => {
          authListener?.subscription?.unsubscribe();
        };
    };

    setupAuthListener();

  }, []); // Run only once on mount


  // Logout function
  const logout = async () => {
    if (!supabase) return; // Prevent crash if client is missing
    await supabase.auth.signOut();
    router.push('/');
  };

  const isTeacher = profile?.role === 'teacher';
  const isStudent = profile?.role === 'student';
  const isSubscribed = profile?.is_subscribed === true;

  const value = {
    user, profile, loading, isStudent, isTeacher, isSubscribed, logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. CUSTOM HOOK & PROTECTED ROUTE (Rest of the file remains the same) ---
export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, profile } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="p-8 text-center text-blue-600">Loading authentication...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // Once user is logged in and profile loads, check role
  if (profile && requiredRole && profile.role !== requiredRole) {
    if (profile.role === 'teacher') {
        router.push('/teacher/dashboard');
    } else {
        router.push('/student/dashboard');
    }
    return null;
  }

  return <>{children}</>;
};