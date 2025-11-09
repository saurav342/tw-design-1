import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react';
import { adminAuthApi } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    setIsLoading(true);

    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting admin login:', { email });
      
      // Use admin auth API directly
      const response = await adminAuthApi.login({ 
        email: email.trim(), 
        password 
      });
      
      console.log('✅ Admin login successful:', response);
      
      // Establish session using the auth context
      establishSession(response);
      
      // Show success state
      setSuccess(true);
      
      // Navigate to admin dashboard
      setTimeout(() => {
        const destination = '/dashboard/admin';
        console.log('🚀 Navigating to:', destination);
        navigate(destination, { replace: true });
      }, 600);
      
    } catch (err) {
      console.error('❌ Admin login failed:', err);
      setIsLoading(false);
      const errorMessage = err.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
    }
  };

  // Auto-fill demo credentials (if available)
  const fillDemoCredentials = () => {
    setEmail('admin@launchandlift.com');
    setPassword('LaunchAndLiftAdmin!23');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Branding & Info */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 sm:p-10 lg:p-12 text-white hidden lg:flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Admin Portal
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              LaunchAndLift<br />Administration
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Secure access to the LaunchAndLift admin dashboard. Manage users, content, and platform operations.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Access</h3>
                <p className="text-sm text-white/80">Administrative accounts are managed separately from public user accounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Platform Management</h3>
                <p className="text-sm text-white/80">Manage users, content, analytics, and system configuration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Sign In</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600">Access the LaunchAndLift administration portal</p>
            </div>

            {/* Demo Credentials Banner */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 mb-1">🔑 Admin Credentials</p>
                  <p className="text-xs text-amber-700">admin@launchandlift.com • Password: LaunchAndLiftAdmin!23</p>
                </div>
                <button
                  onClick={fillDemoCredentials}
                  className="text-xs font-medium text-amber-600 hover:text-amber-700 underline"
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
                  placeholder="admin@launchandlift.com"
                  className="w-full px-4 py-3 sm:py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  autoComplete="email"
                />
              </div>

              {/* Password Input */}
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
                    className="w-full px-4 py-3 sm:py-3.5 pr-12 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
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

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                    disabled={isLoading || success}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  disabled={isLoading || success}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3.5 sm:py-4 px-6 min-h-[44px] text-base bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
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
                    <span>Sign in to Admin Portal</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Public Login */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-3">
                Looking for investor or founder access?
              </p>
              <Link
                to="/login"
                className="block w-full py-3 px-4 min-h-[44px] flex items-center justify-center bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium rounded-xl transition-all text-center text-sm sm:text-base"
              >
                Go to Public Login
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;

