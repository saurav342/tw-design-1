import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { CheckCircle2, Download, Mail, Home, AlertCircle } from 'lucide-react';
import { paymentApi } from '../services/api.js';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/useAuth.js';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showError, showInfo } = useNotification();
  const { user } = useAuth();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponEnabled, setCouponEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Get orderId from multiple sources: location.state, URL params, or sessionStorage
  const getOrderId = () => {
    // Priority 1: location.state (from navigation)
    if (location.state?.orderId) {
      // Store in sessionStorage for persistence
      sessionStorage.setItem('payment.orderId', location.state.orderId);
      if (location.state.paymentId) {
        sessionStorage.setItem('payment.paymentId', location.state.paymentId);
      }
      return location.state.orderId;
    }
    
    // Priority 2: URL query parameter
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      sessionStorage.setItem('payment.orderId', urlOrderId);
      const urlPaymentId = searchParams.get('paymentId');
      if (urlPaymentId) {
        sessionStorage.setItem('payment.paymentId', urlPaymentId);
      }
      return urlOrderId;
    }
    
    // Priority 3: sessionStorage (fallback for page refresh)
    const storedOrderId = sessionStorage.getItem('payment.orderId');
    if (storedOrderId) {
      return storedOrderId;
    }
    
    return null;
  };

  const orderId = getOrderId();
  const paymentId = location.state?.paymentId || searchParams.get('paymentId') || sessionStorage.getItem('payment.paymentId');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!orderId) {
        const errorMsg = 'Payment order ID not found. Please contact support if you completed a payment.';
        setErrorMessage(errorMsg);
        showError(errorMsg);
        setLoading(false);
        return;
      }

      try {
        console.log('[PaymentConfirmation] Fetching payment details for orderId:', orderId);
        const [paymentResponse, couponSettingsResponse] = await Promise.all([
          paymentApi.getPaymentStatus(orderId),
          paymentApi.getCouponSettings().catch(() => ({ couponEnabled: true })), // Default to enabled if fetch fails
        ]);
        
        if (!paymentResponse || !paymentResponse.payment) {
          throw new Error('Payment record not found');
        }
        
        console.log('[PaymentConfirmation] Payment details loaded:', paymentResponse.payment);
        setPayment(paymentResponse.payment);
        setCouponEnabled(couponSettingsResponse.couponEnabled !== false); // Default to enabled
        setErrorMessage(null);
      } catch (error) {
        console.error('[PaymentConfirmation] Error fetching payment details:', error);
        const errorMsg = error.message || 'Failed to load payment details. Please try refreshing the page or contact support.';
        setErrorMessage(errorMsg);
        showError(errorMsg);
        
        // If it's a 404, the payment might not exist yet - show helpful message
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          setErrorMessage('Payment record not found. If you just completed payment, please wait a moment and refresh the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId, showError]);

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amt);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!payment && !loading) {
    return (
      <div className="bg-gradient-to-br from-slate-100 via-white to-lilac/40 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-night/10 bg-white/95 p-10 shadow-2xl backdrop-blur">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-night mb-4">Payment Details Not Found</h1>
            {errorMessage ? (
              <p className="text-night/70 mb-6">{errorMessage}</p>
            ) : (
              <p className="text-night/70 mb-6">Unable to retrieve payment details. This may happen if the page was refreshed or the payment is still processing.</p>
            )}
          </div>
          
          {orderId && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Order ID:</strong> {orderId}
              </p>
              <p className="text-xs text-blue-600">
                Please save this Order ID and contact support if you need assistance.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => {
                // Try to reload payment details
                setLoading(true);
                setErrorMessage(null);
                window.location.reload();
              }}
              variant="outline"
            >
              Refresh Page
            </Button>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
            {user && (
              <Button onClick={() => navigate(`/dashboard/${user.role}`)} variant="outline">
                Go to Dashboard
              </Button>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-night/10 text-center text-xs text-night/50">
            <p>
              Need help? Contact us at{' '}
              <a href="mailto:support@launchandlift.com" className="underline text-purple-600">
                support@launchandlift.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-lilac/40 py-20">
      <div className="mx-auto max-w-3xl rounded-3xl border border-night/10 bg-white/95 p-10 shadow-2xl backdrop-blur">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-night md:text-4xl mb-2">
            Payment Successful!
          </h1>
          <p className="text-sm text-night/70">
            Your payment has been processed successfully. A confirmation email has been sent to your registered email address.
          </p>
        </div>

        {/* Payment Details */}
        <div className="rounded-2xl border border-night/10 bg-night/5 p-6 mb-6">
          <h2 className="text-lg font-semibold text-night mb-4">Payment Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-night/70">Order ID</span>
              <span className="font-medium text-night">{payment.razorpayOrderId}</span>
            </div>
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-night/70">Payment ID</span>
                <span className="font-medium text-night">{paymentId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-night/70">Amount</span>
              <span className="font-medium text-night">{formatAmount(payment.amount)}</span>
            </div>
            {payment.couponCode && (
              <div className="flex justify-between">
                <span className="text-night/70">Discount Applied</span>
                <span className="font-medium text-green-600">-{formatAmount(payment.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-night/20">
              <span className="font-semibold text-night">Total Paid</span>
              <span className="font-semibold text-night text-lg">{formatAmount(payment.finalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-night/70">Date</span>
              <span className="font-medium text-night">{formatDate(payment.updatedAt || payment.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-night/70">Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {payment.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Coupon Section - Show if coupon was used */}
        {couponEnabled && payment.couponCode && (
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-semibold text-purple-900">Coupon Applied</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Coupon Code</span>
                <span className="font-semibold text-purple-900">{payment.couponCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Discount Amount</span>
                <span className="font-semibold text-purple-900">{formatAmount(payment.discountAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="rounded-2xl border border-night/10 bg-white p-6 mb-6">
          <h2 className="text-lg font-semibold text-night mb-4">What's Next?</h2>
          <ul className="space-y-3 text-sm text-night/70">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>We will review your submission and confirm onboarding availability within one business day.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Your payment receipt unlocks access to <span className="font-semibold text-[#8b5cf6]">Launch & Lift</span> Mission Control and the founder success pod.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>You will receive a calendar invite for the onboarding workshop immediately after the payment clears.</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (user && user.role === 'founder') {
                navigate('/dashboard/founder');
              } else {
                // If not authenticated, redirect to login with return path
                showInfo('Please log in to access your dashboard');
                navigate('/login', { state: { from: '/dashboard/founder' } });
              }
            }}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would send an email
                alert('Receipt email sent to your registered email address');
              }}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Receipt
            </Button>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 pt-6 border-t border-night/10 text-center text-xs text-night/50">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@launchandlift.com" className="underline text-purple-600">
              support@launchandlift.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;

