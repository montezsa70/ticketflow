import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signOut = async () => {
  try {
    // Clear any local storage items related to auth
    localStorage.removeItem('supabase.auth.token');
    
    // Perform the sign out
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Successfully signed out");
    
    // Force a page reload to ensure clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Error signing out. Please try again.");
  }
};