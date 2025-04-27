import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast({
          variant: "destructive",
          title: "Verification check failed",
          description: error.message,
        });
        return;
      }
      if (session) {
        navigate("/complete-profile");
      }
    };

    checkVerification();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/complete-profile");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div>
      <h1>Verify Your Email</h1>
      <p>Please check your inbox and verify your email to continue.</p>
    </div>
  );
};

export default VerifyEmail;