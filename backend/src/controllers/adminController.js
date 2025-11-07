const store = require('../data/store');
const { getAllUsers, updateUser, deleteUser } = require('../models/userModel');

const getUsers = (req, res) => res.status(200).json({ items: getAllUsers() });

const updateUserController = (req, res) => {
  try {
    const { id } = req.params;
    const { role, organization, notes } = req.body || {};
    const updates = {};
    if (role) updates.role = role;
    if (organization) updates.organization = organization;
    if (notes) updates.notes = notes;
    const user = updateUser(id, updates);
    return res.status(200).json({ item: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUserController = (req, res) => {
  try {
    const user = deleteUser(req.params.id);
    return res.status(200).json({ item: user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getSiteMetrics = (req, res) => {
  const metrics = {
    totalUsers: store.users.length,
    investors: store.users.filter((user) => user.role === 'investor').length,
    founders: store.users.filter((user) => user.role === 'founder').length,
    admins: store.users.filter((user) => user.role === 'admin').length,
    portfolioCompanies: store.portfolio.length,
    testimonials: store.testimonials.length,
    faqs: store.faqs.length,
  };

  return res.status(200).json({ metrics });
};

const getAnalytics = (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User analytics
    const recentFounders = store.users.filter(
      (u) => u.role === 'founder' && new Date(u.createdAt) >= last30Days
    );
    const recentInvestors = store.users.filter(
      (u) => u.role === 'investor' && new Date(u.createdAt) >= last30Days
    );

    // Founder intake analytics
    const pendingIntakes = store.founderIntakes.filter((f) => f.status === 'pending');
    const approvedIntakes = store.founderIntakes.filter((f) => f.status === 'approved');
    const recentIntakes = store.founderIntakes.filter(
      (f) => new Date(f.createdAt) >= last7Days
    );

    // Service request analytics
    let totalServiceRequests = 0;
    let highUrgencyRequests = 0;
    let successFeeRequests = 0;
    let marketplaceListings = 0;
    let recentServiceRequests = 0;

    Object.values(store.founderExtras || {}).forEach((extras) => {
      if (Array.isArray(extras.serviceRequests)) {
        totalServiceRequests += extras.serviceRequests.length;
        highUrgencyRequests += extras.serviceRequests.filter(
          (r) => r.urgency === 'High'
        ).length;
        recentServiceRequests += extras.serviceRequests.filter(
          (r) => new Date(r.createdAt) >= last7Days
        ).length;
      }
      if (extras.successFeeRequest) successFeeRequests++;
      if (extras.marketplaceListing) marketplaceListings++;
    });

    // Calculate revenue metrics (mock calculations based on service requests)
    const estimatedRevenue = {
      services: totalServiceRequests * 2500, // Avg $2.5k per service
      successFees: successFeeRequests * 50000, // Avg $50k per success fee engagement
      marketplace: marketplaceListings * 5000, // Avg $5k per listing
    };

    const analytics = {
      users: {
        total: store.users.length,
        founders: store.users.filter((u) => u.role === 'founder').length,
        investors: store.users.filter((u) => u.role === 'investor').length,
        admins: store.users.filter((u) => u.role === 'admin').length,
        growth: {
          last30Days: recentFounders.length + recentInvestors.length,
          foundersLast30Days: recentFounders.length,
          investorsLast30Days: recentInvestors.length,
        },
      },
      founderIntakes: {
        total: store.founderIntakes.length,
        pending: pendingIntakes.length,
        approved: approvedIntakes.length,
        recentLast7Days: recentIntakes.length,
        conversionRate:
          store.founderIntakes.length > 0
            ? ((approvedIntakes.length / store.founderIntakes.length) * 100).toFixed(1)
            : 0,
      },
      services: {
        totalRequests: totalServiceRequests,
        highUrgency: highUrgencyRequests,
        successFeeRequests,
        marketplaceListings,
        recentLast7Days: recentServiceRequests,
        averagePerFounder: (
          totalServiceRequests /
          Math.max(store.founderIntakes.length, 1)
        ).toFixed(1),
      },
      revenue: {
        estimated: {
          services: estimatedRevenue.services,
          successFees: estimatedRevenue.successFees,
          marketplace: estimatedRevenue.marketplace,
          total:
            estimatedRevenue.services +
            estimatedRevenue.successFees +
            estimatedRevenue.marketplace,
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
        activeFounders: Object.keys(store.founderExtras || {}).filter((founderId) => {
          const extras = store.founderExtras[founderId];
          return (
            (Array.isArray(extras?.serviceRequests) && extras.serviceRequests.length > 0) ||
            extras?.successFeeRequest ||
            extras?.marketplaceListing
          );
        }).length,
        engagementRate: (
          (Object.keys(store.founderExtras || {}).filter((founderId) => {
            const extras = store.founderExtras[founderId];
            return Array.isArray(extras?.serviceRequests) && extras.serviceRequests.length > 0;
          }).length /
            Math.max(store.founderIntakes.length, 1)) *
          100
        ).toFixed(1),
      },
    };

    return res.status(200).json({ analytics });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to fetch analytics' });
  }
};

const getActivityLog = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = [];

    // User activities
    store.users
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20)
      .forEach((user) => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_registration',
          role: user.role,
          timestamp: user.createdAt,
          description: `${user.fullName} registered as ${user.role}`,
          user: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
          },
        });
      });

    // Founder intake activities
    store.founderIntakes
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20)
      .forEach((intake) => {
        activities.push({
          id: `intake-${intake.id}`,
          type: 'founder_intake',
          status: intake.status,
          timestamp: intake.createdAt,
          description: `${intake.startupName} submitted intake form`,
          founder: {
            id: intake.id,
            name: intake.fullName,
            startupName: intake.startupName,
            status: intake.status,
          },
        });
      });

    // Service request activities
    Object.entries(store.founderExtras || {}).forEach(([founderId, extras]) => {
      const founder = store.founderIntakes.find((f) => f.id === founderId);
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
                  id: founderId,
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
          id: `success-${founderId}`,
          type: 'success_fee_request',
          timestamp: extras.successFeeRequest.createdAt,
          description: `${founder?.startupName || 'Founder'} submitted success fee request`,
          founder: founder
            ? {
                id: founderId,
                name: founder.fullName,
                startupName: founder.startupName,
              }
            : null,
        });
      }

      // Marketplace activities
      if (extras.marketplaceListing) {
        activities.push({
          id: `marketplace-${founderId}`,
          type: 'marketplace_listing',
          timestamp: extras.marketplaceListing.lastUpdated,
          description: `${founder?.startupName || 'Founder'} updated marketplace listing`,
          founder: founder
            ? {
                id: founderId,
                name: founder.fullName,
                startupName: founder.startupName,
              }
            : null,
        });
      }
    });

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

