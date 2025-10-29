import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { showGenericSuccess } from '../lib/emailClientMock.js';
import { useAppStore } from '../store/useAppStore.js';
import { useAuth } from '../context/useAuth.js';

const defaultForm = {
  fundName: '',
  contactName: '',
  email: '',
  thesis: '',
  stageFocus: ['Seed'],
  sectorFocus: [],
  geoFocus: [],
  ticketRangeLabel: '',
  ticketMinUSD: 250_000,
  ticketMaxUSD: 1_000_000,
  website: '',
};

const InvestorSignup = () => {
  const navigate = useNavigate();
  const { establishSession } = useAuth();
  const addInvestor = useAppStore((state) => state.addInvestor);
  const [form, setForm] = useState(defaultForm);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMulti = (key, value) => {
    updateField(
      key,
      value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
    );
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const investor = addInvestor(form);
    establishSession({
      user: {
        id: investor.id,
        role: 'investor',
        email: investor.email,
        fullName: investor.contactName,
      },
    });
    showGenericSuccess('Investor profile submitted (mock)');
    navigate('/dashboard/investor', { replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-[#FFF6D7] via-[#FFE6A8] to-[#FF985F] px-4 py-16 text-midnight">
      <Motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl space-y-8 rounded-[2.5rem] border border-white/60 bg-white/80 p-10 shadow-[0_35px_120px_-25px_rgba(255,152,95,0.6)] backdrop-blur-xl"
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-midnight/60">Investor intake</p>
          <h1 className="font-display text-3xl font-semibold text-midnight md:text-4xl">Signal your deployment focus</h1>
          <p className="text-sm text-midnight/70">
            Share your investment parameters so Launch &amp; Lift can surface qualified founders.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Fund Name">
            <Input
              value={form.fundName}
              onChange={(event) => updateField('fundName', event.target.value)}
              placeholder='Orbital Ventures'
              required
            />
          </Field>
          <Field label="Partner Name">
            <Input
              value={form.contactName}
              onChange={(event) => updateField('contactName', event.target.value)}
              placeholder="Leah Chen"
              required
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="leah@orbital.vc"
              required
            />
          </Field>
          <Field label="Website">
            <Input
              value={form.website}
              onChange={(event) => updateField('website', event.target.value)}
              placeholder="https://orbital.vc"
            />
          </Field>
          <Field label="Stage Focus (comma separated)">
            <Input
              value={form.stageFocus.join(', ')}
              onChange={(event) => handleMulti('stageFocus', event.target.value)}
              placeholder="Seed, Series A"
            />
          </Field>
          <Field label="Sector Focus">
            <Input
              value={form.sectorFocus.join(', ')}
              onChange={(event) => handleMulti('sectorFocus', event.target.value)}
              placeholder="AI Infrastructure, Logistics"
            />
          </Field>
          <Field label="Geography">
            <Input
              value={form.geoFocus.join(', ')}
              onChange={(event) => handleMulti('geoFocus', event.target.value)}
              placeholder="North America, Europe"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ticket Min (USD)">
              <Input
                type="number"
                value={form.ticketMinUSD}
                onChange={(event) => updateField('ticketMinUSD', Number(event.target.value) || 0)}
              />
            </Field>
            <Field label="Ticket Max (USD)">
              <Input
                type="number"
                value={form.ticketMaxUSD}
                onChange={(event) => updateField('ticketMaxUSD', Number(event.target.value) || 0)}
              />
            </Field>
          </div>
          <Field label="Ticket Range Label">
            <Input
              value={form.ticketRangeLabel}
              onChange={(event) => updateField('ticketRangeLabel', event.target.value)}
              placeholder="$500K - $1.5M"
            />
          </Field>
        </div>

        <Field label="Investment Thesis">
          <Textarea
            value={form.thesis}
            onChange={(event) => updateField('thesis', event.target.value)}
            placeholder="Backing B2B infrastructure and AI automation that compress deployment cycles."
            rows={4}
            required
          />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            Submit &amp; View Matching Dashboard
          </Button>
        </div>
      </Motion.form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <Label className="text-xs font-semibold uppercase tracking-[0.25em] text-midnight/50">{label}</Label>
    {children}
  </div>
);

export default InvestorSignup;
