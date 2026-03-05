import mongoose from "mongoose";

export type UserRole = "user" | "admin";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    walletBalance: { type: Number, default: 5000 },
    favorites: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);