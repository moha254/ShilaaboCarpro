import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login route working!' });
});

export default app;
