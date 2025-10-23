import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    id: 'personal',
    label: 'Personal details',
    description: 'Tell us about yourself',
  },
  {
    id: 'startup',
    label: 'Startup details',
    description: 'Share your company story',
  },
];

const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const referrerOptions = [
  'LaunchAndLift Operator',
  'Founder referral',
  'Investor referral',
  'Event or webinar',
  'Press / Media',
  'Other',
];

const sectorOptions = [
  'Climate & Sustainability',
  'HealthTech',
  'Enterprise SaaS',
  'FinTech',
  'Applied AI / ML',
  'Mobility & Logistics',
  'Consumer & Community',
  'DeepTech',
];

const stageOptions = ['Ideation', 'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Growth / Pre-IPO'];

const companyTypes = ['Private Limited', 'LLP', 'Public Limited', 'B-Corp / Non-profit', 'Stealth / Other'];

const revenueOptions = ['Pre-revenue', '< ₹5L / month', '₹5L – ₹25L / month', '₹25L – ₹1Cr / month', '> ₹1Cr / month'];

const valuationOptions = ['< ₹10 Cr', '₹10 Cr – ₹30 Cr', '₹30 Cr – ₹80 Cr', '₹80 Cr – ₹150 Cr', '> ₹150 Cr'];

const raiseOptions = ['₹1 Cr – ₹3 Cr', '₹3 Cr – ₹7 Cr', '₹7 Cr – ₹15 Cr', '₹15 Cr – ₹30 Cr', '> ₹30 Cr'];

const fileToPayload = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        data: reader.result,
      });
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });

const formatMonth = (value) => {
  if (!value) return '—';
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' }).format(date);
};

