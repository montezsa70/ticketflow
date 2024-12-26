import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signOut = async () => {
  try {
    // First, sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Then clear local storage
    localStorage.clear(); // Clear all storage to ensure complete cleanup
    
    toast.success("Successfully signed out");
    
    // Finally, redirect to auth page
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Error signing out. Please try again.");
  }
};