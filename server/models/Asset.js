import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assetTag: { type: String, required: true, unique: true }, // e.g. AF-0001
  category: { type: String, required: true }, // from Categories (could be ref, using string for MVP)
  serialNumber: { type: String },
  acquisitionDate: { type: Date },
  acquisitionCost: { type: Number },
  condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor', 'Damaged'], default: 'Good' },
  location: { type: String },
  isSharedBookable: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'],
    default: 'Available'
  }
}, { timestamps: true });

export const Asset = mongoose.model('Asset', assetSchema);
