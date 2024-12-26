import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signOut = async () => {
  try {
    // Clear local storage first
    localStorage.removeItem('supabase.auth.token');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast.error("Error signing out. Please try again.");
      throw error;
    }
    
    toast.success("Successfully signed out");
    
    // Use replace to avoid history stack issues
    window.location.replace('/auth');
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Error signing out. Please try again.");
  }
};