import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, Edit3, Rocket } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { useActiveFounder } from '../hooks/useActiveFounder.js';
import { useFounderExtras } from '../hooks/useFounderExtras.js';
import { formatCurrencyInr, formatDateDisplay } from '../lib/formatters.js';
import { toNumberOrNull } from '../lib/utils.js';
import { showInfo, showSuccess } from '../lib/notifications.js';

const createFormState = (listing, founder) => ({
  startupName: founder?.startupName ?? '',
  raiseAmount: listing?.raiseAmount ? String(listing.raiseAmount) : '',
  minTicket: listing?.minTicket ? String(listing.minTicket) : '',
  industry: listing?.industry ?? founder?.sector ?? '',
  useOfFunds:
    listing?.useOfFunds ??
    `Team expansion in ${founder?.sector ?? 'core functions'}, GTM amplification, and product polish.`,
});

const FounderMarketplace = () => {
  const navigate = useNavigate();
  const { activeFounder, founderId } = useActiveFounder();
  const { extras, setMarketplaceListing } = useFounderExtras(founderId);

  const [form, setForm] = useState(() => createFormState(extras.marketplaceListing, activeFounder));
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(createFormState(extras.marketplaceListing, activeFounder));
    setIsDirty(false);
  }, [extras, activeFounder]);

  const hasListing = Boolean(extras.marketplaceListing);
  const statusLabel = hasListing ? 'Live' : 'Draft';
  const statusTone = hasListing ? 'bg-emerald-500/15 text-emerald-600' : 'bg-night/5 text-night/60';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const formattedPreview = useMemo(() => {
    const raise = toNumberOrNull(form.raiseAmount);
    const minTicket = toNumberOrNull(form.minTicket);
    return {
      startupName: form.startupName || activeFounder?.startupName || 'Your startup',
      raiseAmount: raise != null ? formatCurrencyInr(raise) : '—',
      minTicket: minTicket != null ? formatCurrencyInr(minTicket) : '—',
      industry: form.industry || 'Not set',
      useOfFunds: form.useOfFunds,
    };
  }, [form, activeFounder]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const listing = {
      id: extras.marketplaceListing?.id ?? `marketplace-${Date.now()}`,
      raiseAmount: toNumberOrNull(form.raiseAmount) ?? 0,
      minTicket: toNumberOrNull(form.minTicket) ?? 0,
      startupName: form.startupName.trim() || activeFounder?.startupName || null,
      useOfFunds: form.useOfFunds.trim(),
      industry: form.industry.trim(),
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };

    try {
      await setMarketplaceListing(listing);
      showSuccess('Marketplace listing saved');
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save marketplace listing', error);
      showInfo('We could not update your listing. Please try again in a moment.');
    }
  };

  return (
    <section className="relative overflow-hidden pb-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white/85 to-lilac/30" />
      <div className="absolute -left-32 top-[-140px] h-[420px] w-[420px] rounded-full bg-royal/15 blur-[200px]" />
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <Button
              variant="ghost"
              className="mb-6 inline-flex items-center gap-2 text-sm text-night/70 hover:bg-night/5"
              onClick={() => navigate('/dashboard/founder')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-1 text-xs uppercase tracking-[0.2em] text-night/60 shadow-sm shadow-white/70">
              <Rocket className="h-4 w-4 text-royal" />
              Marketplace
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-night">
              Showcase {activeFounder?.startupName ?? 'your startup'} to Launch &amp; Lift investors
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-night/65">
              Present a crisp snapshot of your round. We use this information to promote your raise
              to our curated investor network.
            </p>
          </div>
          <Badge className={`h-9 rounded-full px-4 text-xs ${statusTone}`}>{statusLabel}</Badge>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]"
        >
          <Card className="border-white/70 bg-white/95 text-night shadow-[0_32px_110px_-60px_rgba(91,33,209,0.35)]">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-night">Listing details</CardTitle>
              <p className="text-sm text-night/65">
                Save updates anytime — the status becomes live once you publish from here.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="startupName">
                    Startup name
                  </Label>
                  <Input
                    id="startupName"
                    name="startupName"
                    value={form.startupName}
                    onChange={handleChange}
                    placeholder="OrbitStack"
                    className="h-11"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <Label className="text-night/70" htmlFor="raiseAmount">
                      Raise amount (₹)
                    </Label>
                    <Input
                      id="raiseAmount"
                      name="raiseAmount"
                      type="number"
                      min="0"
                      required
                      value={form.raiseAmount}
                      onChange={handleChange}
                      placeholder="25000000"
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-night/70" htmlFor="minTicket">
                      Minimum ticket size (₹)
                    </Label>
                    <Input
                      id="minTicket"
                      name="minTicket"
                      type="number"
                      min="0"
                      required
                      value={form.minTicket}
                      onChange={handleChange}
                      placeholder="500000"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="industry">
                    Industry / category
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    required
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="SaaS / GTM enablement"
                    className="h-11"
                  />
                </div>

                <div className="grid gap-3">
                  <Label className="text-night/70" htmlFor="useOfFunds">
                    Use of funds
                  </Label>
                  <Textarea
                    id="useOfFunds"
                    name="useOfFunds"
                    required
                    value={form.useOfFunds}
                    onChange={handleChange}
                    className="min-h-[150px]"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="hover:bg-night/5"
                    onClick={() => navigate('/dashboard/founder')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isDirty} className="sm:min-w-[180px]">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Save listing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <aside className="space-y-6">
            <Card className="border-white/70 bg-white/95 text-night shadow-[0_32px_110px_-60px_rgba(91,33,209,0.35)]">
              <CardHeader>
                <CardTitle className="text-lg text-night">Investor preview</CardTitle>
              </CardHeader>
            <CardContent className="space-y-5 text-sm text-night/70">
              <div>
                <p className="text-night/50">Startup</p>
                <p className="mt-1 text-base font-semibold text-night">
                  {formattedPreview.startupName}
                </p>
              </div>
              <div>
                <p className="text-night/50">Raise amount</p>
                <p className="mt-1 text-base font-semibold text-night">
                  {formattedPreview.raiseAmount}
                </p>
                </div>
                <div>
                  <p className="text-night/50">Minimum ticket</p>
                  <p className="mt-1 text-base font-semibold text-night">
                    {formattedPreview.minTicket}
                  </p>
                </div>
                <div>
                  <p className="text-night/50">Industry focus</p>
                  <p className="mt-1">{formattedPreview.industry}</p>
                </div>
                <div>
                  <p className="text-night/50">Use of funds</p>
                  <p className="mt-1 leading-6 text-night/70">{formattedPreview.useOfFunds}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-white/90 text-night shadow-[0_26px_90px_-60px_rgba(91,33,209,0.28)]">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base text-night">Listing timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-night/55">
                <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <CalendarDays className="h-4 w-4 text-royal" />
                  <div>
                    <p className="font-semibold text-night">Last updated</p>
                    <p>{formatDateDisplay(extras.marketplaceListing?.lastUpdated)}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm shadow-white/70">
                  <p className="font-semibold text-night">What happens next?</p>
                  <p className="mt-1">
                    Once you publish, the Launch &amp; Lift team reviews within 24 hours before
                    distributing to investors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </Motion.div>
      </div>
    </section>
  );
};

export default FounderMarketplace;
