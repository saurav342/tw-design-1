import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Shield, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const email = location.state?.email || sessionStorage.getItem('signup.email') || '';
  const role = params.role || location.state?.role || sessionStorage.getItem('signup.role') || 'founder';
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);

  // Mock OTP - in production, this would come from the backend
  const MOCK_OTP = '1234';

  useEffect(() => {
    // Redirect if no email/role found
    if (!email || !role) {
      navigate('/signup', { replace: true });
    }

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, role, navigate]);

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 4).split('');
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 4) {
            newOtp[i] = digit;
          }
        });
        setOtp(newOtp);
        setError('');
        // Focus the last filled input or the first empty one
        const lastFilledIndex = digits.length - 1;
        const nextIndex = lastFilledIndex < 3 ? lastFilledIndex + 1 : 3;
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setIsVerifying(true);

    // Simulate API call to verify OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock verification - check against MOCK_OTP
      if (otpString !== MOCK_OTP) {
        setError('Invalid verification code. Please try again.');
        setIsVerifying(false);
        return;
      }

      // OTP verified successfully
      setIsVerified(true);

      // Store verification status in sessionStorage
      sessionStorage.setItem('signup.otpVerified', 'true');

      // Navigate to signup form after brief success state
      setTimeout(() => {
        navigate(`/signup/${role}`, {
          replace: true,
          state: { 
            email: email,
            role: role,
            otpVerified: true 
          }
        });
      }, 600);

    } catch (err) {
      setError('Verification failed. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    navigate(`/signup/email?role=${role}`, {
      state: { email, role }
    });
  };

  const handleResend = async () => {
    setError('');
    setOtp(['', '', '', '']);
    
    // In real implementation, this would call the backend to resend OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-1">
              We've sent a verification code to
            </p>
            <p className="text-sm font-semibold text-purple-600 break-all">
              {email}
            </p>
          </div>

          {/* Success State */}
          {isVerified && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-900">Email verified! Redirecting...</p>
            </div>
          )}

          {/* Error Alert */}
          {error && !isVerified && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 text-center block">
                Enter 4-digit code
              </Label>
              
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl"
                    disabled={isVerifying || isVerified}
                    required
                  />
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isVerifying || isVerified}
                  className="font-semibold text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend code
                </button>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isVerifying || isVerified || otp.join('').length !== 4}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : isVerified ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verified!</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isVerifying || isVerified}
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change email</span>
              </Button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800 text-center">
              <span className="font-semibold">Test Mode:</span> Use code <span className="font-mono font-bold">1234</span> to verify
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

