const { Team, Testimonial, FAQ, News, ContentSettings } = require('./schemas/Content');

// Helper to sanitize documents (convert _id to id)
const sanitizeDocument = (doc) => {
  if (!doc) return null;
  const docObj = doc.toObject ? doc.toObject() : doc;
  if (docObj._id) {
    docObj.id = docObj._id.toString();
    delete docObj._id;
  }
  delete docObj.__v;
  return docObj;
};

// Stats
const getStats = async () => {
  let settings = await ContentSettings.findOne({ _id: 'settings' });
  if (!settings) {
    settings = new ContentSettings({
      _id: 'settings',
      stats: {
        metrics: [],
        lastUpdated: new Date(),
      },
    });
    await settings.save();
  }
  // Convert stats to plain object and ensure lastUpdated is a string
  const stats = settings.stats.toObject ? settings.stats.toObject() : settings.stats;
  return {
    ...stats,
    lastUpdated: stats.lastUpdated instanceof Date ? stats.lastUpdated.toISOString() : stats.lastUpdated,
  };
};

const updateStats = async (metrics) => {
  let settings = await ContentSettings.findOne({ _id: 'settings' });
  if (!settings) {
    settings = new ContentSettings({
      _id: 'settings',
      stats: {
        metrics,
        lastUpdated: new Date(),
      },
    });
  } else {
    settings.stats = {
      metrics,
      lastUpdated: new Date(),
    };
  }
  await settings.save();
  // Convert stats to plain object and ensure lastUpdated is a string
  const stats = settings.stats.toObject ? settings.stats.toObject() : settings.stats;
  return {
    ...stats,
    lastUpdated: stats.lastUpdated instanceof Date ? stats.lastUpdated.toISOString() : stats.lastUpdated,
  };
};

// Team
const getTeam = async () => {
  const team = await Team.find({}).sort({ createdAt: -1 });
  return team.map(sanitizeDocument);
};

const setTeam = async (team) => {
  // Delete all existing team members
  await Team.deleteMany({});
  
  // Insert new team members
  const teamMembers = team.map((member) => {
    const { id, ...memberData } = member; // Remove id if present
    return new Team(memberData);
  });
  await Team.insertMany(teamMembers);
  
  return teamMembers.map(sanitizeDocument);
};

// Testimonials
const getTestimonials = async () => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  return testimonials.map(sanitizeDocument);
};

const addTestimonial = async (testimonial) => {
  const newTestimonial = new Testimonial({
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
  });
  await newTestimonial.save();
  return sanitizeDocument(newTestimonial);
};

const removeTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) {
    throw new Error('Testimonial not found');
  }
  return sanitizeDocument(testimonial);
};

// FAQs
const getFaqs = async (audience) => {
  let faqs;
  if (!audience) {
    faqs = await FAQ.find({}).sort({ createdAt: -1 });
  } else {
    faqs = await FAQ.find({
      $or: [{ audience }, { audience: 'general' }],
    }).sort({ createdAt: -1 });
  }
  return faqs.map(sanitizeDocument);
};

const addFaq = async (faq) => {
  const newFaq = new FAQ({
    audience: faq.audience ?? 'general',
    question: faq.question,
    answer: faq.answer,
  });
  await newFaq.save();
  return sanitizeDocument(newFaq);
};

const removeFaq = async (id) => {
  const faq = await FAQ.findByIdAndDelete(id);
  if (!faq) {
    throw new Error('FAQ not found');
  }
  return sanitizeDocument(faq);
};

// News
const getNews = async () => {
  const news = await News.find({}).sort({ createdAt: -1 });
  return news.map(sanitizeDocument);
};

const setNews = async (newsItems) => {
  // Delete all existing news
  await News.deleteMany({});
  
  // Insert new news items
  const newsDocs = newsItems.map((item) => {
    const { id, ...itemData } = item; // Remove id if present
    return new News(itemData);
  });
  await News.insertMany(newsDocs);
  
  return newsDocs.map(sanitizeDocument);
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
