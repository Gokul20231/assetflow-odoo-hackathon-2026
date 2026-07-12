import express from 'express';
import { Asset } from '../models/Asset.js';
import { Allocation } from '../models/Allocation.js';
import { Booking } from '../models/Booking.js';
import { Maintenance } from '../models/Maintenance.js';
import { ActivityLog } from '../models/ActivityLog.js';

const router = express.Router();

// @route GET /api/dashboard/kpi
// @desc Get KPI statistics for the dashboard
router.get('/kpi', async (req, res) => {
  try {
    const assetsAvailable = await Asset.countDocuments({ status: 'Available' });
    const assetsAllocated = await Asset.countDocuments({ status: 'Allocated' });
    
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    
    const maintenanceToday = await Maintenance.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const activeBookings = await Booking.countDocuments({ status: 'Ongoing' });
    
    // Check for overdue returns (past expectedReturnDate)
    const overdueReturns = await Allocation.countDocuments({
      status: 'Active',
      expectedReturnDate: { $lt: new Date() }
    });

    res.json({
      assetsAvailable,
      assetsAllocated,
      maintenanceToday,
      activeBookings,
      overdueReturns,
      upcomingReturns: 0 // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/dashboard/logs
// @desc Get recent activity logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'fullName role')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
