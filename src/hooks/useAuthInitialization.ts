import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuthInitialization = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) setInitialized(true);
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
          if (!mounted) return;

          switch (event) {
            case 'SIGNED_OUT':
              console.log('User signed out');
              localStorage.removeItem('supabase.auth.token');
              // Clear any other auth-related state here
              break;
            case 'SIGNED_IN':
              console.log('User signed in');
              break;
            case 'TOKEN_REFRESHED':
              console.log('Token refreshed');
              break;
          }
        });

        if (mounted) setInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return initialized;
};