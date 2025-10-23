const { randomUUID } = require('crypto');
const store = require('../data/store');

const getStats = () => store.stats;

const updateStats = (metrics) => {
  store.stats = {
    metrics,
    lastUpdated: new Date().toISOString(),
  };
  return store.stats;
};

const getTeam = () => store.team;

const setTeam = (team) => {
  store.team = team.map((member) => ({
    id: member.id ?? randomUUID(),
    ...member,
  }));
  return store.team;
};

const getTestimonials = () => store.testimonials;

const addTestimonial = (testimonial) => {
  const newItem = {
    id: randomUUID(),
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    createdAt: new Date().toISOString(),
  };
  store.testimonials.push(newItem);
  return newItem;
};

const removeTestimonial = (id) => {
  const index = store.testimonials.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Testimonial not found');
  }
  const [removed] = store.testimonials.splice(index, 1);
  return removed;
};

const getFaqs = (audience) => {
  if (!audience) return store.faqs;
  return store.faqs.filter((item) => item.audience === audience || item.audience === 'general');
};

const addFaq = (faq) => {
  const newFaq = {
    id: randomUUID(),
    audience: faq.audience ?? 'general',
    question: faq.question,
    answer: faq.answer,
    createdAt: new Date().toISOString(),
  };
  store.faqs.push(newFaq);
  return newFaq;
};

const removeFaq = (id) => {
  const index = store.faqs.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('FAQ not found');
  }
  const [removed] = store.faqs.splice(index, 1);
  return removed;
};

const getNews = () => store.news;

const setNews = (newsItems) => {
  store.news = newsItems.map((item) => ({ id: item.id ?? randomUUID(), ...item }));
  return store.news;
};

module.exports = {
  addFaq,
  addTestimonial,
  getFaqs,
  getNews,
  getStats,
  getTeam,
  removeFaq,
  removeTestimonial,
  setNews,
  setTeam,
  updateStats,
};
