import { Router } from "express";
import {
  createBid,
  getVehicleBids,
  getUserBids,
} from "../controllers/bids.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/", requireAuth, createBid);
router.get("/vehicle/:vehicleId", getVehicleBids);
router.get("/user/:userId", getUserBids);

export default router;