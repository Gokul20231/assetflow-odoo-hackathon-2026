import express from 'express';
import { Department } from '../models/Department.js';
import { User } from '../models/User.js';
// Assuming we don't have a specific Category model yet, we can just use an array or a new model. Let's create a quick model here or just fetch distinct categories from Asset.
import { Asset } from '../models/Asset.js';

const router = express.Router();

// DEPARTMENTS
router.get('/departments', async (req, res) => {
  try {
    const deps = await Department.find();
    res.json(deps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const dep = await Department.create(req.body);
    res.status(201).json(dep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// EMPLOYEES (DIRECTORY)
router.get('/employees', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Role
router.put('/employees/:id/role', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.role = req.body.role; // e.g., 'Department Head', 'Asset Manager'
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CATEGORIES
router.get('/categories', async (req, res) => {
  try {
    // For MVP, just get unique categories from existing assets
    const categories = await Asset.distinct('category');
    res.json(categories.length > 0 ? categories : ['Electronics', 'Furniture', 'Vehicles']);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
