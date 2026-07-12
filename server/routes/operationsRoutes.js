import express from 'express';
import { Booking } from '../models/Booking.js';
import { Maintenance } from '../models/Maintenance.js';
import { Asset } from '../models/Asset.js';

const router = express.Router();

// =======================
// BOOKING ROUTES
// =======================

// @route POST /api/operations/bookings
// @desc Book a shared resource with overlap validation
router.post('/bookings', async (req, res) => {
  const { resource, bookedBy, startTime, endTime, purpose } = req.body;

  try {
    const asset = await Asset.findById(resource);
    if (!asset || !asset.isSharedBookable) {
      return res.status(400).json({ message: 'Resource is not available for booking.' });
    }

    // Overlap validation logic
    const conflictingBooking = await Booking.findOne({
      resource,
      status: { $in: ['Upcoming', 'Ongoing'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Standard overlap check
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({ 
        message: 'Time slot is already booked. Please select a different time.' 
      });
    }

    const newBooking = await Booking.create({
      resource,
      bookedBy,
      startTime,
      endTime,
      purpose
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/operations/bookings/:resourceId
// @desc Get calendar bookings for a resource
router.get('/bookings/:resourceId', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      resource: req.params.resourceId,
      status: { $in: ['Upcoming', 'Ongoing', 'Completed'] }
    }).sort({ startTime: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/operations/bookings/:id
// @desc Cancel a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================
// MAINTENANCE ROUTES
// =======================

// @route POST /api/operations/maintenance
// @desc Raise a maintenance request
router.post('/maintenance', async (req, res) => {
  try {
    const maintenanceReq = await Maintenance.create(req.body);
    res.status(201).json(maintenanceReq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route PUT /api/operations/maintenance/:id/approve
// @desc Approve a maintenance request and flip asset status
router.put('/maintenance/:id/approve', async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'Approved';
    // For MVP, bypassing real user auth context and using a mock admin ID
    request.approvedBy = req.body.approvedBy || '60d21b4667d0d8992e610c85'; 
    await request.save();

    // Flip asset status to 'Under Maintenance'
    const asset = await Asset.findById(request.asset);
    if (asset) {
      asset.status = 'Under Maintenance';
      await asset.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/operations/maintenance/:id/resolve
// @desc Resolve maintenance and flip asset status back
router.put('/maintenance/:id/resolve', async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'Resolved';
    request.resolutionNotes = req.body.resolutionNotes;
    request.resolvedDate = new Date();
    await request.save();

    // Flip asset status back to 'Available'
    const asset = await Asset.findById(request.asset);
    if (asset) {
      asset.status = 'Available';
      await asset.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
