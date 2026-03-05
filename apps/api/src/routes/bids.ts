import { Router } from "express";

const router = Router();

// ✅ simple test route (so backend won't crash)
router.get("/", (_req, res) => {
  res.json({ ok: true, message: "bids route working" });
});

export default router;