import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../controllers/favorites.controller.js";

const router = Router();

router.get("/", requireAuth, getMyFavorites);
router.post("/:vehicleId", requireAuth, addFavorite);
router.delete("/:vehicleId", requireAuth, removeFavorite);

export default router;
