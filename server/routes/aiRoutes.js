import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Asset } from '../models/Asset.js';
import { Booking } from '../models/Booking.js';
import { Maintenance } from '../models/Maintenance.js';

const router = express.Router();

// @route GET /api/ai/analyze
// @desc Get AI insights based on current database state
router.get('/analyze', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'GEMINI_API_KEY is missing from environment variables. Please add it to your .env file.' 
      });
    }

    // 1. Gather Data
    const totalAssets = await Asset.countDocuments();
    const allocatedAssets = await Asset.countDocuments({ status: 'Allocated' });
    const maintenanceAssets = await Asset.countDocuments({ status: 'Under Maintenance' });
    const totalBookings = await Booking.countDocuments();
    const maintenanceRequests = await Maintenance.find().sort({ createdAt: -1 }).limit(10);
    
    // Create a text summary for the AI
    const dataContext = `
      Current Organization State:
      - Total Assets: ${totalAssets}
      - Allocated Assets: ${allocatedAssets}
      - Assets Under Maintenance: ${maintenanceAssets}
      - Total Resource Bookings: ${totalBookings}
      
      Recent Maintenance Issues:
      ${maintenanceRequests.map(req => `- Priority: ${req.priority}, Issue: ${req.issueDescription}`).join('\n')}
    `;

    const prompt = `
      You are an expert Enterprise Resource Planning (ERP) analyst.
      Analyze the following data from our Asset Management System and provide a brief, professional summary of our operational health. 
      Identify any potential bottlenecks (e.g., too many assets under maintenance) and provide 3 actionable recommendations to improve efficiency.
      Format your response in Markdown with clear headings.
      
      Data:
      ${dataContext}
    `;

    // 2. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // or gemini-pro
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
