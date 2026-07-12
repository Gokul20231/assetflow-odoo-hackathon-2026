import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'Allocated', 'Approved', 'Registered'
  targetType: { type: String, required: true }, // e.g., 'Asset', 'Booking', 'Maintenance'
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: String, required: true }
}, { timestamps: true });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
