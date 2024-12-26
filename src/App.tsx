import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EventProvider } from "@/contexts/EventContext";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import EventPortal from "./pages/EventPortal";
import EventDetails from "./pages/EventDetails";
import Auth from "./pages/Auth";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!session?.user?.email) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const isAdminUser = session.user.email === 'mongezisilent@gmail.com';
        setIsAdmin(isAdminUser);
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdmin();
  }, [session]);

  if (loading) return null;
  
  if (!isAdmin) {
    toast.error("Access denied. Admin only area.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        
        if (!currentSession) {
          await supabase.auth.signOut();
          toast.error("Please sign in to continue");
          setLoading(false);
          return;
        }

        // Verify session persistence
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User verification error:', userError);
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return null;
  
  if (!session?.user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Clear any existing session first
        await supabase.auth.signOut();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          setInitialized(true);
          return;
        }

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            await supabase.auth.signOut();
          }
        });

        setInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  if (!initialized) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <EventProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedAdminRoute>
                      <Routes>
                        <Route index element={<Index />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                      </Routes>
                    </ProtectedAdminRoute>
                  } 
                />
                <Route 
                  path="/" 
                  element={
                    <ProtectedUserRoute>
                      <EventPortal />
                    </ProtectedUserRoute>
                  } 
                />
                <Route 
                  path="/event/:eventId" 
                  element={
                    <ProtectedUserRoute>
                      <EventDetails />
                    </ProtectedUserRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </EventProvider>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;