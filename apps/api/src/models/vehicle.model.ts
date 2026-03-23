import mongoose, { Schema } from "mongoose";

export interface IVehicle {
  ownerId: string;
  make: string;
  model: string;
  normalizedMake: string;
  normalizedModel: string;
  year: number;
  images: string[];
  condition: "New" | "Excellent" | "Good" | "Fair";
  category:
    | "Cars"
    | "SUVs"
    | "Vans"
    | "Motorbikes"
    | "Lorries"
    | "Three Wheels"
    | "Pickups"
    | "Heavy-Duty"
    | "Sedan"
    | "SUV"
    | "Sports"
    | "Electric"
    | "Van"
    | "Truck";
  specs: {
    mileageKm: number;
    engineCc: number;
    transmission: string;
    fuel: string;
    yearRegistered?: number;
    previousOwners?: number;
    primaryUsage?: string;
    insuranceClaims?: number;
    tireCondition?: number;
    batteryCondition?: number;
    interiorCondition?: number;
    exteriorCondition?: number;
  };
  location: string;
  description?: string;
  pricing: {
    basePrice?: number;
    startingBid: number;
    negotiationEnabled?: boolean;
  };
  auction: {
    auctionDays?: number;
    auctionEndDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    ownerId: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    normalizedMake: { type: String, required: true, lowercase: true, trim: true },
    normalizedModel: { type: String, required: true, lowercase: true, trim: true },
    year: { type: Number, required: true },
    images: { type: [String], default: [] },
    condition: {
      type: String,
      enum: ["New", "Excellent", "Good", "Fair"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Cars",
        "SUVs",
        "Vans",
        "Motorbikes",
        "Lorries",
        "Three Wheels",
        "Pickups",
        "Heavy-Duty",
        "Sedan",
        "SUV",
        "Sports",
        "Electric",
        "Van",
        "Truck",
      ],
      required: true,
    },
    specs: {
      mileageKm: { type: Number, required: true },
      engineCc: { type: Number, required: true },
      transmission: { type: String, required: true },
      fuel: { type: String, required: true },
      yearRegistered: { type: Number },
      previousOwners: { type: Number },
      primaryUsage: { type: String },
      insuranceClaims: { type: Number },
      tireCondition: { type: Number },
      batteryCondition: { type: Number },
      interiorCondition: { type: Number },
      exteriorCondition: { type: Number },
    },
    location: { type: String, required: true },
    description: { type: String },
    pricing: {
      basePrice: { type: Number },
      startingBid: { type: Number, required: true },
      negotiationEnabled: { type: Boolean, default: false },
    },
    auction: {
      auctionDays: { type: Number, default: 3 },
      auctionEndDate: { type: Date, required: true },
    },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);
