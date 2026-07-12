import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  allocatedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  allocatedToDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Asset Manager who approved
  allocationDate: { type: Date, default: Date.now },
  expectedReturnDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Active', 'Returned', 'Transfer Pending'],
    default: 'Active'
  },
  returnDate: { type: Date },
  returnCondition: { type: String },
  returnNotes: { type: String }
}, { timestamps: true });

export const Allocation = mongoose.model('Allocation', allocationSchema);
