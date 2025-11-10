import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authApi } from '../services/api.js';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const [verifiedData, setVerifiedData] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      // If token is provided, verify it
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Missing token.');
        return;
      }

      try {
        const response = await authApi.verifyEmail({ token });
        
        if (response.verified) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to signup...');
          setVerifiedData(response);
          
          // Store verification status
          sessionStorage.setItem('signup.email', response.email);
          sessionStorage.setItem('signup.role', response.role);
          sessionStorage.setItem('signup.emailVerified', 'true');
          
          // Redirect to signup form after a brief delay
          setTimeout(() => {
            navigate(`/signup/${response.role}`, {
              replace: true,
              state: {
                email: response.email,
                role: response.role,
                emailVerified: true,
              }
            });
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Invalid or expired verification link. Please request a new verification email.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  const handleResendEmail = () => {
    const role = verifiedData?.role || 'founder';
    navigate(`/signup/email?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            {status === 'verifying' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {status === 'verifying' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>
            <p className="text-gray-600">
              {message}
            </p>
          </div>

          {/* Error Actions */}
          {status === 'error' && (
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl"
              >
                Request New Verification Email
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoToSignup}
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Go to Signup</span>
              </Button>
            </div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirecting you to complete your signup...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

