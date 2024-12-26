import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        const isAdmin = session?.user?.email === 'mongezisilent@gmail.com';
        toast.success("Successfully signed in!");
        
        // Redirect based on user type
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
      if (event === "USER_DELETED" || event === "SIGNED_OUT") {
        toast.error("Invalid login credentials. Please try again.");
      }
    });

    // Handle initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const isAdmin = session.user?.email === 'mongezisilent@gmail.com';
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95">
      <div className="w-full max-w-md p-8 glass-panel rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            TicketFlow
          </h1>
          <p className="text-white/60 mt-2">Sign in to manage your events</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: {
              default: {
                colors: {
                  brand: 'rgb(124, 58, 237)',
                  brandAccent: 'rgb(139, 92, 246)',
                  inputBackground: 'rgba(255, 255, 255, 0.05)',
                  inputText: 'white',
                  inputBorder: 'rgba(255, 255, 255, 0.1)',
                  inputBorderFocus: 'rgba(124, 58, 237, 0.5)',
                  inputBorderHover: 'rgba(255, 255, 255, 0.2)',
                  defaultButtonBackground: 'rgba(255, 255, 255, 0.05)',
                  defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.1)',
                  defaultButtonBorder: 'rgba(255, 255, 255, 0.1)',
                  defaultButtonText: 'white',
                  dividerBackground: 'rgba(255, 255, 255, 0.1)',
                },
                space: {
                  inputPadding: '1rem',
                  buttonPadding: '1rem',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                  buttonBorderRadius: '0.5rem',
                  inputBorderRadius: '0.5rem',
                },
              },
            },
          }}
          providers={[]}
          onError={(error) => {
            toast.error(error.message || "An error occurred during authentication");
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;