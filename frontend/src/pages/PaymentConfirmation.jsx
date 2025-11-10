import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { CheckCircle2, Download, Mail, Home } from 'lucide-react';
import { paymentApi } from '../services/api.js';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/useAuth.js';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useNotification();
  const { user } = useAuth();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponEnabled, setCouponEnabled] = useState(true);

  const orderId = location.state?.orderId;
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!orderId) {
        showError('Payment order ID not found');
        navigate('/');
        return;
      }

      try {
        const [paymentResponse, couponSettingsResponse] = await Promise.all([
          paymentApi.getPaymentStatus(orderId),
          paymentApi.getCouponSettings().catch(() => ({ couponEnabled: true })), // Default to enabled if fetch fails
        ]);
        setPayment(paymentResponse.payment);
        setCouponEnabled(couponSettingsResponse.couponEnabled !== false); // Default to enabled
      } catch (error) {
        console.error('Error fetching payment details:', error);
        showError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

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

  if (!payment) {
    return (
      <div className="bg-gradient-to-br from-slate-100 via-white to-lilac/40 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-night/10 bg-white/95 p-10 shadow-2xl backdrop-blur text-center">
          <h1 className="text-2xl font-semibold text-night mb-4">Payment Not Found</h1>
          <p className="text-night/70 mb-6">Unable to retrieve payment details.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
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
              <span>Your payment receipt unlocks access to Launch&Lift Mission Control and the founder success pod.</span>
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
            onClick={() => navigate('/dashboard/founder')}
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

