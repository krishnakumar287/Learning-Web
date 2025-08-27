import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleRegisterUser(event) {
    event.preventDefault();
    setAuthError(null);
    
    try {
      const data = await registerService(signUpFormData);
      
      if (data.success) {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully. You can now sign in.",
          variant: "success",
        });
        
        // Reset form data and switch to sign in
        setSignUpFormData(initialSignUpFormData);
        // If you have a way to programmatically switch to sign in tab, do it here
        
        return true;
      } else {
        setAuthError(data.message || "Registration failed");
        toast({
          title: "Registration failed",
          description: data.message || "There was an error creating your account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("An unexpected error occurred during registration");
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    return false;
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    setAuthError(null);
    
    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        
        toast({
          title: "Welcome back!",
          description: `Signed in successfully as ${data.data.user.userName}`,
          variant: "success",
        });
        
        // Reset form data
        setSignInFormData(initialSignInFormData);
        
        // Navigate based on user role
        if (data.data.user.role === "instructor") {
          navigate("/instructor");
        } else if (data.data.user.role === "admin") {
          navigate("/admin/update-role");
        } else {
          navigate("/");
        }
        
        return true;
      } else {
        setAuthError(data.message || "Authentication failed");
        toast({
          title: "Sign in failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An unexpected error occurred during sign in");
      toast({
        title: "Sign in failed",
        description: error.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    return false;
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
    sessionStorage.removeItem("accessToken");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
        authError,
      }}
    >
      {loading ? <Skeleton className="h-screen w-full" /> : children}
    </AuthContext.Provider>
  );
}

