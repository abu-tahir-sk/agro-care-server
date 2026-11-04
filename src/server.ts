import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './modules/auth.routes';
import productRoutes from './modules/product.routes';
import orderRoutes from './modules/order.routes';
import cropDoctorRoutes from './modules/crop-doctor.routes';
import inventoryRoutes from './modules/inventory.routes';
import licenseRoutes from './modules/license.routes';
import analyticsRoutes from './modules/analytics.routes';
import agronomyRoutes from './modules/agronomy.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// System Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'AgroCare Agritech & B2B2C Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: [
      'auth',
      'products',
      'orders',
      'crop-doctor',
      'inventory (FEFO)',
      'licenses & compliance',
      'analytics',
      'services',
    ],
  });
});

// Mount Master API Architecture (/api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/crop-doctor', cropDoctorRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/licenses', licenseRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/services', agronomyRoutes);

app.listen(PORT, () => {
  console.log(`🌾 AgroCare Backend API Server running on port ${PORT}`);
  console.log(`📡 Base URL: http://localhost:${PORT}/api/v1`);
});
