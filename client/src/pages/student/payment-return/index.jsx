import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { captureAndFinalizePaymentService } from "@/services";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      async function capturePayment() {
        try {
          const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

          if (!orderId) {
            setError("Order information not found");
            setProcessing(false);
            return;
          }

          const response = await captureAndFinalizePaymentService(
            paymentId,
            payerId,
            orderId
          );

          if (response?.success) {
            sessionStorage.removeItem("currentOrderId");
            setSuccess(true);
            setProcessing(false);
            
            // Use navigate instead of window.location to stay within React Router
            setTimeout(() => {
              navigate("/student-courses");
            }, 2000);
          } else {
            setError(response?.message || "Payment processing failed");
            setProcessing(false);
          }
        } catch (err) {
          console.error("Payment error:", err);
          setError("An error occurred while processing payment");
          setProcessing(false);
        }
      }

      capturePayment();
    } else {
      setError("Payment information not found in the URL");
      setProcessing(false);
    }
  }, [payerId, paymentId, navigate]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto shadow-lg border-0">
        <CardHeader className={success ? "bg-emerald-50" : processing ? "bg-blue-50" : "bg-red-50"}>
          <CardTitle className={`text-xl ${success ? "text-emerald-700" : processing ? "text-blue-700" : "text-red-700"}`}>
            {processing ? "Processing Payment" : success ? "Payment Successful" : "Payment Error"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {processing ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Processing your payment, please wait...</p>
            </div>
          ) : success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thank you for your purchase!</h3>
              <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to your courses...</p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Processing Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/courses")}
              >
                Return to Courses
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PaypalPaymentReturnPage;
