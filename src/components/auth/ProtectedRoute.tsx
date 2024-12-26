import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const session = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkAuthorization = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          if (mounted) {
            setIsAuthorized(false);
            setLoading(false);
          }
          return;
        }

        if (requireAdmin) {
          const isAdminUser = currentSession.user.email === 'mongezisilent@gmail.com';
          if (mounted) setIsAuthorized(isAdminUser);
        } else {
          if (mounted) setIsAuthorized(true);
        }

        if (mounted) setLoading(false);
      } catch (error) {
        console.error('Authorization error:', error);
        if (mounted) {
          setIsAuthorized(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAuthorized(false);
          navigate('/auth');
        }
      } else {
        checkAuthorization();
      }
    });

    checkAuthorization();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [session, requireAdmin, navigate]);

  if (loading) return null;

  if (!isAuthorized) {
    const message = requireAdmin ? "Access denied. Admin only area." : "Please sign in to continue";
    toast.error(message);
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};