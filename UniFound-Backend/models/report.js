import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['overview', 'users', 'categories', 'claims'],
    trim: true
  },
  format: {
    type: String,
    required: true,
    enum: ['excel', 'csv'],
    trim: true
  },
  dateRange: {
    type: String,
    required: true,
    enum: ['today', 'week', 'month', 'quarter', 'year', 'custom'],
    trim: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  filePath: {
    type: String,
    trim: true
  },
  fileSize: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  emailRecipients: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduleFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    default: null
  },
  nextScheduledRun: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reportSchema.index({ type: 1, generatedAt: -1 });
reportSchema.index({ generatedBy: 1, generatedAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ isScheduled: 1, nextScheduledRun: 1 });

// Static method to get system overview data
reportSchema.statics.getSystemOverviewData = async function() {
  try {
    // Use correct model names and field names based on actual database schema
    const User = mongoose.model('User');
    const Item = mongoose.model('item'); // Note: lowercase 'item' from the actual model
    const Claim = mongoose.model('Claim');
    const Ticket = mongoose.model('Ticket');

    const [
      totalUsers,
      totalItems,
      foundItems,
      pendingClaims,
      approvedClaims,
      openTickets,
      inProgressTickets
    ] = await Promise.all([
      User.countDocuments({ isBlocked: false }), // Active users are not blocked
      Item.countDocuments({ isDeleted: false }), // Total items (not deleted)
      Item.countDocuments({ status: 'found', isDeleted: false }), // Found items
      Claim.countDocuments({ status: 'Pending', isDeleted: false }),
      Claim.countDocuments({ status: 'Approved', isDeleted: false }),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'In Progress' })
    ]);

    return {
      totalUsers,
      totalItems,
      foundItems,
      activeClaims: pendingClaims + approvedClaims, // Total active claims
      pendingClaims,
      approvedClaims,
      openTickets: openTickets + inProgressTickets, // Total open tickets
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Error fetching system overview data: ${error.message}`);
  }
};

// Static method to get user activity data
reportSchema.statics.getUserActivityData = async function(dateRange = 'month') {
  try {
    const User = mongoose.model('User');
    const Item = mongoose.model('item'); // Using lowercase 'item' as per actual model
    const Claim = mongoose.model('Claim');

    // Calculate date range based on selection
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    const [
      userRegistrations,
      activeUsers,
      adminUsers,
      suspendedUsers,
      allUsers,
      allItems,
      allClaims
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ lastLogin: { $gte: startDate }, isBlocked: false }),
      User.countDocuments({ type: 'admin', isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      User.find({}).select('firstName lastName email _id createdAt lastLogin type isBlocked'),
      Item.find({ createdAt: { $gte: startDate } }).select('user_id _id createdAt status'),
      Claim.find({ createdAt: { $gte: startDate } }).select('userId _id createdAt status')
    ]);

    // Calculate user activity
    const userActivity = allUsers.map(user => {
      const userIdStr = user._id.toString();
      
      // Count items and claims for this user
      const itemsPosted = allItems.filter(item => item.user_id === user.email || item.user_id === user._id.toString()).length;
      const claimsMade = allClaims.filter(claim => claim.userId === user.email || claim.userId === user._id.toString()).length;
      
      return {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        registrationDate: user.createdAt,
        lastLogin: user.lastLogin,
        role: user.type || 'customer',
        status: user.isBlocked ? 'suspended' : 'active',
        itemsPosted,
        claimsMade,
        totalActivity: itemsPosted + claimsMade
      };
    });

    // Get top performers by total activity
    const topPerformers = userActivity
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 10);

    // Calculate user category breakdown
    const userCategories = {
      totalUsers: allUsers.length,
      activeUsers: activeUsers,
      adminUsers: adminUsers,
      suspendedUsers: suspendedUsers,
      regularUsers: allUsers.filter(user => user.type !== 'admin' && !user.isBlocked).length,
      inactiveUsers: allUsers.filter(user => !user.lastLogin || user.lastLogin < startDate).length
    };

    // Activity by user role
    const activityByRole = {
      admin: userActivity.filter(user => user.role === 'admin'),
      customer: userActivity.filter(user => user.role === 'customer'),
      suspended: userActivity.filter(user => user.status === 'suspended')
    };

    return {
      dateRange,
      period: {
        start: startDate,
        end: now
      },
      userCategories,
      activityByRole,
      userRegistrations,
      activeUsers,
      adminUsers,
      suspendedUsers,
      topPerformers,
      userActivity,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Error fetching user activity data: ${error.message}`);
  }
};

