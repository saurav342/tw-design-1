import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';

const EmailEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role from URL params or location state
  const searchParams = new URLSearchParams(location.search);
  const roleFromUrl = searchParams.get('role') || location.state?.role || 'founder';
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [shouldLogin, setShouldLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Import API function
      const { authApi } = await import('../services/api.js');
      
      // Send verification email
      await authApi.sendVerificationEmail({
        email: email.trim(),
        role: roleFromUrl,
      });

      // Store email and role in sessionStorage
      sessionStorage.setItem('signup.email', email.trim());
      sessionStorage.setItem('signup.role', roleFromUrl);

      // Navigate to OTP verification page
      navigate(`/signup/${roleFromUrl}/verify-otp`, { 
        replace: false,
        state: { email: email.trim(), role: roleFromUrl }
      });
    } catch (err) {
      // Check if error response indicates user should log in
      const errorData = err.data || {};
      const shouldLoginFlag = errorData.shouldLogin || false;
      
      setError(err.message || 'Failed to send verification email. Please try again.');
      setShouldLogin(shouldLoginFlag);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/signup');
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
              Enter Your Email
            </h1>
            <p className="text-gray-600">
              We'll send a verification code to your email address to continue your{' '}
              <span className="font-semibold text-purple-600 capitalize">{roleFromUrl}</span> signup.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                  {shouldLogin && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => navigate('/login', { state: { email: email.trim(), role: roleFromUrl } })}
                      className="mt-2 p-0 h-auto text-sm text-red-700 hover:text-red-800 underline font-semibold"
                    >
                      Go to Login →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setShouldLogin(false);
                }}
                className="w-full h-12 text-base"
                disabled={isSubmitting}
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification code to this email address
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-70"
              >
                Back to signup options
              </Button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Note:</span> We'll send you a 6-digit verification code to verify your email address.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmailEntry;

