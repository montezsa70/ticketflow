import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success("Successfully signed out");
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error("Error signing out");
  }
};