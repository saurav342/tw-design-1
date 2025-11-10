import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../services/api.js';

const EmailVerificationSent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || sessionStorage.getItem('signup.email') || '';
  const role = location.state?.role || sessionStorage.getItem('signup.role') || 'founder';
  
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!email || !role) {
      navigate('/signup', { replace: true });
    }
  }, [email, role, navigate]);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      await authApi.sendVerificationEmail({
        email: email.trim(),
        role: role,
      });
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to resend verification email:', err);
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    navigate(`/signup/email?role=${role}`, {
      state: { email, role }
    });
  };

  const handleContinue = () => {
    // Navigate to signup form - email verification will be checked on backend
    navigate(`/signup/${role}`, {
      state: { email, role, emailVerified: false }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-1">
              We've sent a verification link to
            </p>
            <p className="text-sm font-semibold text-purple-600 break-all">
              {email}
            </p>
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-900">Verification email sent successfully!</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-8 space-y-4">
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900 font-semibold mb-2">Next Steps:</p>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Check your inbox for the verification email</li>
                <li>Click the "Verify Email Address" button in the email</li>
                <li>You'll be redirected to complete your signup</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-yellow-800">
                <strong>⚠️ Important:</strong> The verification link will expire in 30 minutes. If you don't see the email, check your spam folder.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleResend}
              disabled={isResending || resendSuccess}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleContinue}
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <span>I've verified my email</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change email</span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSent;

