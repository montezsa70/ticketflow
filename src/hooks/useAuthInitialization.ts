import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
          await supabase.auth.signOut();
          localStorage.clear();
          if (mounted) setInitialized(true);
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          console.log('Auth state changed:', event, 'Session:', session ? 'exists' : 'null');

          switch (event) {
            case 'SIGNED_OUT':
              console.log('User signed out');
              localStorage.clear();
              if (window.location.pathname !== '/auth') {
                window.location.replace('/auth');
              }
              break;
            case 'SIGNED_IN':
              console.log('User signed in');
              const { data: { user } } = await supabase.auth.getUser();
              if (user?.email === 'mongezisilent@gmail.com') {
                window.location.replace('/admin');
              } else {
                window.location.replace('/');
              }
              break;
            case 'TOKEN_REFRESHED':
              console.log('Token refreshed');
              break;
            case 'USER_UPDATED':
              console.log('User updated');
              break;
            case 'INITIAL_SESSION':
              if (!session) {
                localStorage.clear();
                if (window.location.pathname !== '/auth') {
                  window.location.replace('/auth');
                }
              }
              break;
          }
        });

        // Handle token refresh error
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'TOKEN_REFRESHED' && !session) {
            console.log('Token refresh failed, signing out');
            localStorage.clear();
            if (window.location.pathname !== '/auth') {
              window.location.replace('/auth');
            }
          }
        });

        if (mounted) setInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        await supabase.auth.signOut();
        localStorage.clear();
        if (mounted) setInitialized(true);
        window.location.replace('/auth');
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return initialized;
};