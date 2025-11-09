import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });

  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    // Format expiry date as MM/YY
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) value = value.slice(0, 5);
    }
    
    // Limit CVV to 3-4 digits
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      showInfo('Please enter a valid card number');
      return;
    }
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      showInfo('Please enter a valid expiry date');
      return;
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      showInfo('Please enter a valid CVV');
      return;
    }
    if (!formData.cardholderName) {
      showInfo('Please enter the cardholder name');
      return;
    }
    if (!formData.email) {
      showInfo('Please enter your email address');
      return;
    }

    setIsProcessing(true);
    showSuccess('Processing payment...');

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      showSuccess('Payment successful! Redirecting to login...');
      
      // Redirect to login after successful payment
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    }, 2000);
  };

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
              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-night/60">
                <Lock className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={formData.cardholderName}
                      onChange={handleInputChange('cardholderName')}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-night/40" />
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange('cardNumber')}
                        className="pl-10"
                        maxLength={19}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange('expiryDate')}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={formData.cvv}
                        onChange={handleInputChange('cvv')}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email for receipt</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-8 py-6 text-base"
                >
                  {isProcessing ? 'Processing...' : `Pay $799`}
                </Button>

                <p className="text-center text-xs text-night/50">
                  By clicking "Pay", you agree to our terms of service and privacy policy.
                  This is a mock payment flow for demonstration purposes.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-8 rounded-3xl border border-night/10 bg-white/95 p-6 shadow-xl backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-night">Order Summary</h2>
              
              <div className="space-y-4 border-b border-night/10 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-night/70">Activation Fee</span>
                  <span className="font-medium text-night">$799</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-night/70">Tax</span>
                  <span className="font-medium text-night">$0.00</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-lg font-semibold text-night">
                <span>Total</span>
                <span>$799.00</span>
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

