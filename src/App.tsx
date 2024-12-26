import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EventProvider } from "@/contexts/EventContext";
import Index from "./pages/Index";
import EventPortal from "./pages/EventPortal";
import EventDetails from "./pages/EventDetails";
import Auth from "./pages/Auth";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          toast.error("Authentication error");
          setLoading(false);
          return;
        }

        if (user?.email === 'mongezisilent@gmail.com') {
          setIsAdmin(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      } else if (session) {
        const { user } = session;
        setIsAdmin(user?.email === 'mongezisilent@gmail.com');
      }
    });

    checkAdmin();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  
  if (!isAdmin) {
    toast.error("Access denied. Admin only area.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  
  if (!isAuthenticated) {
    toast.error("Please sign in to continue");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;