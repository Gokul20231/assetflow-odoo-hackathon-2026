import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parentDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Department = mongoose.model('Department', departmentSchema);
