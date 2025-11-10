const { getAllUsers, updateUser, deleteUser } = require('../models/userModel');
const FounderIntake = require('../models/schemas/FounderIntake');
const FounderExtras = require('../models/schemas/FounderExtras');
const User = require('../models/schemas/User');
const Portfolio = require('../models/schemas/Portfolio');
const { Testimonial, FAQ } = require('../models/schemas/Content');

const getUsers = async (req, res) => {
  try {
    const items = await getAllUsers();
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, organization, notes } = req.body || {};
    const updates = {};
    if (role) updates.role = role;
    if (organization) updates.organization = organization;
    if (notes) updates.notes = notes;
    const user = await updateUser(id, updates);
    return res.status(200).json({ item: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    return res.status(200).json({ item: user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getSiteMetrics = async (req, res) => {
  try {
    const [totalUsers, investors, founders, admins, portfolioCompanies, testimonials, faqs] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'investor' }),
      User.countDocuments({ role: 'founder' }),
      User.countDocuments({ role: 'admin' }),
      Portfolio.countDocuments(),
      Testimonial.countDocuments(),
      FAQ.countDocuments(),
    ]);

    const metrics = {
      totalUsers,
      investors,
      founders,
      admins,
      portfolioCompanies,
      testimonials,
      faqs,
    };

    return res.status(200).json({ metrics });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch metrics' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User analytics
    const [recentFounders, recentInvestors, totalUsers, founderUsers, investorUsers, adminUsers] = await Promise.all([
      User.countDocuments({ role: 'founder', createdAt: { $gte: last30Days } }),
      User.countDocuments({ role: 'investor', createdAt: { $gte: last30Days } }),
      User.countDocuments(),
      User.countDocuments({ role: 'founder' }),
      User.countDocuments({ role: 'investor' }),
      User.countDocuments({ role: 'admin' }),
    ]);

    // Founder intake analytics
    const [totalIntakes, pendingIntakes, approvedIntakes, recentIntakes] = await Promise.all([
      FounderIntake.countDocuments(),
      FounderIntake.countDocuments({ status: 'pending' }),
      FounderIntake.countDocuments({ status: 'approved' }),
      FounderIntake.countDocuments({ createdAt: { $gte: last7Days } }),
    ]);

    // Service request analytics
    const allExtras = await FounderExtras.find({});
    let totalServiceRequests = 0;
    let highUrgencyRequests = 0;
    let successFeeRequests = 0;
    let marketplaceListings = 0;
    let recentServiceRequests = 0;
    let activeFounders = 0;
    let engagedFounders = 0;

    allExtras.forEach((extras) => {
      if (Array.isArray(extras.serviceRequests)) {
        totalServiceRequests += extras.serviceRequests.length;
        highUrgencyRequests += extras.serviceRequests.filter(
          (r) => r.urgency === 'High'
        ).length;
        recentServiceRequests += extras.serviceRequests.filter(
          (r) => new Date(r.createdAt) >= last7Days
        ).length;
        if (extras.serviceRequests.length > 0) engagedFounders++;
      }
      if (extras.successFeeRequest) successFeeRequests++;
      if (extras.marketplaceListing) marketplaceListings++;
      if (
        (Array.isArray(extras.serviceRequests) && extras.serviceRequests.length > 0) ||
        extras.successFeeRequest ||
        extras.marketplaceListing
      ) {
        activeFounders++;
      }
    });

    // Calculate revenue metrics
    const estimatedRevenue = {
      services: totalServiceRequests * 2500,
      successFees: successFeeRequests * 50000,
      marketplace: marketplaceListings * 5000,
    };

    const analytics = {
      users: {
        total: totalUsers,
        founders: founderUsers,
        investors: investorUsers,
        admins: adminUsers,
        growth: {
          last30Days: recentFounders + recentInvestors,
          foundersLast30Days: recentFounders,
          investorsLast30Days: recentInvestors,
        },
      },
      founderIntakes: {
        total: totalIntakes,
        pending: pendingIntakes,
        approved: approvedIntakes,
        recentLast7Days: recentIntakes,
        conversionRate: totalIntakes > 0 ? ((approvedIntakes / totalIntakes) * 100).toFixed(1) : 0,
      },
      services: {
        totalRequests: totalServiceRequests,
        highUrgency: highUrgencyRequests,
        successFeeRequests,
        marketplaceListings,
        recentLast7Days: recentServiceRequests,
        averagePerFounder: (totalServiceRequests / Math.max(totalIntakes, 1)).toFixed(1),
      },
      revenue: {
        estimated: {
          services: estimatedRevenue.services,
          successFees: estimatedRevenue.successFees,
          marketplace: estimatedRevenue.marketplace,
          total: estimatedRevenue.services + estimatedRevenue.successFees + estimatedRevenue.marketplace,
        },
        breakdown: [
          {
            category: 'Services',
            amount: estimatedRevenue.services,
            count: totalServiceRequests,
          },
          {
            category: 'Success Fees',
            amount: estimatedRevenue.successFees,
            count: successFeeRequests,
          },
          {
            category: 'Marketplace',
            amount: estimatedRevenue.marketplace,
            count: marketplaceListings,
          },
        ],
      },
      engagement: {
        activeFounders,
        engagementRate: ((engagedFounders / Math.max(totalIntakes, 1)) * 100).toFixed(1),
      },
    };

    return res.status(200).json({ analytics });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch analytics' });
  }
};

const getActivityLog = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = [];

    // User activities
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select('fullName email role createdAt _id');
    
    recentUsers.forEach((user) => {
      activities.push({
        id: `user-${user._id}`,
        type: 'user_registration',
        role: user.role,
        timestamp: user.createdAt,
        description: `${user.fullName} registered as ${user.role}`,
        user: {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    });

    // Founder intake activities
    const recentIntakes = await FounderIntake.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select('fullName startupName status createdAt _id');
    
    recentIntakes.forEach((intake) => {
      activities.push({
        id: `intake-${intake._id}`,
        type: 'founder_intake',
        status: intake.status,
        timestamp: intake.createdAt,
        description: `${intake.startupName} submitted intake form`,
        founder: {
          id: intake._id.toString(),
          name: intake.fullName,
          startupName: intake.startupName,
          status: intake.status,
        },
      });
    });

    // Service request activities
    const allExtras = await FounderExtras.find({});
    const allIntakes = await FounderIntake.find({}).select('_id fullName startupName');
    const intakeMap = new Map(allIntakes.map((i) => [i._id.toString(), i]));

    for (const extras of allExtras) {
      const founder = intakeMap.get(extras.founderId);
      
      if (Array.isArray(extras.serviceRequests)) {
        extras.serviceRequests.forEach((request) => {
          activities.push({
            id: `service-${request.id || request.createdAt}`,
            type: 'service_request',
            urgency: request.urgency,
            timestamp: request.createdAt,
            description: `${founder?.startupName || 'Founder'} requested ${request.serviceType}`,
            founder: founder
              ? {
                  id: extras.founderId,
                  name: founder.fullName,
                  startupName: founder.startupName,
                }
              : null,
            service: {
              type: request.serviceType,
              urgency: request.urgency,
            },
          });
        });
      }

      // Success fee activities
      if (extras.successFeeRequest) {
        activities.push({
          id: `success-${extras.founderId}`,
          type: 'success_fee_request',
          timestamp: extras.successFeeRequest.createdAt,
          description: `${founder?.startupName || 'Founder'} submitted success fee request`,
          founder: founder
            ? {
                id: extras.founderId,
                name: founder.fullName,
                startupName: founder.startupName,
              }
            : null,
        });
      }

      // Marketplace activities
      if (extras.marketplaceListing) {
        activities.push({
          id: `marketplace-${extras.founderId}`,
          type: 'marketplace_listing',
          timestamp: extras.marketplaceListing.lastUpdated,
          description: `${founder?.startupName || 'Founder'} updated marketplace listing`,
          founder: founder
            ? {
                id: extras.founderId,
                name: founder.fullName,
                startupName: founder.startupName,
              }
            : null,
        });
      }
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      activities: activities.slice(0, limit),
      total: activities.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch activity log' });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Recent signups
    const [recentFounders, recentInvestors, pendingFounders] = await Promise.all([
      User.countDocuments({ role: 'founder', createdAt: { $gte: last7Days } }),
      User.countDocuments({ role: 'investor', createdAt: { $gte: last7Days } }),
      FounderIntake.countDocuments({ status: 'pending' }),
    ]);
    
    // High urgency services
    const allExtras = await FounderExtras.find({});
    let highUrgencyServices = 0;
    allExtras.forEach((extras) => {
      if (Array.isArray(extras.serviceRequests)) {
        highUrgencyServices += extras.serviceRequests.filter((r) => r.urgency === 'High').length;
      }
    });

    // Top sectors and stages
    const intakes = await FounderIntake.find({}).select('sector raiseStage');
    const sectorCounts = {};
    const stageCounts = {};
    
    intakes.forEach((founder) => {
      const sector = founder.sector || 'Uncategorized';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      
      const stage = founder.raiseStage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });
    
    const topSectors = Object.entries(sectorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([sector, count]) => ({ sector, count }));

    const summary = {
      recentActivity: {
        foundersLast7Days: recentFounders,
        investorsLast7Days: recentInvestors,
      },
      pendingActions: {
        founderApprovals: pendingFounders,
        highUrgencyServices,
      },
      insights: {
        topSectors,
        stageDistribution: Object.entries(stageCounts).map(([stage, count]) => ({
          stage,
          count,
        })),
      },
    };

    return res.status(200).json({ summary });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch dashboard summary' });
  }
};

module.exports = {
  deleteUserController,
  getActivityLog,
  getAnalytics,
  getDashboardSummary,
  getSiteMetrics,
  getUsers,
  updateUserController,
};
