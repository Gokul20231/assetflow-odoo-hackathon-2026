import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import operationsRoutes from './routes/operationsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import orgRoutes from './routes/orgRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/assetflow')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/org', orgRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'AssetFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
