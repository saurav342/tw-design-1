require('dotenv').config();
const { connectDB } = require('../config/database');
const User = require('../models/schemas/User');
const Portfolio = require('../models/schemas/Portfolio');
const { Team, Testimonial, FAQ, News, ContentSettings } = require('../models/schemas/Content');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Portfolio.deleteMany({});
    await Team.deleteMany({});
    await Testimonial.deleteMany({});
    await FAQ.deleteMany({});
    await News.deleteMany({});
    await ContentSettings.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('LaunchAndLiftAdmin!23', 10);
    const adminUser = new User({
      fullName: 'Launch & Lift Admin',
      email: 'admin@launchandlift.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      organization: 'Launch & Lift',
      adminDetails: { department: 'Operations' },
    });
    await adminUser.save();
    console.log('Admin user created:', adminUser.email);

    // Create demo founder user
    console.log('Creating demo founder user...');
    const founderPasswordHash = await bcrypt.hash('123', 10);
    const demoFounder = new User({
      fullName: 'Demo Founder',
      email: 'fe@fe.com',
      passwordHash: founderPasswordHash,
      role: 'founder',
      organization: 'Launch & Lift Demo',
      founderDetails: {
        startupName: 'Test Founder Venture',
        raiseStage: 'Seed',
        geography: 'India',
      },
    });
    await demoFounder.save();
    console.log('Demo founder created:', demoFounder.email);

    // Create default portfolio items
    console.log('Creating portfolio items...');
    const portfolioItems = [
      {
        name: 'Arcadia Freight',
        sector: 'Climate Logistics',
        founders: ['Maya Chen', 'Luis Ocampo'],
        milestone: 'Raised $85M Series B to scale zero-emission freight corridors.',
        summary: 'Decarbonizing middle-mile logistics with AI-guided routing and electric fleets.',
        link: 'https://example.com/arcadia',
        status: 'Active',
      },
      {
        name: 'Synapse Harbor',
        sector: 'Applied AI',
        founders: ['Neha Kapoor'],
        milestone: 'Signed strategic alliance with three Fortune 100 cloud providers.',
        summary: 'AI co-pilot for maritime commerce digitizing customs clearance and port operations.',
        link: 'https://example.com/synapse',
        status: 'Active',
      },
    ];

    await Portfolio.insertMany(portfolioItems);
    console.log(`Created ${portfolioItems.length} portfolio items`);

    // Create default team
    console.log('Creating team members...');
    const teamMembers = [
      {
        name: 'Avery Cole',
        title: 'Managing Partner',
        bio: 'Leading capital strategy and governance for Launch & Lift vehicles.',
        linkedin: 'https://www.linkedin.com/',
      },
      {
        name: 'Riya Deshmukh',
        title: 'Head of Founder Platform',
        bio: 'Architects Launch & Lift's operator guild and founder experience.',
        linkedin: 'https://www.linkedin.com/',
      },
      {
        name: 'Malik Johnson',
        title: 'Chief Investment Officer',
        bio: 'Oversees diligence, portfolio construction, and risk.',
        linkedin: 'https://www.linkedin.com/',
      },
    ];

    await Team.insertMany(teamMembers);
    console.log(`Created ${teamMembers.length} team members`);

    // Create default testimonials
    console.log('Creating testimonials...');
    const testimonials = [
      {
        quote:
          'Launch & Lift is more than capital; the operator guild rebuilt our revenue engine and doubled ARR within nine months.',
        name: 'Maya Chen',
        role: 'Co-founder & CEO, Arcadia Freight',
      },
      {
        quote:
          'Mission Control drives conviction quickly. Launch & Lift's diligence packs are the benchmark for private market investing.',
        name: 'Aidan Fox',
        role: 'Principal, Foxbridge Family Office',
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log(`Created ${testimonials.length} testimonials`);

    // Create default FAQs
    console.log('Creating FAQs...');
    const faqs = [
      {
        audience: 'investor',
        question: 'How does Launch & Lift source opportunities?',
        answer:
          'Our operator guild and research lab maintain proactive theses across climate, infrastructure, health, and applied AI to source mission-aligned founders.',
      },
      {
        audience: 'founder',
        question: 'What support do founders receive post-investment?',
        answer:
          'Founders receive operator embeds across go-to-market, finance, people, and product disciplines, plus Mission Control analytics.',
      },
    ];

    await FAQ.insertMany(faqs);
    console.log(`Created ${faqs.length} FAQs`);

    // Create default news
    console.log('Creating news items...');
    const newsItems = [
      {
        outlet: 'Growth Weekly',
        headline: 'Launch & Lift unveils $400M opportunity fund for late-stage secondaries',
      },
      {
        outlet: 'Private Markets Today',
        headline: 'Launch & Lift Mission Control adds benchmarking for family offices',
      },
    ];

    await News.insertMany(newsItems);
    console.log(`Created ${newsItems.length} news items`);

    // Create default stats
    console.log('Creating content settings...');
    const stats = {
      metrics: [
        { label: 'Family offices', value: '190+', caption: 'Deep relationships across 18 countries' },
        { label: 'Average IRR', value: '27%', caption: 'Gross annualized net of fees since 2018' },
        { label: 'Assets under management', value: '$1.4B', caption: 'Across venture, opportunity, and credit vehicles' },
        { label: 'Deals evaluated annually', value: '950+', caption: 'Eight diligence lanes powered by proprietary data' },
      ],
      lastUpdated: new Date(),
    };

    const contentSettings = new ContentSettings({
      _id: 'settings',
      stats,
    });
    await contentSettings.save();
    console.log('Content settings created');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };

