import User from '../models/User.js';
import Report from '../models/Report.js';
import Emergency from '../models/Emergency.js';

export async function me(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
      });
    }

    const user = await User.findById(req.user.id).select('-__v');

    res.json({
      success: true,
      data: user,
    });
  } catch (e) {
    next(e);
  }
}

export async function adminStats(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        data: {
          totalUsers: 0,
          totalReports: 0,
          pendingReports: 0,
          activeEmergencies: 0,
        },
      });
    }

    const [
      totalUsers,
      totalReports,
      pendingReports,
      activeEmergencies,
    ] = await Promise.all([
      User.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({
        status: {
          $in: ['pending', 'Pending'],
        },
      }),
      Emergency.countDocuments({
        status: 'active',
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalReports,
        pendingReports,
        activeEmergencies,
      },
    });
  } catch (e) {
    next(e);
  }
}

/* ================= ADMIN USERS ================= */

export async function adminUsers(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const users = await User.find()
      .select('-password -otp -otpExpiresAt -__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (e) {
    next(e);
  }
}