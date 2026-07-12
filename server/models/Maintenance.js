import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDescription: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  technicianAssigned: { type: String },
  resolutionNotes: { type: String },
  photoUrl: { type: String }, // Optional attachment
  resolvedDate: { type: Date }
}, { timestamps: true });

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
