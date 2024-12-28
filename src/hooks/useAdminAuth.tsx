import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        const isAdminUser = userData.user?.email === 'mongezisilent@gmail.com';
        setIsAdmin(isAdminUser);
        
        // Only redirect if trying to access admin routes without admin privileges
        if (!isAdminUser && window.location.pathname.startsWith('/admin')) {
          toast.error("Only admin users can access this page");
          navigate('/');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  return { isAdmin, isLoading };
};