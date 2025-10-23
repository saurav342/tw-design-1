import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const steps = [
  {
    id: 'personal',
    label: 'Personal details',
    description: 'Tell us about yourself',
  },
  {
    id: 'account',
    label: 'Account holder type',
    description: 'Describe how you invest',
  },
];

const investorTypeOptions = [
  'Business Owner',
  'Family Office Lead',
  'Angel Investor',
  'Senior Management Professional',
  'Wealth Manager',
  'Other',
];

const experienceOptions = [
  'Early stage investment experience',
  'Experience as a serial entrepreneur',
  'Senior management professional with at least 10 years of experience',
  'None of the above',
];

const countries = ['India', 'United States', 'Singapore', 'United Arab Emirates', 'United Kingdom', 'Other'];

const accountHolderTypeLabels = {
  individual: 'Individual',
  corporate: 'Corporate / Institutional',
};

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

const inferAccountHolderType = (descriptor) => {
  if (!descriptor) return 'individual';
  const normalised = descriptor.toLowerCase();
  if (normalised.includes('family office') || normalised.includes('corporate') || normalised.includes('company')) {
    return 'corporate';
  }
  return 'individual';
};

const TEST_PHONE_NUMBER = '9312121212';
const TEST_OTP_CODE = '1234';

const InvestorSignup = () => {
  const navigate = useNavigate();
  const { signup, loading, error, setError, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [stepError, setStepError] = useState('');
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    organization: '',
    notes: '',
    phone: TEST_PHONE_NUMBER,
    otp: '',
    phoneVerified: false,
    linkedinUrl: '',
    investorType: '',
    accountHolderType: '',
    assetsOverThreshold: '',
    experience: [],
    countryOfCitizenship: '',
    panNumber: '',
    location: '',
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState({ type: 'info', message: '' });

  const showVerificationFeedback = (type, message) => {
    setVerificationFeedback({ type, message });
  };

  const clearVerificationFeedback = () => {
    setVerificationFeedback({ type: 'info', message: '' });
  };

  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  useEffect(
    () => () => {
      setError(null);
      if (profilePhotoPreview) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    },
    [setError, profilePhotoPreview],
  );

  const accountHolderOptions = useMemo(
    () =>
      Object.entries(accountHolderTypeLabels).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      setOtpSent(false);
      clearVerificationFeedback();
      setFormState((prev) => ({
        ...prev,
        phone: value,
        otp: '',
        phoneVerified: false,
      }));
      return;
    }

    if (name === 'otp') {
      setFormState((prev) => ({
        ...prev,
        otp: value,
        phoneVerified: false,
      }));
      return;
    }

    if (name === 'investorType') {
      const inferred = inferAccountHolderType(value);
      setFormState((prev) => ({
        ...prev,
        investorType: value,
        accountHolderType: prev.accountHolderType || inferred,
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceToggle = (option) => {
    setFormState((prev) => {
      if (option === 'None of the above') {
        return {
          ...prev,
          experience: prev.experience.includes(option) ? [] : [option],
        };
      }

      const filtered = prev.experience.filter((item) => item !== 'None of the above');
      if (filtered.includes(option)) {
        return { ...prev, experience: filtered.filter((item) => item !== option) };
      }

      return { ...prev, experience: [...filtered, option] };
    });
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    clearVerificationFeedback();
    if (!file) {
      if (profilePhotoPreview) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
      setProfilePhotoFile(null);
      setProfilePhotoPreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      showVerificationFeedback('error', 'Profile photo must be an image file (jpg, png).');
      event.target.value = '';
      return;
    }

    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview);
    }

    setProfilePhotoFile(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const handleSendOtp = async () => {
    if (!formState.phone) {
      showVerificationFeedback('error', 'Enter the phone number before requesting an OTP.');
      return;
    }

    setSendingOtp(true);
    setOtpSent(false);
    clearVerificationFeedback();
    setFormState((prev) => ({ ...prev, phoneVerified: false }));

    try {
      const response = await authApi.sendOtp({ phone: formState.phone });
      setOtpSent(true);
      setFormState((prev) => ({
        ...prev,
        phone: response?.phone ?? prev.phone,
        otp: response?.otp ?? TEST_OTP_CODE,
        phoneVerified: false,
      }));
      showVerificationFeedback('success', response?.message ?? `OTP sent. Use ${TEST_OTP_CODE} to verify.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to send OTP.';
      showVerificationFeedback('error', message);
      setOtpSent(false);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (formState.phoneVerified) {
      showVerificationFeedback('success', 'Phone number already verified.');
      return;
    }

    if (!otpSent) {
      showVerificationFeedback('error', 'Send the OTP before attempting verification.');
      return;
    }

    if (!formState.otp.trim()) {
      showVerificationFeedback('error', 'Enter the OTP before attempting verification.');
      return;
    }

    setVerifyingOtp(true);

    try {
      const response = await authApi.verifyOtp({ phone: formState.phone, otp: formState.otp });
      setFormState((prev) => ({
        ...prev,
        phone: response?.phone ?? prev.phone,
        phoneVerified: true,
      }));
      showVerificationFeedback('success', 'Phone number verified successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to verify OTP.';
      showVerificationFeedback('error', message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const validateStep = (step) => {
    const missing = [];

    if (step === 0) {
      if (!formState.fullName) missing.push('full name');
      if (!formState.email) missing.push('work email');
      if (!formState.linkedinUrl) missing.push('LinkedIn URL');
      if (!formState.investorType) missing.push('investor type');
      if (!formState.phone) missing.push('phone number');
      if (!formState.assetsOverThreshold) missing.push('asset declaration');
      if (!formState.countryOfCitizenship) missing.push('country of citizenship');
      if (!formState.location) missing.push('location');
      if (!formState.experience.length) missing.push('experience selection');
      if (!formState.phoneVerified) {
        setStepError('Please verify your phone number before continuing.');
        return false;
      }
    } else if (step === 1) {
      if (!formState.organization) missing.push('organization');
      if (!formState.password) missing.push('password');
      if (!formState.accountHolderType) missing.push('account holder type');
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

    clearVerificationFeedback();
    try {
      const payload = {
        fullName: formState.fullName,
        email: formState.email,
        password: formState.password,
        role: 'investor',
        organization: formState.organization,
        notes: formState.notes || null,
        phone: formState.phone,
        phoneVerified: formState.phoneVerified,
        linkedinUrl: formState.linkedinUrl,
        investorType: formState.investorType,
        accountHolderType: formState.accountHolderType || inferAccountHolderType(formState.investorType),
        assetsOverThreshold: formState.assetsOverThreshold === 'yes',
        experience: formState.experience,
        countryOfCitizenship: formState.countryOfCitizenship,
        panNumber: formState.panNumber || null,
        location: formState.location,
        profilePhoto: profilePhotoFile ? await fileToPayload(profilePhotoFile) : null,
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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Start your investment journey</p>
                <h1 className="mt-4 text-3xl font-semibold">LaunchAndLift investor onboarding</h1>
                <p className="mt-3 text-sm text-white/70">
                  Share your professional profile so our capital partnerships team can verify accreditation and unlock Mission
                  Control access.
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
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                        Step {index + 1}
                      </p>
                      <p className="mt-2 text-lg font-semibold">{step.label}</p>
                      <p className="text-sm text-white/70">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-white/10 p-5 text-sm text-white/70">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">You&apos;ll need</p>
              <ul className="space-y-2">
                <li>LinkedIn or professional reference for verification.</li>
                <li>Government ID (PAN) and residency details for compliance.</li>
                <li>Capital focus overview to align LaunchAndLift deal flow.</li>
              </ul>
            </div>
          </aside>

          <div className="bg-white p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {stepError && <div className="rounded-xl bg-burnt/10 px-4 py-3 text-sm text-burnt">{stepError}</div>}
              {verificationFeedback.message && (
                <div
                  className={`rounded-xl px-4 py-3 text-xs ${
                    verificationFeedback.type === 'error'
                      ? 'border border-burnt/40 bg-burnt/10 text-burnt'
                      : 'border border-lagoon/40 bg-lagoon/10 text-lagoon'
                  }`}
                >
                  {verificationFeedback.message}
                </div>
              )}
              {error && <div className="rounded-xl bg-burnt/10 px-4 py-3 text-sm text-burnt">{error}</div>}

              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="profilePhoto" className="text-sm font-semibold text-brand-dark">
                      Upload photo <span className="text-xs font-normal text-slate-500">(jpg, png)</span>
                    </label>
                    <input
                      id="profilePhoto"
                      name="profilePhoto"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleProfilePhotoChange}
                      className="w-full cursor-pointer rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 file:mr-4 file:rounded file:border-0 file:bg-lagoon/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-lagoon"
                    />
                    {profilePhotoPreview && (
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500">
                        <img src={profilePhotoPreview} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
                        <span>{profilePhotoFile?.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-semibold text-brand-dark">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Your full name"
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
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="you@institution.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="linkedinUrl" className="text-sm font-semibold text-brand-dark">
                      LinkedIn profile
                    </label>
                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      required
                      value={formState.linkedinUrl}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      placeholder="https://www.linkedin.com/in/you"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="investorType" className="text-sm font-semibold text-brand-dark">
                        Which best describes you?
                      </label>
                      <select
                        id="investorType"
                        name="investorType"
                        required
                        value={formState.investorType}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select investor type</option>
                        {investorTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="countryOfCitizenship" className="text-sm font-semibold text-brand-dark">
                        Country of citizenship
                      </label>
                      <select
                        id="countryOfCitizenship"
                        name="countryOfCitizenship"
                        required
                        value={formState.countryOfCitizenship}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
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
                      <div className="flex items-center gap-3">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                          placeholder="+91 93121 21212"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={sendingOtp}
                          className="whitespace-nowrap rounded-full border border-lagoon px-4 py-2 text-xs font-semibold uppercase tracking-wide text-lagoon transition hover:border-burnt hover:text-burnt disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                        >
                          {sendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Only the sandbox test number {TEST_PHONE_NUMBER} is enabled.</p>
                    </div>
                    {(otpSent || formState.phoneVerified) && (
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
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm tracking-[0.3em] text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                            placeholder={TEST_OTP_CODE}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={verifyingOtp || formState.phoneVerified}
                            className="whitespace-nowrap rounded-full border border-lagoon px-4 py-2 text-xs font-semibold uppercase tracking-wide text-lagoon transition hover:border-burnt hover:text-burnt disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                          >
                            {formState.phoneVerified ? 'Verified' : verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                          </button>
                        </div>
                        {formState.phoneVerified && (
                          <p className="text-xs font-semibold text-emerald-600">Phone number verified successfully!</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-brand-dark">
                      Do you have assets worth over INR 2 Cr (excluding your primary residence)?
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="assetsOverThreshold"
                          value="yes"
                          checked={formState.assetsOverThreshold === 'yes'}
                          onChange={handleChange}
                          className="h-4 w-4 border-slate-300 text-burnt focus:ring-burnt"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="radio"
                          name="assetsOverThreshold"
                          value="no"
                          checked={formState.assetsOverThreshold === 'no'}
                          onChange={handleChange}
                          className="h-4 w-4 border-slate-300 text-burnt focus:ring-burnt"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-brand-dark">Help us understand your experience</p>
                    <div className="grid gap-3">
                      {experienceOptions.map((option) => (
                        <label key={option} className="flex items-start gap-3 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={formState.experience.includes(option)}
                            onChange={() => handleExperienceToggle(option)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blaze focus:ring-blaze"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-semibold text-brand-dark">
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        required
                        value={formState.location}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="e.g., Mumbai, India"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="panNumber" className="text-sm font-semibold text-brand-dark">
                        PAN number <span className="text-xs font-normal text-slate-500">(optional)</span>
                      </label>
                      <input
                        id="panNumber"
                        name="panNumber"
                        type="text"
                        value={formState.panNumber}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase tracking-widest text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-100 bg-brand-muted/50 p-5 text-sm text-slate-600">
                    <p className="font-semibold text-brand-dark">Classification summary</p>
                    <p className="mt-2">
                      Based on your selection in “Which best describes you?”, we use the account holder type to determine the
                      right LaunchAndLift onboarding path. You can adjust the classification below if needed.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="organization" className="text-sm font-semibold text-brand-dark">
                        Family office or institution
                      </label>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        required
                        value={formState.organization}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Organization name"
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
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                        placeholder="Create a secure password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="accountHolderType" className="text-sm font-semibold text-brand-dark">
                      Account holder type
                    </label>
                    <select
                      id="accountHolderType"
                      name="accountHolderType"
                      required
                      value={formState.accountHolderType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                    >
                      <option value="">Select account holder type</option>
                      {accountHolderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-semibold text-brand-dark">
                      Capital focus or objectives <span className="text-xs font-normal text-slate-500">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formState.notes}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
                      placeholder="Tell us about your preferred ticket size, sectors, or geographic focus"
                    />
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    <p className="font-semibold text-brand-dark">Next steps after submission</p>
                    <ul className="mt-3 space-y-2">
                      <li>Complete KYC and bank verification.</li>
                      <li>Sign the contribution agreement and onboarding documents.</li>
                      <li>Provide Demat account and nominee details.</li>
                    </ul>
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
                    {loading ? 'Creating account...' : 'Create investor account'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 transition hover:bg-sunset"
                  >
                    Continue to step 2
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
                Looking to onboard as a founder?{' '}
                <Link to="/signup/founder" className="font-semibold text-lagoon hover:text-neon">
                  Go to founder onboarding
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
