import mongoose from 'mongoose';

const auditCycleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  departmentScope: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  auditors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['Scheduled', 'In Progress', 'Closed'],
    default: 'Scheduled'
  },
  findings: [{
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    statusMarked: { type: String, enum: ['Verified', 'Missing', 'Damaged'] },
    notes: { type: String }
  }]
}, { timestamps: true });

export const AuditCycle = mongoose.model('AuditCycle', auditCycleSchema);
