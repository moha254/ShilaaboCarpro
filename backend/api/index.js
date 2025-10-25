import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

// Example route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express + Vite + Mongo!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

export default app;
