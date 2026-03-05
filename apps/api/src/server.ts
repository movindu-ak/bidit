import dotenv from "dotenv";
dotenv.config();

import "./config/firebase.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRouter from "./routes/auth.js";
import auctionsRouter from "./routes/auctions.js";
import bidsRouter from "./routes/bids.js";
import healthRouter from "./routes/health.js"; // ✅ only if you created health.ts

const app = express(); // ✅ MUST be before any app.use/app.get

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// ✅ Health (choose ONE)
app.use("/api/health", healthRouter); // if you created routes/health.ts
// OR if you don't want health.ts, comment above and use below:
// app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "bidit-backend" }));

// Mount routes
app.use("/api/auth", authRouter);
app.use("/api/vehicles", auctionsRouter);
app.use("/api/bids", bidsRouter);

const PORT = Number(process.env.PORT || 4000);

async function start() {
  await connectDB();
  console.log("✅ MongoDB connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start:", err);
  process.exit(1);
});