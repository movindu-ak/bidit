import dotenv from "dotenv";
dotenv.config();

import "./config/firebase.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "bidit-backend" });
});

const PORT = Number(process.env.PORT || 4000);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ MongoDB connected`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start:", err);
  process.exit(1);
});