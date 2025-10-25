import dotenv from 'dotenv';
dotenv.config(); // must come first!

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { createDemoUsers } from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

connectDB(); // uses MONGO_URI from .env
createDemoUsers(); // create demo users on startup

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: [
    'http://localhost:5173', // Default Vite dev server
    'http://localhost:3000', // Common React dev server
    'http://127.0.0.1:5173', // Alternative localhost
    'http://127.0.0.1:3000', // Alternative localhost
    // Add your production domain here when deploying
  ],
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => res.send('🚗 Car Hire Management API Running!'));
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