const getDashboardSummary = (req, res) => {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Recent signups
    const recentFounders = store.users.filter(
      (u) => u.role === 'founder' && new Date(u.createdAt) >= last7Days
    );
    const recentInvestors = store.users.filter(
      (u) => u.role === 'investor' && new Date(u.createdAt) >= last7Days
    );

    // Pending actions
    const pendingFounders = store.founderIntakes.filter((f) => f.status === 'pending');
    
    let highUrgencyServices = 0;
    Object.values(store.founderExtras || {}).forEach((extras) => {
      if (Array.isArray(extras.serviceRequests)) {
        highUrgencyServices += extras.serviceRequests.filter((r) => r.urgency === 'High').length;
      }
    });

    // Top sectors
    const sectorCounts = {};
    store.founderIntakes.forEach((founder) => {
      const sector = founder.sector || 'Uncategorized';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    const topSectors = Object.entries(sectorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([sector, count]) => ({ sector, count }));

    // Raise stages distribution
    const stageCounts = {};
    store.founderIntakes.forEach((founder) => {
      const stage = founder.raiseStage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    const summary = {
      recentActivity: {
        foundersLast7Days: recentFounders.length,
        investorsLast7Days: recentInvestors.length,
      },
      pendingActions: {
        founderApprovals: pendingFounders.length,
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
