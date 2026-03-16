import mongoose, { type Document } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  walletBalance: number;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

export const User = mongoose.model<IUser>("User", userSchema);