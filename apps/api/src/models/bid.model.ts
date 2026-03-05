import mongoose, { Schema, Document } from "mongoose";

export interface IBid extends Document {
  vehicleId: string;
  bidderId: string;
  bidderName: string;
  bidderEmail: string;
  amount: number;
  createdAt: Date;
}

const BidSchema = new Schema<IBid>(
  {
    vehicleId: { type: String, required: true, index: true },
    bidderId: { type: String, required: true, index: true },
    bidderName: { type: String, required: true },
    bidderEmail: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Index for finding highest bid for a vehicle
BidSchema.index({ vehicleId: 1, amount: -1 });

export const Bid = mongoose.model<IBid>("Bid", BidSchema);
