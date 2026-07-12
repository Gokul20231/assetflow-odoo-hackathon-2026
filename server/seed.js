import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Department } from './models/Department.js';
import { Asset } from './models/Asset.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/assetflow');
    console.log('MongoDB connected for seeding');

    // Clear existing
    await User.deleteMany();
    await Department.deleteMany();
    await Asset.deleteMany();

    // 1. Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      fullName: 'System Admin',
      email: 'admin@assetflow.com',
      password: hashedPassword,
      role: 'Admin'
    });
    
    // We update password manually because pre-save hook will hash it again if we pass raw password above.
    // Actually, passing raw password to create() triggers the pre-save hook. So we should NOT pre-hash it here if the schema does it.
    // Let's rely on the schema hook.
    await User.deleteMany(); // Reset
    const realAdmin = await User.create({
      fullName: 'System Admin',
      email: 'admin@assetflow.com',
      password: 'password', // will be hashed by pre-save
      role: 'Admin'
    });

    console.log('Admin user created:', realAdmin.email, 'password: password');

    // 2. Create sample department
    const dept = await Department.create({
      name: 'Engineering',
      description: 'Software and Hardware engineering'
    });

    // 3. Create sample assets
    await Asset.create({
      name: 'MacBook Pro M2',
      assetTag: 'AF-0001',
      category: 'Electronics',
      status: 'Available',
      location: 'HQ - IT Room'
    });
    
    await Asset.create({
      name: 'Ergonomic Chair',
      assetTag: 'AF-0002',
      category: 'Furniture',
      status: 'Available',
      location: 'Floor 2'
    });

    console.log('Sample data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
