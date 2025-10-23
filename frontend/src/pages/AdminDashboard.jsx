import { useEffect, useState } from 'react';
import FAQAccordion from '../components/FAQAccordion';
import Testimonials from '../components/Testimonials';
import { contentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyTestimonial = { name: '', role: '', quote: '' };
const emptyFaq = { audience: 'investor', question: '', answer: '' };

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [statsForm, setStatsForm] = useState([{ label: '', value: '', caption: '' }]);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [faqs, setFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsResponse, testimonialResponse, faqResponse] = await Promise.all([
          contentApi.stats(token),
          contentApi.testimonials(),
          contentApi.faqs(),
        ]);

        setStatsForm(statsResponse?.metrics?.length ? statsResponse.metrics : statsForm);
        setTestimonials(testimonialResponse.items ?? []);
        setFaqs(faqResponse.items ?? []);
      } catch (error) {
        setStatusMessage('Unable to load admin data. Check your connection or permissions.');
      }
    };

    load();
  }, [token]);

  const handleStatsChange = (index, field, value) => {
    setStatsForm((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)),
    );
  };

  const addMetricRow = () => {
    setStatsForm((prev) => [...prev, { label: '', value: '', caption: '' }]);
  };

  const handleSaveStats = async () => {
    try {
      await contentApi.updateStats({ metrics: statsForm }, token);
      setStatusMessage('Platform stats updated successfully.');
    } catch (error) {
      setStatusMessage('Failed to update stats. Please try again.');
    }
  };

  const handleTestimonialSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await contentApi.upsertTestimonial(testimonialForm, token);
      setTestimonials((prev) => [...prev, response.item]);
      setTestimonialForm(emptyTestimonial);
      setStatusMessage('Testimonial added.');
    } catch (error) {
      setStatusMessage('Unable to add testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      await contentApi.deleteTestimonial(id, token);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage('Testimonial removed.');
    } catch (error) {
      setStatusMessage('Failed to remove testimonial.');
    }
  };

  const handleFaqSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await contentApi.upsertFaq(faqForm, token);
      setFaqs((prev) => [...prev, response.item]);
      setFaqForm(emptyFaq);
      setStatusMessage('FAQ saved.');
    } catch (error) {
      setStatusMessage('Unable to save FAQ.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <header className="rounded-3xl bg-brand-dark p-10 text-white shadow-lg shadow-brand-dark/40">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Admin Console</p>
        <h1 className="mt-3 text-3xl font-semibold">
          Welcome, {user?.fullName ?? 'LaunchAndLift Admin'}
        </h1>
        <p className="mt-3 text-sm text-white/70">
          Manage LaunchAndLift content, portfolio snapshots, FAQs, and community stories for the platform.
        </p>
      </header>

      {statusMessage && (
        <div className="rounded-2xl bg-brand-muted p-4 text-sm text-brand-dark">
          {statusMessage}
        </div>
      )}

      <section className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-200">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-dark">Homepage metrics</h2>
          <button
            type="button"
            onClick={addMetricRow}
            className="rounded-full border border-lagoon px-4 py-2 text-xs font-semibold uppercase tracking-wide text-lagoon hover:border-burnt hover:text-burnt"
          >
            Add metric
          </button>
        </div>

        <div className="grid gap-4">
          {statsForm.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="grid gap-4 rounded-2xl border border-slate-100 bg-brand-muted p-4 sm:grid-cols-3">
              <input
                type="text"
                value={metric.label}
                onChange={(event) => handleStatsChange(index, 'label', event.target.value)}
                placeholder="Label"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
              />
              <input
                type="text"
                value={metric.value}
                onChange={(event) => handleStatsChange(index, 'value', event.target.value)}
                placeholder="Value"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
              />
              <input
                type="text"
                value={metric.caption}
                onChange={(event) => handleStatsChange(index, 'caption', event.target.value)}
                placeholder="Caption"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSaveStats}
          className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 hover:bg-sunset"
        >
          Save metrics
        </button>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-200">
        <h2 className="text-xl font-semibold text-brand-dark">Testimonials</h2>
        <Testimonials items={testimonials} />
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleTestimonialSubmit}>
          <input
            type="text"
            name="name"
            required
            value={testimonialForm.name}
            onChange={(event) =>
              setTestimonialForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Name"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
          />
          <input
            type="text"
            name="role"
            required
            value={testimonialForm.role}
            onChange={(event) =>
              setTestimonialForm((prev) => ({ ...prev, role: event.target.value }))
            }
            placeholder="Role"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
          />
          <textarea
            name="quote"
            required
            rows={3}
            value={testimonialForm.quote}
            onChange={(event) =>
              setTestimonialForm((prev) => ({ ...prev, quote: event.target.value }))
            }
            placeholder="Quote"
            className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
          />
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-burnt px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-burnt/40 hover:bg-sunset"
            >
              Add testimonial
            </button>
            {testimonials
              .filter((item) => item.id)
              .map((item) => (
                <button
                  key={`delete-${item.id}`}
                  type="button"
                  onClick={() => handleDeleteTestimonial(item.id)}
                  className="rounded-full border border-burnt px-4 py-2 text-xs font-semibold uppercase tracking-wide text-burnt hover:bg-burnt hover:text-white"
                >
                  Remove {item.name}
                </button>
              ))}
          </div>
        </form>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-200">
        <h2 className="text-xl font-semibold text-brand-dark">FAQs</h2>
        <FAQAccordion items={faqs} />
        <form className="grid gap-4" onSubmit={handleFaqSubmit}>
          <select
            value={faqForm.audience}
            onChange={(event) => setFaqForm((prev) => ({ ...prev, audience: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
          >
            <option value="investor">Investor</option>
            <option value="founder">Founder</option>
            <option value="general">General</option>
          </select>
          <input
            type="text"
            value={faqForm.question}
            onChange={(event) => setFaqForm((prev) => ({ ...prev, question: event.target.value }))}
            placeholder="Question"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
          />
          <textarea
            value={faqForm.answer}
            onChange={(event) => setFaqForm((prev) => ({ ...prev, answer: event.target.value }))}
            placeholder="Answer"
            required
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-brand-dark focus:border-lagoon focus:outline-none focus:ring-2 focus:ring-lagoon"
          />
          <button
            type="submit"
            className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 hover:bg-sunset"
          >
            Publish FAQ
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboard;
