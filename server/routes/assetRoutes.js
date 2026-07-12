import express from 'express';
import { Asset } from '../models/Asset.js';
import { Allocation } from '../models/Allocation.js';

const router = express.Router();

// @route GET /api/assets
// @desc Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/assets
// @desc Register a new asset
router.post('/', async (req, res) => {
  try {
    // Generate a simple asset tag if not provided
    let assetTag = req.body.assetTag;
    if (!assetTag) {
      const count = await Asset.countDocuments();
      assetTag = `AF-${(count + 1).toString().padStart(4, '0')}`;
    }

    const asset = new Asset({
      ...req.body,
      assetTag
    });

    const createdAsset = await asset.save();
    res.status(201).json(createdAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route POST /api/assets/:id/allocate
// @desc Allocate an asset
router.post('/:id/allocate', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.status === 'Allocated') {
      return res.status(400).json({ 
        message: 'Asset is already allocated. A transfer request is required.' 
      });
    }

    const { allocatedToUser, allocatedToDepartment, expectedReturnDate } = req.body;
    
    // For MVP, bypassing real user auth context and using a mock admin ID
    const allocatedBy = req.body.allocatedBy || '60d21b4667d0d8992e610c85'; 

    const allocation = new Allocation({
      asset: asset._id,
      allocatedToUser,
      allocatedToDepartment,
      allocatedBy,
      expectedReturnDate
    });

    await allocation.save();

    // Update asset status
    asset.status = 'Allocated';
    await asset.save();

    res.status(201).json(allocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