const FounderSignup = () => {
  const navigate = useNavigate();
  const { signup, loading, error, setError, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [stepError, setStepError] = useState('');
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
    otp: '',
    phoneVerified: false,
    linkedinUrl: '',
    referrer: '',
    singleFounder: true,
    coFounder: {
      name: '',
      email: '',
      linkedinUrl: '',
      gender: '',
    },
    startupDetails: {
      brandName: '',
      legalName: '',
      websiteUrl: '',
      sector: '',
      sectorTags: [],
      stage: '',
      cityOfOperation: '',
      companyType: '',
      monthlyRevenue: '',
      preMoneyValuation: '',
      capitalToRaise: '',
      incorporationDate: '',
      description: '',
    },
  });
  const [pitchDeckFile, setPitchDeckFile] = useState(null);
  const [verificationFeedback, setVerificationFeedback] = useState('');

  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  useEffect(
    () => () => {
      setError(null);
    },
    [setError],
  );

  const selectedSectorTags = useMemo(() => new Set(formState.startupDetails.sectorTags), [formState.startupDetails.sectorTags]);

  const handleRootChange = (event) => {
    const { name, value } = event.target;

    if (name === 'singleFounder') {
      const isSingle = value === 'yes';
      setFormState((prev) => ({
        ...prev,
        singleFounder: isSingle,
        coFounder: isSingle
          ? { name: '', email: '', linkedinUrl: '', gender: '' }
          : prev.coFounder,
      }));
      return;
    }

    if (name === 'phone' || name === 'otp') {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
        phoneVerified: false,
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoFounderChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      coFounder: {
        ...prev.coFounder,
        [name]: value,
      },
    }));
  };

  const handleStartupChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      startupDetails: {
        ...prev.startupDetails,
        [name]: value,
      },
    }));
  };

  const toggleSectorTag = (tag) => {
    setFormState((prev) => {
      const current = new Set(prev.startupDetails.sectorTags);
      if (current.has(tag)) {
        current.delete(tag);
      } else {
        current.add(tag);
      }
      return {
        ...prev,
        startupDetails: {
          ...prev.startupDetails,
          sectorTags: Array.from(current),
        },
      };
    });
  };

  const handleVerifyPhone = () => {
    if (formState.phone && formState.otp.trim().length >= 4) {
      setFormState((prev) => ({ ...prev, phoneVerified: true }));
      setVerificationFeedback('Phone number marked as verified.');
    } else {
      setVerificationFeedback('Enter your phone and a 4-digit code before marking as verified.');
    }
  };

  const handlePitchDeckChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPitchDeckFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setVerificationFeedback('Pitch deck must be a PDF file.');
      event.target.value = '';
      return;
    }
    setVerificationFeedback('');
    setPitchDeckFile(file);
  };

  const validateStep = (step) => {
    const missing = [];

    if (step === 0) {
      if (!formState.fullName) missing.push('name');
      if (!formState.email) missing.push('work email');
      if (!formState.password) missing.push('password');
      if (!formState.gender) missing.push('gender');
      if (!formState.phone) missing.push('phone number');
      if (!formState.otp.trim()) missing.push('OTP');
      if (!formState.linkedinUrl) missing.push('LinkedIn URL');
      if (formState.singleFounder === undefined) missing.push('founder structure');
      if (!formState.phoneVerified) {
        setStepError('Please verify your phone number before continuing.');
        return false;
      }

      if (formState.singleFounder === false) {
        const { name, email, linkedinUrl, gender } = formState.coFounder;
        if (!name) missing.push('co-founder name');
        if (!email) missing.push('co-founder email');
        if (!linkedinUrl) missing.push('co-founder LinkedIn');
        if (!gender) missing.push('co-founder gender');
      }
    } else if (step === 1) {
      const {
        brandName,
        legalName,
        websiteUrl,
        sector,
        stage,
        cityOfOperation,
        companyType,
        incorporationDate,
        description,
      } = formState.startupDetails;

      if (!brandName) missing.push('brand name');
      if (!legalName) missing.push('legal name');
      if (!websiteUrl) missing.push('website');
      if (!sector) missing.push('sector');
      if (!stage) missing.push('stage');
      if (!cityOfOperation) missing.push('city of operation');
      if (!companyType) missing.push('company type');
      if (!incorporationDate) missing.push('incorporation date');
      if (!description) missing.push('company narrative');
      if (!pitchDeckFile) missing.push('pitch deck');
    }

    if (missing.length) {
      setStepError(`Please complete the following: ${missing.join(', ')}.`);
      return false;
    }

    setStepError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(1)) return;

    try {
      const payload = {
        fullName: formState.fullName,
        email: formState.email,
        password: formState.password,
        role: 'founder',
        gender: formState.gender,
        phone: formState.phone,
        phoneVerified: formState.phoneVerified,
        linkedinUrl: formState.linkedinUrl,
        referrer: formState.referrer || null,
        singleFounder: formState.singleFounder,
        coFounder: formState.singleFounder
          ? {}
          : {
              name: formState.coFounder.name,
              email: formState.coFounder.email,
              linkedinUrl: formState.coFounder.linkedinUrl,
              gender: formState.coFounder.gender,
            },
        startupDetails: {
          ...formState.startupDetails,
          pitchDeck: pitchDeckFile ? await fileToPayload(pitchDeckFile) : null,
        },
        organization: formState.startupDetails.brandName || null,
      };

      const response = await signup(payload);
      navigate(`/dashboard/${response.user.role}`, { replace: true });
    } catch (err) {
      console.error('Signup failed', err);
    }
  };

  return (
    <div className="bg-brand-muted/60 px-4 py-16">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-brand-muted/60">
        <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <aside className="flex flex-col justify-between bg-brand-dark p-10 text-white">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Start your fund raising journey</p>
                <h1 className="mt-4 text-3xl font-semibold">LaunchAndLift founder onboarding</h1>
                <p className="mt-3 text-sm text-white/70">
                  Complete the readiness intake so LaunchAndLift operators can review your company and align capital, talent, and
                  Mission Control resources.
                </p>
              </div>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const status =
                    index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming';
                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl border px-4 py-4 transition ${
                        status === 'current'
                          ? 'border-neon bg-white/10 shadow-lg shadow-neon/40'
                          : status === 'completed'
                            ? 'border-white/30 bg-white/5'
                            : 'border-white/10 bg-white/5 opacity-70'
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Step {index + 1}</p>
                      <p className="mt-2 text-lg font-semibold">{step.label}</p>
                      <p className="text-sm text-white/70">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-white/10 p-5 text-sm text-white/70">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Checklist</p>
              <ul className="space-y-2">
                <li>Pitch deck highlighting traction, roadmap, and capital ask.</li>
                <li>Monthly revenue, valuation range, and target raise.</li>
                <li>Co-founder and leadership details for operator alignment.</li>
              </ul>
            </div>
          </aside>

          <div className="bg-white p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {stepError && <div className="rounded-xl bg-burnt/10 px-4 py-3 text-sm text-burnt">{stepError}</div>}
              {verificationFeedback && (
                <div className="rounded-xl border border-lagoon/40 bg-lagoon/10 px-4 py-3 text-xs text-lagoon">
                  {verificationFeedback}
                </div>
              )}
              {error && <div className="rounded-xl bg-burnt/10 px-4 py-3 text-sm text-burnt">{error}</div>}

              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-semibold text-brand-dark">
                        Your name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={handleRootChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-brand-dark">
                        Work email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={handleRootChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-semibold text-brand-dark">
                        Set password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formState.password}
                        onChange={handleRootChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Create a secure password"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-sm font-semibold text-brand-dark">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formState.gender}
                        onChange={handleRootChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select gender</option>
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-brand-dark">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={handleRootChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="otp" className="text-sm font-semibold text-brand-dark">
                        Enter OTP
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="otp"
                          name="otp"
                          type="text"
                          maxLength={6}
                          value={formState.otp}
                          onChange={handleRootChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm tracking-[0.3em] text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                          placeholder="••••"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPhone}
                          className="whitespace-nowrap rounded-full border border-lagoon px-4 py-2 text-xs font-semibold uppercase tracking-wide text-lagoon transition hover:border-burnt hover:text-burnt"
                        >
                          Mark verified
                        </button>
                      </div>
                      {formState.phoneVerified && (
                        <p className="text-xs font-semibold text-emerald-600">Phone number verified successfully!</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="linkedinUrl" className="text-sm font-semibold text-brand-dark">
                      LinkedIn profile URL
                    </label>
                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      required
                      value={formState.linkedinUrl}
                      onChange={handleRootChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      placeholder="https://www.linkedin.com/in/you"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="referrer" className="text-sm font-semibold text-brand-dark">
                        Referrer
                      </label>
                      <select
                        id="referrer"
                        name="referrer"
                        value={formState.referrer}
                        onChange={handleRootChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Choose referrer</option>
                        {referrerOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-brand-dark">Are you a single founder?</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="singleFounder"
                            value="yes"
                            checked={formState.singleFounder === true}
                            onChange={handleRootChange}
                            className="h-4 w-4 border-slate-300 text-burnt focus:ring-burnt"
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="singleFounder"
                            value="no"
                            checked={formState.singleFounder === false}
                            onChange={handleRootChange}
                            className="h-4 w-4 border-slate-300 text-burnt focus:ring-burnt"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {!formState.singleFounder && (
                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-brand-muted/50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon">Second founder</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="coFounderName" className="text-sm font-semibold text-brand-dark">
                            Full name
                          </label>
                          <input
                            id="coFounderName"
                            name="name"
                            type="text"
                            required
                            value={formState.coFounder.name}
                            onChange={handleCoFounderChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                            placeholder="Co-founder full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="coFounderEmail" className="text-sm font-semibold text-brand-dark">
                            Email
                          </label>
                          <input
                            id="coFounderEmail"
                            name="email"
                            type="email"
                            required
                            value={formState.coFounder.email}
                            onChange={handleCoFounderChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                            placeholder="founder@company.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="coFounderLinkedin" className="text-sm font-semibold text-brand-dark">
                            LinkedIn URL
                          </label>
                          <input
                            id="coFounderLinkedin"
                            name="linkedinUrl"
                            type="url"
                            required
                            value={formState.coFounder.linkedinUrl}
                            onChange={handleCoFounderChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                            placeholder="https://www.linkedin.com/in/cofounder"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="coFounderGender" className="text-sm font-semibold text-brand-dark">
                            Gender
                          </label>
                          <select
                            id="coFounderGender"
                            name="gender"
                            required
                            value={formState.coFounder.gender}
                            onChange={handleCoFounderChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                          >
                            <option value="">Select gender</option>
                            {genderOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="brandName" className="text-sm font-semibold text-brand-dark">
                        Brand name
                      </label>
                      <input
                        id="brandName"
                        name="brandName"
                        type="text"
                        required
                        value={formState.startupDetails.brandName}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Customer-facing brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="legalName" className="text-sm font-semibold text-brand-dark">
                        Legal entity name
                      </label>
                      <input
                        id="legalName"
                        name="legalName"
                        type="text"
                        required
                        value={formState.startupDetails.legalName}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Registered company name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="websiteUrl" className="text-sm font-semibold text-brand-dark">
                        Website URL
                      </label>
                      <input
                        id="websiteUrl"
                        name="websiteUrl"
                        type="url"
                        required
                        value={formState.startupDetails.websiteUrl}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="https://"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="stage" className="text-sm font-semibold text-brand-dark">
                        Startup stage
                      </label>
                      <select
                        id="stage"
                        name="stage"
                        required
                        value={formState.startupDetails.stage}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select stage</option>
                        {stageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark">Primary sector</label>
                    <select
                      id="sector"
                      name="sector"
                      required
                      value={formState.startupDetails.sector}
                      onChange={handleStartupChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                    >
                      <option value="">Select primary sector</option>
                      {sectorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {sectorOptions.map((option) => (
                        <label key={option} className="flex items-start gap-2 text-xs text-slate-600">
                          <input
                            type="checkbox"
                            checked={selectedSectorTags.has(option)}
                            onChange={() => toggleSectorTag(option)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blaze focus:ring-blaze"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="cityOfOperation" className="text-sm font-semibold text-brand-dark">
                        City of operation
                      </label>
                      <input
                        id="cityOfOperation"
                        name="cityOfOperation"
                        type="text"
                        required
                        value={formState.startupDetails.cityOfOperation}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="companyType" className="text-sm font-semibold text-brand-dark">
                        Company type
                      </label>
                      <select
                        id="companyType"
                        name="companyType"
                        required
                        value={formState.startupDetails.companyType}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select type</option>
                        {companyTypes.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="monthlyRevenue" className="text-sm font-semibold text-brand-dark">
                        Monthly revenue
                      </label>
                      <select
                        id="monthlyRevenue"
                        name="monthlyRevenue"
                        value={formState.startupDetails.monthlyRevenue}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select range</option>
                        {revenueOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="preMoneyValuation" className="text-sm font-semibold text-brand-dark">
                        Pre-money valuation
                      </label>
                      <select
                        id="preMoneyValuation"
                        name="preMoneyValuation"
                        value={formState.startupDetails.preMoneyValuation}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select range</option>
                        {valuationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="capitalToRaise" className="text-sm font-semibold text-brand-dark">
                        Capital you want to raise
                      </label>
                      <select
                        id="capitalToRaise"
                        name="capitalToRaise"
                        value={formState.startupDetails.capitalToRaise}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select range</option>
                        {raiseOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="incorporationDate" className="text-sm font-semibold text-brand-dark">
                        Month &amp; year of incorporation
                      </label>
                      <input
                        id="incorporationDate"
                        name="incorporationDate"
                        type="month"
                        required
                        value={formState.startupDetails.incorporationDate}
                        onChange={handleStartupChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="pitchDeck" className="text-sm font-semibold text-brand-dark">
                        Pitch deck (PDF)
                      </label>
                      <input
                        id="pitchDeck"
                        name="pitchDeck"
                        type="file"
                        accept="application/pdf"
                        required
                        onChange={handlePitchDeckChange}
                        className="w-full cursor-pointer rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 file:mr-4 file:rounded file:border-0 file:bg-lagoon/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-lagoon"
                      />
                      {pitchDeckFile && (
                        <p className="text-xs text-slate-500">Selected: {pitchDeckFile.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-semibold text-brand-dark">
                      Tell us what you are building
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={5}
                      value={formState.startupDetails.description}
                      onChange={handleStartupChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      placeholder="Problem, solution, traction, and upcoming milestones"
                    />
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    <p className="font-semibold text-brand-dark">Submission agreement</p>
                    <p className="mt-2">
                      A non-refundable processing fee of ₹4,499 + GST is payable for pitch deck review. Our team will connect
                      with you within two weeks to review diligence findings and next steps.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      By submitting, you acknowledge LaunchAndLift may contact you to discuss your application and share further
                      onboarding requirements.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:border-burnt hover:text-burnt"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {currentStep === steps.length - 1 ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 transition hover:bg-sunset disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Submitting…' : 'Submit founder application'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 transition hover:bg-sunset"
                  >
                    Continue to startup details
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <p>
                By continuing you agree to LaunchAndLift&apos;s{' '}
                <a href="#terms" className="font-semibold text-lagoon hover:text-neon">
                  terms
                </a>{' '}
                and{' '}
                <a href="#privacy" className="font-semibold text-lagoon hover:text-neon">
                  privacy policy
                </a>
                .
              </p>
              <p>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-burnt hover:text-blaze">
                  Sign in
                </Link>
              </p>
              <p>
                Looking to invest with LaunchAndLift?{' '}
                <Link to="/signup/investor" className="font-semibold text-lagoon hover:text-neon">
                  Go to investor onboarding
                </Link>
              </p>
              {formState.startupDetails.incorporationDate && (
                <p className="text-[11px] text-slate-400">
                  Incorporation month recorded as {formatMonth(formState.startupDetails.incorporationDate)}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderSignup;
