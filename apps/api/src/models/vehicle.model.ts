import mongoose, { Schema } from "mongoose";

export interface IVehicle {
  ownerId: string;
  make: string;
  model: string;
  year: number;
  images: string[];
  condition: "New" | "Excellent" | "Good" | "Fair";
  category: "Sedan" | "SUV" | "Sports" | "Electric" | "Van" | "Truck";
  specs: {
    mileage: string;
    engine: string;
    transmission: string;
    fuel: string;
  };
  location: string;
  description?: string;
  basePrice?: number;       // seller's stated market value
  startingBid: number;     // confirmed auction opening bid
  negotiationEnabled?: boolean;
  auctionDays?: number;
  auctionEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    ownerId: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    images: { type: [String], default: [] },
    condition: {
      type: String,
      enum: ["New", "Excellent", "Good", "Fair"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Sedan", "SUV", "Sports", "Electric", "Van", "Truck"],
      required: true,
    },
    specs: {
      mileage: { type: String, required: true },
      engine: { type: String, required: true },
      transmission: { type: String, required: true },
      fuel: { type: String, required: true },
    },
    location: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number },
    startingBid: { type: Number, required: true },
    negotiationEnabled: { type: Boolean, default: false },
    auctionDays: { type: Number, default: 3 },
    auctionEndDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
