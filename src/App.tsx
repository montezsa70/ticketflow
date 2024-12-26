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
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'mongezisilent@gmail.com') {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    checkAdmin();
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
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
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