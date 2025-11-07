import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { showGenericSuccess } from '../lib/emailClientMock.js';
import { useAuth } from '../context/useAuth.js';

const defaultForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  linkedinUrl: '',
  location: '',
  notes: '',
};

const InvestorSignup = () => {
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const [form, setForm] = useState(defaultForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          role: 'investor',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      establishSession({
        user: data.user,
      });

      showGenericSuccess('Investor account created successfully!');
      navigate('/dashboard/investor', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-lilac via-honey to-blossom px-4 py-20 text-night">
      <Motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl space-y-8 overflow-hidden rounded-[2.75rem] border border-white/70 bg-white/85 p-12 shadow-[0_45px_140px_-30px_rgba(91,33,209,0.45)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute -left-14 top-20 h-72 w-72 rounded-full bg-white/70 blur-[150px]" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-honey/85 blur-[170px]" />
        <div className="relative space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-night/60">Investor Signup</p>
          <h1 className="font-display text-3xl font-semibold text-night md:text-4xl">Join Launch &amp; Lift</h1>
          <p className="text-sm text-night/70">
            Create your investor account to connect with promising startups.
          </p>
        </div>

        {error && (
          <div className="relative rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="relative grid gap-6 md:grid-cols-2">
          <Field label="Full Name">
            <Input
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              placeholder="John Doe"
              required
            />
          </Field>
          <Field label="Email Address">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="john@example.com"
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>
          <Field label="Phone Number">
            <Input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
          </Field>
          <Field label="LinkedIn Profile URL">
            <Input
              type="url"
              value={form.linkedinUrl}
              onChange={(event) => updateField('linkedinUrl', event.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
              required
            />
          </Field>
          <Field label="Current City">
            <Input
              value={form.location}
              onChange={(event) => updateField('location', event.target.value)}
              placeholder="San Francisco, CA"
              required
            />
          </Field>
        </div>

        <Field label="Message (Optional)">
          <Textarea
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Tell us a bit about yourself and your investment interests..."
            rows={4}
          />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Investor Account'}
          </Button>
        </div>
      </Motion.form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <Label className="text-xs font-semibold uppercase tracking-[0.25em] text-night/50">{label}</Label>
    {children}
  </div>
);

export default InvestorSignup;
