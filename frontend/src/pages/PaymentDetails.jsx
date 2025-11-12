import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { paymentApi } from '../services/api.js';
import { useAuth } from '../context/useAuth.js';

const PaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState(4999); // Default amount in INR
  const [loading, setLoading] = useState(true);
  const [hasCustomAmount, setHasCustomAmount] = useState(false);

  // Get email from location state, sessionStorage, or auth context
  const getEmail = () => {
    if (location.state?.email) {
      sessionStorage.setItem('signup.email', location.state.email);
      return location.state.email;
    }
    if (sessionStorage.getItem('signup.email')) return sessionStorage.getItem('signup.email');
    if (user?.email) {
      sessionStorage.setItem('signup.email', user.email);
      return user.email;
    }
    return null;
  };

  useEffect(() => {
    const fetchAmount = async () => {
      const email = getEmail();
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const response = await paymentApi.getPaymentAmount(email);
        setAmount(response.amount);
        setHasCustomAmount(response.hasCustomAmount);
      } catch (error) {
        console.error('Error fetching payment amount:', error);
        // Keep default amount on error
      } finally {
        setLoading(false);
      }
    };

    fetchAmount();
  }, []);

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-lilac/40 py-20">
      <div className="mx-auto max-w-3xl rounded-3xl border border-night/10 bg-white/95 p-10 shadow-2xl backdrop-blur">
        <header className="space-y-3 text-night">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-night/60">
            Founder onboarding
          </p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">Payment details</h1>
          <p className="text-sm text-night/70">
            Thanks for sharing your company story. To secure your onboarding slot we require a
            one-time platform activation fee. You can review the summary below and continue to the
            checkout to finalize payment.
          </p>
        </header>

        <section className="mt-10 space-y-6">
          <div className="rounded-2xl border border-night/10 bg-night/5 p-6">
            <h2 className="text-lg font-semibold text-night">What happens next</h2>
            <ul className="mt-4 space-y-3 text-sm text-night/70">
              <li>
                - We will review your submission and confirm onboarding availability within one
                business day.
              </li>
              <li>
                - Your payment receipt unlocks access to Launch&amp;Lift Mission Control and the founder
                success pod.
              </li>
              <li>
                - You will receive a calendar invite for the onboarding workshop immediately after the
                payment clears.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-night/10 bg-white p-6 shadow-inner">
            <h3 className="text-base font-semibold text-night">Activation fee</h3>
            {loading ? (
              <p className="mt-2 text-3xl font-semibold text-night">Loading...</p>
            ) : (
              <>
                <p className="mt-2 text-3xl font-semibold text-night">{formatAmount(amount)}</p>
                {hasCustomAmount && (
                  <p className="mt-1 text-xs text-purple-600">
                    Custom amount configured for your account
                  </p>
                )}
              </>
            )}
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-night/50">
              Includes dedicated partner pods &amp; investor readiness playbook
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-night/70">
              <p>
                The activation fee covers diligence preparation, operator guild access, and the first
                month of platform services. Future success fees are milestone-based and will be
                aligned during onboarding.
              </p>
              <p>
                Need an invoice or have questions about pricing? Email us at{' '}
                <a className="font-medium text-night underline" href="mailto:pricing@launchandlift.com">
                  pricing@launchandlift.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-4 border-t border-night/10 pt-6 text-sm text-night/70 md:flex-row md:items-center md:justify-between">
          <p>When you continue, you will be redirected to our secure checkout page.</p>
          <Button 
            className="px-8" 
            disabled={loading}
            onClick={() => {
              const email = getEmail();
              if (email) {
                sessionStorage.setItem('signup.email', email);
                navigate('/checkout', { state: { email } });
              } else {
                navigate('/checkout');
              }
            }}
          >
            Continue to checkout
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentDetails;