// Static method to get categories report data
reportSchema.statics.getCategoriesReportData = async function(dateRange = 'month') {
  try {
    const Category = mongoose.model('Category');
    const Item = mongoose.model('Item');

    // Calculate date range based on selection
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const [
      allCategories,
      allItems,
      recentItems
    ] = await Promise.all([
      Category.find({}),
      Item.find({}),
      Item.find({ createdAt: { $gte: startDate } })
    ]);

    // Calculate category distribution
    const categoryDistribution = allCategories.map(category => {
      const categoryItems = allItems.filter(item => 
        item.categoryId?.toString() === category._id.toString()
      );
      const recentCategoryItems = recentItems.filter(item => 
        item.categoryId?.toString() === category._id.toString()
      );
      const unclaimedItems = categoryItems.filter(item => 
        item.status === 'found' && !item.claimed
      );
      const claimedItems = categoryItems.filter(item => 
        item.status === 'claimed'
      );

      return {
        categoryId: category._id,
        categoryName: category.name,
        description: category.description || '',
        isActive: category.isActive,
        totalItems: categoryItems.length,
        recentItems: recentCategoryItems.length,
        unclaimedItems: unclaimedItems.length,
        claimedItems: claimedItems.length,
        itemCount: category.itemCount || 0,
        claimRate: categoryItems.length > 0 
          ? Math.round((claimedItems.length / categoryItems.length) * 100) 
          : 0
      };
    });

    // Calculate summary statistics
    const totalItems = allItems.length;
    const totalRecentItems = recentItems.length;
    const activeCategories = allCategories.filter(cat => cat.isActive).length;
    const inactiveCategories = allCategories.filter(cat => !cat.isActive).length;
    const categoriesWithItems = categoryDistribution.filter(cat => cat.totalItems > 0).length;
    const emptyCategories = categoryDistribution.filter(cat => cat.totalItems === 0).length;

    return {
      dateRange,
      period: {
        start: startDate,
        end: now
      },
      categorySummary: {
        totalCategories: allCategories.length,
        activeCategories,
        inactiveCategories,
        categoriesWithItems,
        emptyCategories,
        totalItems,
        totalRecentItems
      },
      categoryDistribution,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Error fetching categories report data: ${error.message}`);
  }
};

// Static method to get claims report data
reportSchema.statics.getClaimsReportData = async function() {
  try {
    const Claim = mongoose.model('Claim');
    const Item = mongoose.model('Item');

    const [
      allClaims,
      allItems
    ] = await Promise.all([
      Claim.find({}),
      Item.find({})
    ]);

    // Calculate claims metrics
    const approvedClaims = allClaims.filter(claim => claim.status === 'approved');
    const rejectedClaims = allClaims.filter(claim => claim.status === 'rejected');
    const pendingClaims = allClaims.filter(claim => claim.status === 'pending');

    const approvalRate = allClaims.length > 0 
      ? Math.round((approvedClaims.length / allClaims.length) * 100)
      : 0;

    const rejectionRate = allClaims.length > 0 
      ? Math.round((rejectedClaims.length / allClaims.length) * 100)
      : 0;

    // Calculate processing times
    const processedClaims = [...approvedClaims, ...rejectedClaims].filter(claim => 
      claim.processedAt && claim.createdAt
    );
    
    const processingTimes = processedClaims.map(claim => {
      const created = new Date(claim.createdAt);
      const processed = new Date(claim.processedAt);
      return Math.floor((processed - created) / (1000 * 60 * 60 * 24)); // days
    });

    const avgProcessingTime = processingTimes.length > 0 
      ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
      : 0;

    // Calculate rejection reasons
    const rejectionReasons = rejectedClaims.reduce((acc, claim) => {
      const reason = claim.rejectionReason || 'No reason provided';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

    return {
      totalClaims: allClaims.length,
      approvedClaims: approvedClaims.length,
      rejectedClaims: rejectedClaims.length,
      pendingClaims: pendingClaims.length,
      approvalRate,
      rejectionRate,
      avgProcessingTime,
      rejectionReasons,
      generatedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Error fetching claims report data: ${error.message}`);
  }
};

const Report = mongoose.model('Report', reportSchema);

export default Report;
