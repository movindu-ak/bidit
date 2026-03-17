import type { Response } from "express";
import { User } from "../models/user.model.js";
import type { AuthRequest } from "../middleware/requireAuth.js";

export async function getMyFavorites(req: AuthRequest, res: Response) {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ favorites: user.favorites ?? [] });
  } catch (error: any) {
    console.error("Get favorites error:", error);
    return res.status(500).json({ error: error?.message || "Failed to fetch favorites" });
  }
}

export async function addFavorite(req: AuthRequest, res: Response) {
  try {
    const uid = req.user?.uid;
    const vehicleIdParam = req.params.vehicleId;
    const vehicleId = Array.isArray(vehicleIdParam) ? vehicleIdParam[0] : vehicleIdParam;

    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!vehicleId) {
      return res.status(400).json({ error: "vehicleId is required" });
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.favorites.includes(vehicleId)) {
      user.favorites.push(vehicleId);
      await user.save();
    }

    return res.status(200).json({ favorites: user.favorites });
  } catch (error: any) {
    console.error("Add favorite error:", error);
    return res.status(500).json({ error: error?.message || "Failed to add favorite" });
  }
}

export async function removeFavorite(req: AuthRequest, res: Response) {
  try {
    const uid = req.user?.uid;
    const vehicleIdParam = req.params.vehicleId;
    const vehicleId = Array.isArray(vehicleIdParam) ? vehicleIdParam[0] : vehicleIdParam;

    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!vehicleId) {
      return res.status(400).json({ error: "vehicleId is required" });
    }

    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favorites = user.favorites.filter((id) => id !== vehicleId);
    await user.save();

    return res.status(200).json({ favorites: user.favorites });
  } catch (error: any) {
    console.error("Remove favorite error:", error);
    return res.status(500).json({ error: error?.message || "Failed to remove favorite" });
  }
}
