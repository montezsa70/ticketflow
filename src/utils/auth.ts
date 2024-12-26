import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast.error("Error signing out. Please try again.");
      throw error;
    }
    
    // Clear any local storage or state if needed
    localStorage.removeItem('supabase.auth.token');
    toast.success("Successfully signed out");
    
    // Force reload to clear any remaining state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Error signing out. Please try again.");
  }
};