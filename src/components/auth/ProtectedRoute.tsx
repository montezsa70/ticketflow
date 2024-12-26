import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const session = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuthorization = async () => {
      try {
        if (!session?.user?.email) {
          if (mounted) {
            setIsAuthorized(false);
            setLoading(false);
          }
          return;
        }

        if (requireAdmin) {
          const isAdminUser = session.user.email === 'mongezisilent@gmail.com';
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

    checkAuthorization();

    return () => {
      mounted = false;
    };
  }, [session, requireAdmin]);

  if (loading) return null;

  if (!isAuthorized) {
    const message = requireAdmin ? "Access denied. Admin only area." : "Please sign in to continue";
    toast.error(message);
    return <Navigate to={requireAdmin ? "/" : "/auth"} replace />;
  }

  return <>{children}</>;
};