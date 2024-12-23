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
          toast.error("Please sign in to access this page");
          navigate('/');
          return;
        }

        const { data: userData } = await supabase.auth.getUser();
        const isAdminUser = userData.user?.email === 'admin@ticketflow.com';
        
        if (!isAdminUser) {
          toast.error("Only admin users can access this page");
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Auth error:', error);
        toast.error("Authentication error");
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  return { isAdmin, isLoading };
};