import { Request, Response } from "express";
import { Bid } from "../models/bid.model.js";
import { Vehicle } from "../models/vehicle.model.js";

// Create a new bid
export async function createBid(req: Request, res: Response) {
  try {
    const { vehicleId, amount, bidderId, bidderName, bidderEmail } = req.body;

    if (!vehicleId || !amount || !bidderId || !bidderName || !bidderEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Get current highest bid
    const highestBid = await Bid.findOne({ vehicleId }).sort({ amount: -1 });
    const currentPrice = highestBid ? highestBid.amount : vehicle.startingBid;

    // Validate bid amount
    if (amount <= currentPrice) {
      return res.status(400).json({
        error: `Bid must be higher than current price of ${currentPrice}`,
      });
    }

    // Create bid
    const bid = await Bid.create({
      vehicleId,
      bidderId,
      bidderName,
      bidderEmail,
      amount,
    });

    return res.status(201).json({
      message: "Bid placed successfully",
      bid: {
        id: bid._id,
        vehicleId: bid.vehicleId,
        amount: bid.amount,
        createdAt: bid.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create bid error:", error);
    return res.status(500).json({ error: error.message || "Failed to place bid" });
  }
}

// Get bids for a vehicle
export async function getVehicleBids(req: Request, res: Response) {
  try {
    const { vehicleId } = req.params;

    const bids = await Bid.find({ vehicleId }).sort({ amount: -1 });

    return res.json({
      bids: bids.map(bid => ({
        id: bid._id,
        amount: bid.amount,
        bidderName: bid.bidderName,
        createdAt: bid.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Get bids error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch bids" });
  }
}

// Get user's bids
export async function getUserBids(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const bids = await Bid.find({ bidderId: userId }).sort({ createdAt: -1 });

    // Get vehicle details for each bid
    const bidsWithVehicles = await Promise.all(
      bids.map(async (bid) => {
        const vehicle = await Vehicle.findById(bid.vehicleId);
        if (!vehicle) return null;

        // Get highest bid for this vehicle
        const highestBid = await Bid.findOne({ vehicleId: bid.vehicleId }).sort({ amount: -1 });
        const isWinning = highestBid?._id.toString() === bid._id.toString();

        return {
          id: bid._id,
          vehicleId: bid.vehicleId,
          vehicle: {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            image: vehicle.images[0],
            location: vehicle.location,
          },
          myBid: bid.amount,
          currentPrice: highestBid?.amount || vehicle.startingBid,
          status: isWinning ? "Winning" : "Outbid",
          date: bid.createdAt,
        };
      })
    );

    return res.json({
      bids: bidsWithVehicles.filter(bid => bid !== null),
    });
  } catch (error: any) {
    console.error("Get user bids error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch bids" });
  }
}
