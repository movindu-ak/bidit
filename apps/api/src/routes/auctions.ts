import { Router } from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getMyVehicles,
} from "../controllers/auctions.controller.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", getAllVehicles);

// ✅ put /owner BEFORE /:id
router.get("/owner/:ownerId", requireAuth, getMyVehicles);

router.get("/:id", getVehicleById);

// ✅ protect write routes
router.post("/", requireAuth, createVehicle);
router.put("/:id", requireAuth, updateVehicle);
router.delete("/:id", requireAuth, deleteVehicle);

export default router;