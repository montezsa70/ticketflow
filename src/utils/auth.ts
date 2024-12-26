import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signOut = async () => {
  try {
    // First clear any existing session
    await supabase.auth.clearSession();
    
    // Then perform the sign out
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any local storage items related to auth
    localStorage.removeItem('supabase.auth.token');
    
    toast.success("Successfully signed out");
    
    // Redirect to auth page using window.location to ensure complete page refresh
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Error signing out. Please try again.");
  }
};