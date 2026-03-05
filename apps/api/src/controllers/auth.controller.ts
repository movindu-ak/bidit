import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import admin from "../config/firebase.js";

/* =========================
   SIGNUP
========================= */
export async function signup(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const { displayName } = req.body as { displayName?: string };

    if (!displayName) {
      return res.status(400).json({ error: "displayName is required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const existing = await User.findOne({
      firebaseUid: decodedToken.uid,
    });

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const photoURL = (decodedToken as any).picture || null;

    const user = await User.create({
      firebaseUid: decodedToken.uid,
      email: decodedToken.email ?? null,
      displayName,
      photoURL,
      role: "user",
      walletBalance: 0,
      favorites: [],
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: err?.message || "Signup failed" });
  }
}

/* =========================
   LOGIN (Firebase only verifies token)
========================= */
export async function login(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({
      firebaseUid: decodedToken.uid,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err?.message || "Login failed" });
  }
}

/* =========================
   ME (Get current user)
========================= */
export async function me(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const user = await User.findOne({
      firebaseUid: decodedToken.uid,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err: any) {
    console.error("Me error:", err);
    return res.status(500).json({ error: err?.message || "Failed to fetch user" });
  }
}