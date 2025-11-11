import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api.js';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('founder');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsSendingOTP(true);
    setError('');

    try {
      await authApi.sendVerificationEmail({ email: email.trim(), role });
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    setIsLoading(true);

    // Simple validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    // If OTP mode, validate OTP
    if (requiresOTP || otpSent) {
      if (!otp.trim()) {
        setError('Please enter the OTP code');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔐 Attempting OTP login:', { email, role, otp });
        
        // Use login endpoint with OTP
        const response = await authApi.login({ email: email.trim(), role, otp });
        
        console.log('✅ OTP login successful:', response);
        
        // Show success state
        setSuccess(true);
        
        // Navigate after a brief moment to show success
        setTimeout(() => {
          const destination = `/dashboard/${response.user.role}`;
          console.log('🚀 Navigating to:', destination);
          navigate(destination, { replace: true });
        }, 600);
        
      } catch (err) {
        console.error('❌ OTP login failed:', err);
        setIsLoading(false);
        const errorMessage = err.message || 'Invalid OTP. Please try again.';
        setError(errorMessage);
      }
      return;
    }

    // Password login
    if (!password.trim()) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login:', { email, role });
      
      const response = await login({ email: email.trim(), password, role });
      
      console.log('✅ Login successful:', response);
      
      // Show success state
      setSuccess(true);
      
      // Navigate after a brief moment to show success
      setTimeout(() => {
        const destination = `/dashboard/${response.user.role}`;
        console.log('🚀 Navigating to:', destination);
        navigate(destination, { replace: true });
      }, 600);
      
    } catch (err) {
      console.error('❌ Login failed:', err);
      setIsLoading(false);
      
      // Check if error indicates OTP is required
      if (err.data?.requiresOTP || err.message?.includes('OTP')) {
        setRequiresOTP(true);
        setError('Password not set for this account. Please use OTP login.');
        // Automatically send OTP
        handleSendOTP();
      } else {
        const errorMessage = err.message || 'Invalid credentials. Please try again.';
        setError(errorMessage);
      }
    }
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    setEmail('fe@fe.com');
    setPassword('123');
    setRole('founder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Branding & Info */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 sm:p-10 lg:p-12 text-white hidden lg:flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Trusted by 500+ founders
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Welcome back to<br /><span className="font-bold text-[#8b5cf6]">Launch & Lift</span>
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Your mission control for fundraising success. Track your raise, connect with investors, and access expert support—all in one place.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Investor Matching</h3>
                <p className="text-sm text-white/80">Connect with investors perfectly aligned to your stage and sector</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Expert Guidance</h3>
                <p className="text-sm text-white/80">Access pitch deck prep, financial modeling, and legal support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
              <p className="text-sm sm:text-base text-gray-600">Access your <span className="font-semibold text-[#8b5cf6]">Launch & Lift</span> dashboard</p>
            </div>

            {/* Demo Credentials Banner */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">🎯 Quick Demo</p>
                  <p className="text-xs text-blue-700">fe@fe.com • Password: 123</p>
                </div>
                <button
                  onClick={fillDemoCredentials}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 underline"
                  type="button"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 mb-1">Login Failed</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-900">Login successful! Redirecting...</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 sm:py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  autoComplete="email"
                />
              </div>

              {/* OTP Input (shown when OTP is required or sent) */}
              {(requiresOTP || otpSent) ? (
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="space-y-3">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 sm:py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                      disabled={isLoading || success}
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isSendingOTP || isLoading || success}
                        className="w-full py-2.5 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSendingOTP ? 'Sending...' : 'Send verification code'}
                      </button>
                    )}
                    {otpSent && (
                      <p className="text-xs text-gray-600 text-center">
                        Verification code sent to {email}. Check your inbox.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setRequiresOTP(false);
                        setOtpSent(false);
                        setOtp('');
                        setError('');
                      }}
                      className="w-full py-2 text-sm text-gray-600 hover:text-gray-700 underline"
                    >
                      Use password instead
                    </button>
                  </div>
                </div>
              ) : (
                /* Password Input */
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 sm:py-3.5 pr-12 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      disabled={isLoading || success}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading || success}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sign in as
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  disabled={isLoading || success}
                >
                  <option value="founder">Founder</option>
                  <option value="investor">Investor</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Admin access? <Link to="/admin/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Use admin portal</Link>
                </p>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    disabled={isLoading || success}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  disabled={isLoading || success}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3.5 sm:py-4 px-6 min-h-[44px] text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Links */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-3">
                Don't have an account?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/signup/email?role=founder"
                  className="flex-1 py-3 px-4 min-h-[44px] flex items-center justify-center bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-medium rounded-xl transition-all text-center text-sm sm:text-base"
                >
                  Join as Founder
                </Link>
                <Link
                  to="/signup/email?role=investor"
                  className="flex-1 py-3 px-4 min-h-[44px] flex items-center justify-center bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-medium rounded-xl transition-all text-center text-sm sm:text-base"
                >
                  Join as Investor
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
