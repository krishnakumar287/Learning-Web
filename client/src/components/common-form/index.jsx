import { Button } from "../ui/button";
import FormControls from "./form-controls";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(e);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000); // Ensure button returns to normal state
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button 
        disabled={isButtonDisabled || isSubmitting} 
        type="submit" 
        className="mt-6 w-full h-11 text-base font-medium transition-all duration-200 relative overflow-hidden group"
      >
        <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
          {buttonText || "Submit"}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </span>
        {isSubmitting && (
          <Loader2 className="h-5 w-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </Button>
      
      {buttonText === "Sign In" && (
        <div className="mt-4 text-center">
          <button 
            type="button"
            className="text-sm text-primary/80 hover:text-primary transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  );
}

export default CommonForm;
