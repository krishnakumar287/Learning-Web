import CommonForm from "@/components/common-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { BookOpen, GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [animateOut, setAnimateOut] = useState(false);
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  // Handle tab transitions with animation
  function handleTabChange(value) {
    if (value === activeTab) return;
    setAnimateOut(true);
    setTimeout(() => {
      setActiveTab(value);
      setAnimateOut(false);
    }, 300);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding and decorative elements */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white flex-col">
        <div className="flex items-center p-8">
          <GraduationCap className="h-10 w-10 mr-3" />
          <span className="font-extrabold text-2xl tracking-tight">ELITELEARN</span>
        </div>
        
        <div className="flex flex-col justify-center items-center h-full px-12 pb-20">
          <BookOpen className="h-16 w-16 mb-8 opacity-80" />
          <h1 className="text-4xl font-bold mb-6 text-center">Transform Your Learning Journey</h1>
          <p className="text-xl opacity-80 text-center mb-12">
            Join our premium learning platform and gain access to world-class courses taught by industry experts.
          </p>
          
          <div className="grid grid-cols-2 gap-8 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Premium Content</h3>
              <p className="text-sm opacity-80">Access exclusive, high-quality courses designed for real-world skills.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Expert Instructors</h3>
              <p className="text-sm opacity-80">Learn from industry leaders with years of practical experience.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Interactive Learning</h3>
              <p className="text-sm opacity-80">Engage with projects and assignments that enhance retention.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Community Support</h3>
              <p className="text-sm opacity-80">Connect with peers and mentors to accelerate your growth.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Authentication form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <header className="px-6 py-4 flex items-center justify-center border-b">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 mr-2" />
            <span className="font-extrabold text-xl">ELITELEARN</span>
          </div>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md shadow-xl border-0 rounded-xl overflow-hidden">
            <div className="flex border-b">
              <Button 
                variant={activeTab === "signin" ? "ghost" : "ghost"} 
                onClick={() => handleTabChange("signin")} 
                className={`flex-1 rounded-none h-14 text-base font-medium ${activeTab === "signin" ? 'bg-background text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                Sign In
              </Button>
              <Button 
                variant={activeTab === "signup" ? "ghost" : "ghost"} 
                onClick={() => handleTabChange("signup")} 
                className={`flex-1 rounded-none h-14 text-base font-medium ${activeTab === "signup" ? 'bg-background text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                Create Account
              </Button>
            </div>
            
            <CardContent className="p-8">
              <div className={`transition-all duration-300 ${animateOut ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {activeTab === "signin" ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Welcome back</h2>
                      <p className="text-muted-foreground">Enter your credentials to access your account</p>
                    </div>
                    
                    <CommonForm
                      formControls={signInFormControls}
                      buttonText={"Sign In"}
                      formData={signInFormData}
                      setFormData={setSignInFormData}
                      isButtonDisabled={!checkIfSignInFormIsValid()}
                      handleSubmit={handleLoginUser}
                    />
                    
                    <div className="text-center text-sm text-muted-foreground">
                      <span>Don't have an account? </span>
                      <button 
                        onClick={() => handleTabChange("signup")} 
                        className="underline font-medium text-primary hover:text-primary/90"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Create an account</h2>
                      <p className="text-muted-foreground">Enter your details to get started with EliteLearn</p>
                    </div>
                    
                    <CommonForm
                      formControls={signUpFormControls}
                      buttonText={"Create Account"}
                      formData={signUpFormData}
                      setFormData={setSignUpFormData}
                      isButtonDisabled={!checkIfSignUpFormIsValid()}
                      handleSubmit={handleRegisterUser}
                    />
                    
                    <div className="text-center text-sm text-muted-foreground">
                      <span>Already have an account? </span>
                      <button 
                        onClick={() => handleTabChange("signin")} 
                        className="underline font-medium text-primary hover:text-primary/90"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
