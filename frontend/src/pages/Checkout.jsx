import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { CheckCircle2, Loader2, Tag } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { paymentApi } from '../services/api.js';
import { useAuth } from '../context/useAuth.js';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showInfo, showError } = useNotification();
  const { user } = useAuth();
  const [amount, setAmount] = useState(4999);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(4999);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponEnabled, setCouponEnabled] = useState(true);

  // Get email from location state, sessionStorage, or auth context
  const getEmail = () => {
    if (location.state?.email) return location.state.email;
    if (sessionStorage.getItem('signup.email')) return sessionStorage.getItem('signup.email');
    if (user?.email) return user.email;
    return null;
  };

  useEffect(() => {
    const initializeCheckout = async () => {
      const email = getEmail();
      if (!email) {
        showInfo('Please complete signup first');
        navigate('/signup/founder');
        return;
      }

      try {
        // Fetch payment amount and coupon settings
        const [amountResponse, couponSettingsResponse] = await Promise.all([
          paymentApi.getPaymentAmount(email),
          paymentApi.getCouponSettings().catch(() => ({ couponEnabled: true })), // Default to enabled if fetch fails
        ]);
        setAmount(amountResponse.amount);
        setFinalAmount(amountResponse.amount);
        setCouponEnabled(couponSettingsResponse.couponEnabled !== false); // Default to enabled
      } catch (error) {
        console.error('Error initializing checkout:', error);
        showError('Failed to load payment details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amt);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showInfo('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    try {
      const response = await paymentApi.validateCoupon({
        code: couponCode.trim(),
        amount: amount,
      });

      if (response.valid) {
        setAppliedCoupon(response.coupon);
        setDiscountAmount(response.discountAmount);
        setFinalAmount(response.finalAmount);
        showSuccess(`Coupon "${response.coupon.code}" applied successfully!`);
      }
    } catch (error) {
      showError(error.message || 'Invalid or expired coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setFinalAmount(amount);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setFinalAmount(amount);
    setCouponCode('');
    showInfo('Coupon removed');
  };

  const handlePayment = async () => {
    const email = getEmail();
    if (!email) {
      showError('Email not found. Please complete signup first.');
      return;
    }

    setProcessing(true);
    try {
      // Load Razorpay
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        showError('Failed to load payment gateway. Please try again.');
        setProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await paymentApi.createOrder({
        amount: amount,
        email: email,
        couponCode: appliedCoupon?.code || null,
      });

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Launch & Lift',
        description: 'Founder Onboarding Activation Fee',
        order_id: orderResponse.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.payment) {
              showSuccess('Payment successful!');
              // Redirect to payment confirmation page
              navigate('/payment-confirmation', {
                state: {
                  payment: verifyResponse.payment,
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                },
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showError('Payment verification failed. Please contact support.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          email: email,
          name: user?.fullName || '',
        },
        theme: {
          color: '#5B21D1',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      showError(error.message || 'Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-lilac/40 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-night md:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-night/70">
            Secure payment processing - Your information is encrypted and secure
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-night/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
              <h2 className="mb-6 text-lg font-semibold text-night">Payment Details</h2>

              {/* Coupon Section */}
              {couponEnabled && (
                <div className="mb-6 rounded-2xl border border-night/10 bg-night/5 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-semibold text-night">Apply Coupon</h3>
                  </div>
                  
                  {!appliedCoupon ? (
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon();
                          }
                        }}
                        disabled={validatingCoupon || processing}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || processing || !couponCode.trim()}
                        variant="outline"
                      >
                        {validatingCoupon ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            {appliedCoupon.code} Applied
                          </p>
                          <p className="text-xs text-green-600">
                            {appliedCoupon.discountType === 'percentage'
                              ? `${appliedCoupon.discountValue}% off`
                              : `${formatAmount(appliedCoupon.discountValue)} off`}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleRemoveCoupon}
                        variant="ghost"
                        size="sm"
                        disabled={processing}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full px-8 py-6 text-base"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatAmount(finalAmount)}`
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-night/50">
                By clicking "Pay", you agree to our terms of service and privacy policy.
                Payments are processed securely through Razorpay.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-8 rounded-3xl border border-night/10 bg-white/95 p-6 shadow-xl backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-night">Order Summary</h2>
              
              <div className="space-y-4 border-b border-night/10 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-night/70">Activation Fee</span>
                  <span className="font-medium text-night">{formatAmount(amount)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-night/70">Discount</span>
                    <span className="font-medium text-green-600">-{formatAmount(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-night/70">Tax</span>
                  <span className="font-medium text-night">₹0.00</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-lg font-semibold text-night">
                <span>Total</span>
                <span>{formatAmount(finalAmount)}</span>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-night/10 bg-night/5 p-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                  <span className="text-night/70">
                    Includes dedicated partner pods & investor readiness playbook
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                  <span className="text-night/70">
                    Access to Launch&Lift Mission Control
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                  <span className="text-night/70">
                    Onboarding workshop invitation
                  </span>
                </div>
              </div>

              <div className="mt-6 text-xs text-night/50">
                <p>
                  Need help? Contact us at{' '}
                  <a href="mailto:support@launchandlift.com" className="underline">
                    support@launchandlift.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
