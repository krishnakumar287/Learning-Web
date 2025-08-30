import { Button } from "../ui/button";
import FormControls from "./form-controls";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', null
  const buttonRef = useRef(null);
  const formContainerRef = useRef(null);
  
  // Reset form status when buttonText changes (e.g., when switching tabs)
  useEffect(() => {
    setFormStatus(null);
  }, [buttonText]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Button press effect
    if (buttonRef.current) {
      buttonRef.current.classList.add('scale-95');
      setTimeout(() => {
        buttonRef.current?.classList.remove('scale-95');
      }, 150);
    }
    
    setIsSubmitting(true);
    
    try {
      await handleSubmit(e);
      // Show success state
      setFormStatus('success');
      
      // Apply success shake animation to form
      if (formContainerRef.current) {
        formContainerRef.current.classList.add('animate-success-bounce');
        setTimeout(() => {
          formContainerRef.current?.classList.remove('animate-success-bounce');
        }, 1000);
      }
    } catch (error) {
      // Show error state
      setFormStatus('error');
      
      // Apply error shake animation to form
      if (formContainerRef.current) {
        formContainerRef.current.classList.add('animate-error-shake');
        setTimeout(() => {
          formContainerRef.current?.classList.remove('animate-error-shake');
        }, 500);
      }
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        // Reset form status after a delay
        setTimeout(() => setFormStatus(null), 2000);
      }, 1000);
    }
  };

  return (
    <div 
      ref={formContainerRef}
      className="transition-all duration-300"
    >
      <form onSubmit={onSubmit} className="relative">
        <FormControls
          formControls={formControls}
          formData={formData}
          setFormData={setFormData}
        />
        
        {/* Premium submit button with enhanced animations */}
        <div className="mt-6 relative">
          {/* Button glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-md blur transition-opacity duration-300 ${
            isButtonDisabled || isSubmitting ? 'opacity-0' : 'opacity-50'
          }`}></div>
          
          <Button 
            ref={buttonRef}
            disabled={isButtonDisabled || isSubmitting} 
            type="submit" 
            className="w-full h-12 text-base font-medium relative overflow-hidden group transition-all duration-200 transform hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-0"
          >
            {/* Success overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transition-transform duration-300 ${
              formStatus === 'success' ? 'translate-y-0' : 'translate-y-full'
            }`}></div>
            
            {/* Error overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform duration-300 ${
              formStatus === 'error' ? 'translate-y-0' : 'translate-y-full'
            }`}></div>
            
            {/* Text content with different states */}
            <div className="relative z-10">
              <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                isSubmitting ? 'opacity-0 transform translate-y-3' : 
                formStatus ? 'opacity-0' : 'opacity-100'
              }`}>
                {buttonText || "Submit"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              
              {/* Loading spinner */}
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 animate-fadeIn">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
              
              {/* Success message */}
              {formStatus === 'success' && !isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 animate-fadeIn">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {buttonText === "Sign In" ? "Signed in!" : "Account created!"}
                  </span>
                </div>
              )}
              
              {/* Error message */}
              {formStatus === 'error' && !isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 animate-fadeIn">
                  <span>Please try again</span>
                </div>
              )}
            </div>
            
            {/* Button particles effect on hover */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`absolute w-1 h-1 rounded-full bg-white/70 opacity-0 group-hover:opacity-100 group-hover:animate-particle-rise`}
                  style={{ 
                    left: `${20 + i * 15}%`, 
                    bottom: '-4px',
                    animationDelay: `${i * 100}ms`
                  }}
                ></div>
              ))}
            </div>
          </Button>
        </div>
      </form>
      
      {buttonText === "Sign In" && (
        <div className="mt-4 text-center">
          <button 
            type="button"
            className="text-sm text-indigo-600/80 hover:text-indigo-600 transition-colors relative group overflow-hidden"
          >
            <span className="relative z-10">Forgot your password?</span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-600/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CommonForm;
