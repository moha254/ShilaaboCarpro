import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Example: login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@admin.com' && password === '123456') {
    return res.json({ token: 'demo-token' });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

export default app;
