import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { CheckCircle2, Upload, X, Eye, EyeOff } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAppStore } from '../store/useAppStore.js';
import { uploadApi } from '../services/api.js';
import { authApi } from '../services/api.js';

const stageOptions = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

const initialForm = {
  founderFullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  linkedInUrl: '',
  numberOfFounders: 1,
  secondFounder: {
    fullName: '',
    email: '',
    phoneNumber: '',
    linkedInUrl: '',
  },
  companyLegalName: '',
  brandName: '',
  companyWebsite: '',
  companyFoundingDate: '',
  sector: '',
  currentStage: '',
  brief: '',
  pitchDeck: '',
};

const FounderSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showInfo } = useNotification();
  const addFounder = useAppStore((state) => state.addFounder);
  
  // Get email from location state or sessionStorage
  const verifiedEmail = location.state?.email || sessionStorage.getItem('signup.email') || '';
  
  const [form, setForm] = useState({
    ...initialForm,
    email: verifiedEmail,
  });
  const [includeSecondFounder, setIncludeSecondFounder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pitchDeckFile, setPitchDeckFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to email entry if no email
  useEffect(() => {
    if (!verifiedEmail) {
      navigate('/signup/email?role=founder', { replace: true });
    }
  }, [verifiedEmail, navigate]);

  const updateForm = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNumberField = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value === '' ? '' : Math.max(1, Number.parseInt(value, 10) || 1),
    }));
  };

  const updateSecondFounder = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      secondFounder: {
        ...prev.secondFounder,
        [field]: value,
      },
    }));
  };

  const resetSecondFounder = () => {
    setForm((prev) => ({
      ...prev,
      secondFounder: { ...initialForm.secondFounder },
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        showInfo('Invalid file type. Please upload a PDF, PPT, PPTX, DOC, or DOCX file.');
        return;
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        showInfo('File size too large. Please upload a file smaller than 50MB.');
        return;
      }

      setPitchDeckFile(file);
      setForm((prev) => ({ ...prev, pitchDeck: '' })); // Clear URL if file is selected
    }
  };

  const handleRemoveFile = () => {
    setPitchDeckFile(null);
  };

  const handleUploadPitchDeck = async () => {
    if (!pitchDeckFile) return null;

    setIsUploading(true);
    setUploadProgress('Uploading pitch deck...');
    try {
      const response = await uploadApi.uploadPitchDeck(pitchDeckFile);
      setUploadProgress('Upload successful!');
      setIsUploading(false);
      return response.fileUrl;
    } catch (error) {
      setIsUploading(false);
      setUploadProgress('');
      showInfo(error.message || 'Failed to upload pitch deck. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = [
      { key: 'founderFullName', label: "Founder's full name" },
      { key: 'email', label: 'email address' },
      { key: 'password', label: 'password' },
      { key: 'companyLegalName', label: "company's legal name" },
      { key: 'brandName', label: 'brand name' },
      { key: 'companyWebsite', label: "company's website" },
      { key: 'sector', label: "sector's industry" },
      { key: 'currentStage', label: 'current stage' },
      { key: 'brief', label: 'brief about what you are building' },
    ];

    const missing = requiredFields.filter((item) => !form[item.key]?.trim());
    if (missing.length) {
      const fieldsList = missing.map((item) => item.label).join(', ');
      showInfo(`Please complete the following before submitting: ${fieldsList}.`);
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      showInfo('Password must be at least 6 characters long.');
      return;
    }

    if (!form.numberOfFounders || form.numberOfFounders < 1) {
      showInfo('Number of founders must be at least 1.');
      return;
    }

    // Validate pitch deck: either file or URL must be provided (optional but recommended)
    let pitchDeckUrl = form.pitchDeck.trim();
    if (pitchDeckFile && !pitchDeckUrl) {
      try {
        pitchDeckUrl = await handleUploadPitchDeck();
      } catch (error) {
        // Upload failed, user can try again
        return;
      }
    }

    const shouldAttachSecondFounder =
      includeSecondFounder &&
      Object.values(form.secondFounder).some((value) => typeof value === 'string' && value.trim());

    const payload = {
      fullName: form.founderFullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      linkedInUrl: form.linkedInUrl.trim(),
      numberOfFounders: Number.parseInt(form.numberOfFounders, 10) || 1,
      companyLegalName: form.companyLegalName.trim(),
      brandName: form.brandName.trim(),
      companyWebsite: form.companyWebsite.trim(),
      companyFoundingDate: form.companyFoundingDate.trim(),
      sector: form.sector.trim(),
      currentStage: form.currentStage.trim(),
      brief: form.brief.trim(),
      pitchDeck: pitchDeckUrl,
      startupName: form.brandName.trim() || form.companyLegalName.trim(),
      raiseStage: form.currentStage.trim(),
      teamSize: Number.parseInt(form.numberOfFounders, 10) || 1,
      tractionSummary: form.brief.trim(),
      metrics: {},
      subSectors: [],
      geography: '',
      raiseAmountUSD: 0,
      revenueRunRateUSD: 0,
      submittedFrom: 'founder-signup-v2',
      company: {
        legalName: form.companyLegalName.trim(),
        brandName: form.brandName.trim(),
        website: form.companyWebsite.trim(),
        foundingDate: form.companyFoundingDate.trim(),
        sector: form.sector.trim(),
        currentStage: form.currentStage.trim(),
        brief: form.brief.trim(),
        pitchDeckUrl: pitchDeckUrl,
      },
    };

    if (shouldAttachSecondFounder) {
      payload.secondFounder = {
        fullName: form.secondFounder.fullName.trim(),
        email: form.secondFounder.email.trim(),
        phoneNumber: form.secondFounder.phoneNumber.trim(),
        linkedInUrl: form.secondFounder.linkedInUrl.trim(),
      };
    }

    setIsSubmitting(true);
    try {
      // First, submit the founder intake
      const added = await addFounder(payload);

      // Then, create a user account with password
      try {
        const signupPayload = {
          fullName: form.founderFullName.trim(),
          email: form.email.trim(),
          password: form.password,
          role: 'founder',
          gender: 'prefer-not-to-say', // Default value since form doesn't collect this
          phone: form.phoneNumber.trim() || '',
          phoneVerified: false,
          linkedinUrl: form.linkedInUrl.trim() || '',
          singleFounder: !includeSecondFounder,
          coFounder: includeSecondFounder ? {
            name: form.secondFounder.fullName.trim(),
            email: form.secondFounder.email.trim(),
            linkedinUrl: form.secondFounder.linkedInUrl.trim(),
            gender: 'prefer-not-to-say',
          } : {},
          startupDetails: {
            brandName: form.brandName.trim(),
            legalName: form.companyLegalName.trim(),
            websiteUrl: form.companyWebsite.trim(),
            sector: form.sector.trim(),
            stage: form.currentStage.trim(),
            cityOfOperation: '',
            companyType: '',
            incorporationDate: form.companyFoundingDate.trim() || new Date().toISOString().split('T')[0],
            description: form.brief.trim(),
            pitchDeck: payload.pitchDeck || null,
          },
        };

        await authApi.signup(signupPayload);
      } catch (signupError) {
        // If user account creation fails, show the error and stop the flow
        console.error('Failed to create user account:', signupError);
        setIsSubmitting(false);
        const errorMessage = signupError.message || signupError.data?.message || 'Failed to create account. Please try again.';
        showInfo(errorMessage);
        return; // Stop here, don't redirect
      }

      // Clear signup flow sessionStorage
      sessionStorage.removeItem('signup.email');
      sessionStorage.removeItem('signup.role');
      sessionStorage.removeItem('signup.emailVerified');
      
      setIsSubmitting(false);
      showSuccess('Founder application submitted successfully! Redirecting to payment...');
      
      // Redirect to payment details page after successful submission
      setTimeout(() => {
        navigate('/payment-details', { replace: true });
      }, 1500);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Founder submission failed', error);
      setIsSubmitting(false);
      showInfo('We could not submit your information. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-lilac via-white to-blossom/40 py-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-night/10 bg-white/90 p-10 shadow-2xl backdrop-blur">
        <header className="mb-10 space-y-4 text-night">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-night/60">
            Founder intake
          </p>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">
            Tell us about your founding team &amp; company
          </h1>
          <p className="max-w-2xl text-sm text-night/70">
            Share the essentials so we can fast-track your onboarding. This quick snapshot helps us
            prepare investor materials and line up the right support pods ahead of our call.
          </p>
        </header>

        <form className="space-y-12" onSubmit={handleSubmit}>
          <section>
            <h2 className="mb-6 text-lg font-semibold text-night">Founder&apos;s Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="founderFullName">Founder's full name</Label>
                <Input
                  id="founderFullName"
                  placeholder="Avery Cole"
                  required
                  value={form.founderFullName}
                  onChange={updateForm('founderFullName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="avery@example.com"
                  required
                  value={form.email}
                  onChange={updateForm('email')}
                  disabled={!!verifiedEmail}
                />
                {verifiedEmail && (
                  <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Email verified
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    required
                    value={form.password}
                    onChange={updateForm('password')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 6 characters. You'll use this to sign in.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 415 555 1234"
                  value={form.phoneNumber}
                  onChange={updateForm('phoneNumber')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedInUrl">LinkedIn profile URL</Label>
                <Input
                  id="linkedInUrl"
                  type="url"
                  placeholder="https://www.linkedin.com/in/averycole"
                  value={form.linkedInUrl}
                  onChange={updateForm('linkedInUrl')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfFounders">Number of founders</Label>
                <Input
                  id="numberOfFounders"
                  type="number"
                  min={1}
                  value={form.numberOfFounders}
                  onChange={updateNumberField('numberOfFounders')}
                />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-night/10 bg-night/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-night">Add a co-founder?</p>
                  <p className="text-xs text-night/60">
                    Toggle if you would like to share details about a second founder.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                  <input
                    checked={includeSecondFounder}
                    className="h-4 w-4 accent-night"
                    type="checkbox"
                    onChange={(event) => {
                      const next = event.target.checked;
                      setIncludeSecondFounder(next);
                      if (!next) {
                        resetSecondFounder();
                      }
                    }}
                  />
                  Second founder
                </label>
              </div>

              {includeSecondFounder && (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="secondFounderName">Co-founder full name</Label>
                    <Input
                      id="secondFounderName"
                      placeholder="Riya Deshmukh"
                      value={form.secondFounder.fullName}
                      onChange={updateSecondFounder('fullName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondFounderEmail">Co-founder email</Label>
                    <Input
                      id="secondFounderEmail"
                      type="email"
                      placeholder="riya@example.com"
                      value={form.secondFounder.email}
                      onChange={updateSecondFounder('email')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondFounderPhone">Co-founder phone</Label>
                    <Input
                      id="secondFounderPhone"
                      type="tel"
                      placeholder="+91 99876 54321"
                      value={form.secondFounder.phoneNumber}
                      onChange={updateSecondFounder('phoneNumber')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondFounderLinkedIn">Co-founder LinkedIn URL</Label>
                    <Input
                      id="secondFounderLinkedIn"
                      type="url"
                      placeholder="https://www.linkedin.com/in/riyadeshmukh"
                      value={form.secondFounder.linkedInUrl}
                      onChange={updateSecondFounder('linkedInUrl')}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-lg font-semibold text-night">Company Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyLegalName">Company's legal name</Label>
                <Input
                  id="companyLegalName"
                  placeholder="Launch & Lift Labs Inc."
                  required
                  value={form.companyLegalName}
                  onChange={updateForm('companyLegalName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand name</Label>
                <Input
                  id="brandName"
                  placeholder="Launch &amp; Lift"
                  required
                  value={form.brandName}
                  onChange={updateForm('brandName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company's website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  placeholder="https://launchandlift.com"
                  required
                  value={form.companyWebsite}
                  onChange={updateForm('companyWebsite')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyFoundingDate">Company founding date</Label>
                <Input
                  id="companyFoundingDate"
                  type="date"
                  value={form.companyFoundingDate}
                  onChange={updateForm('companyFoundingDate')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector's industry</Label>
                <Input
                  id="sector"
                  placeholder="Climate logistics"
                  required
                  value={form.sector}
                  onChange={updateForm('sector')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentStage">Current stage</Label>
                <select
                  id="currentStage"
                  className="h-11 w-full rounded-lg border border-night/20 bg-white px-3 text-sm text-night outline-none transition focus:border-night/50 focus:ring-2 focus:ring-night/10"
                  required
                  value={form.currentStage}
                  onChange={updateForm('currentStage')}
                >
                  <option value="">Select stage</option>
                  {stageOptions.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="brief">Brief about what you are building</Label>
              <Textarea
                id="brief"
                placeholder="Tell us about the product, the problem you are solving, and the traction you have so far."
                required
                rows={6}
                value={form.brief}
                onChange={updateForm('brief')}
              />
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="pitchDeck">Pitch deck</Label>
              <p className="text-xs text-slate-500 mb-3">
                Upload your pitch deck (PDF, PPT, PPTX, DOC, DOCX) or provide a URL. Max file size: 50MB.
              </p>
              
              {/* File Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="pitchDeckFile"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-night/20 rounded-lg cursor-pointer hover:bg-night/5 transition text-sm font-medium text-night"
                  >
                    <Upload className="w-4 h-4" />
                    {pitchDeckFile ? 'Change File' : 'Upload File'}
                    <input
                      id="pitchDeckFile"
                      type="file"
                      accept=".pdf,.ppt,.pptx,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading || isSubmitting}
                    />
                  </label>
                  
                  {pitchDeckFile && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700 truncate max-w-[200px]">{pitchDeckFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-slate-400 hover:text-slate-600 transition"
                        disabled={isUploading || isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {uploadProgress && (
                  <p className="text-sm text-sprout">{uploadProgress}</p>
                )}
                
                {/* Or Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200"></div>
                  <span className="text-xs text-slate-500 uppercase">or</span>
                  <div className="flex-1 border-t border-slate-200"></div>
                </div>
                
                {/* URL Input */}
                <Input
                  id="pitchDeck"
                  type="url"
                  placeholder="https://drive.google.com/your-pitch-deck"
                  value={form.pitchDeck}
                  onChange={updateForm('pitchDeck')}
                  disabled={!!pitchDeckFile || isUploading || isSubmitting}
                />
                {pitchDeckFile && (
                  <p className="text-xs text-slate-500">
                    Remove the file above to enter a URL instead.
                  </p>
                )}
              </div>
            </div>
          </section>

          <footer className="flex flex-col items-start justify-between gap-4 border-t border-night/10 pt-6 text-sm text-night/70 md:flex-row md:items-center">
            <p>
              Once you submit, we will direct you to the payment details page to confirm the next
              steps for onboarding.
            </p>
            <Button className="px-8" disabled={isSubmitting || isUploading} type="submit">
              {isUploading ? 'Uploading…' : isSubmitting ? 'Submitting…' : 'Submit & continue'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default FounderSignup;
