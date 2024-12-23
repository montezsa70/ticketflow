import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 glass-panel p-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            TicketFlow
          </h1>
          <p className="text-white/60">
            Sign in to access the admin dashboard
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: 'dark',
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                  inputBackground: 'rgba(255, 255, 255, 0.05)',
                  inputBorder: 'rgba(255, 255, 255, 0.1)',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'bg-purple-gradient hover:opacity-90 transition-opacity w-full',
              input: 'input-glass w-full',
              label: 'text-white/80',
            }
          }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default AuthPage;