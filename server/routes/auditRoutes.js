import express from 'express';
import { AuditCycle } from '../models/Audit.js';
import { Asset } from '../models/Asset.js';

const router = express.Router();

// @route POST /api/audits
// @desc Create a new audit cycle
router.post('/', async (req, res) => {
  try {
    const cycle = await AuditCycle.create(req.body);
    res.status(201).json(cycle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route PUT /api/audits/:id/close
// @desc Close an audit cycle and generate discrepancy reports internally
router.put('/:id/close', async (req, res) => {
  try {
    const cycle = await AuditCycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ message: 'Audit Cycle not found' });

    cycle.status = 'Closed';
    
    // Iterate through findings and update asset statuses if missing
    for (let finding of cycle.findings) {
      if (finding.statusMarked === 'Missing') {
        const asset = await Asset.findById(finding.asset);
        if (asset) {
          asset.status = 'Lost';
          await asset.save();
        }
      }
    }

    await cycle.save();
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
