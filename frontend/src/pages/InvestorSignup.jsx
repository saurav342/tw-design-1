import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, AlertCircle, Sparkles, TrendingUp, Users } from 'lucide-react';

const InvestorSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    linkedinUrl: '',
    location: '',
    notes: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    setIsLoading(true);

    // Validation
    const { fullName, email, password, phone, linkedinUrl, location } = formData;
    
    if (!fullName.trim() || !email.trim() || !password.trim() || !phone.trim() || !linkedinUrl.trim() || !location.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🚀 Creating investor account...');
      
      const payload = {
        ...formData,
        role: 'investor',
      };
      
      const response = await signup(payload);
      
      console.log('✅ Signup successful:', response);
      
      // Show success state
      setSuccess(true);
      
      // Navigate after a brief moment
      setTimeout(() => {
        navigate('/dashboard/investor', { replace: true });
      }, 800);
      
    } catch (err) {
      console.error('❌ Signup failed:', err);
      setIsLoading(false);
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Branding & Benefits */}
        <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-12 text-white hidden lg:flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Exclusive Investor Access
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Join the LaunchAndLift<br />Investor Network
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Get early access to vetted, high-potential startups and comprehensive diligence materials curated by our expert team.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">Curated Deal Flow</h3>
                <p className="text-sm text-white/80">Access pre-screened startups with detailed performance metrics and growth potential analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">Exclusive Community</h3>
                <p className="text-sm text-white/80">Connect with fellow investors, co-invest, and share insights in our private network</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">Diligence Support</h3>
                <p className="text-sm text-white/80">Leverage our research team's deep-dive reports and benchmark comparisons</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Investor Account</h2>
              <p className="text-gray-600">Join our network of sophisticated investors</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 mb-1">Signup Failed</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-900">Account created! Redirecting to your dashboard...</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@investmentfirm.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={isLoading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading || success}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  required
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn Profile *
                </label>
                <input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/johndoe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Current City *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading || success}
                  required
                />
              </div>

              {/* Notes (Optional) */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                  About You (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell us about your investment interests, focus areas, or anything else you'd like to share..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  disabled={isLoading || success}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <span>Create Investor Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default InvestorSignup;
