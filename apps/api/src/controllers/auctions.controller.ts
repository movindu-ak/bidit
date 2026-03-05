import { Request, Response } from "express";
import { Vehicle } from "../models/vehicle.model.js";
import { Bid } from "../models/bid.model.js";

// Get all vehicles/auctions
export async function getAllVehicles(req: Request, res: Response) {
  try {
    const { make, condition, minPrice, maxPrice } = req.query;
    
    const filter: any = {};
    
    if (make && make !== "Any Make") filter.make = make;
    if (condition && condition !== "Any Condition") filter.condition = condition;
    if (minPrice) filter.startingBid = { ...filter.startingBid, $gte: Number(minPrice) };
    if (maxPrice) filter.startingBid = { ...filter.startingBid, $lte: Number(maxPrice) };

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

    // Get bid counts and current prices for each vehicle
    const vehiclesWithBids = await Promise.all(
      vehicles.map(async (vehicle) => {
        const bids = await Bid.find({ vehicleId: vehicle._id.toString() }).sort({ amount: -1 });
        const highestBid = bids[0];
        
        return {
          id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.images[0] || "",
          images: vehicle.images,
          basePrice: vehicle.startingBid,
          currentPrice: highestBid ? highestBid.amount : vehicle.startingBid,
          startingBid: vehicle.startingBid,
          bidsCount: bids.length,
          location: vehicle.location,
          condition: vehicle.condition,
          category: vehicle.category,
          specs: vehicle.specs,
          description: vehicle.description,
          endingAt: vehicle.auctionEndDate,
          ownerId: vehicle.ownerId,
        };
      })
    );

    return res.json({ vehicles: vehiclesWithBids });
  } catch (error: any) {
    console.error("Get vehicles error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch vehicles" });
  }
}

// Get single vehicle by ID
export async function getVehicleById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const bids = await Bid.find({ vehicleId: id }).sort({ amount: -1 });
    const highestBid = bids[0];

    return res.json({
      vehicle: {
        id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        images: vehicle.images,
        basePrice: vehicle.startingBid,
        currentPrice: highestBid ? highestBid.amount : vehicle.startingBid,
        startingBid: vehicle.startingBid,
        bidsCount: bids.length,
        location: vehicle.location,
        condition: vehicle.condition,
        category: vehicle.category,
        specs: vehicle.specs,
        description: vehicle.description,
        endingAt: vehicle.auctionEndDate,
        ownerId: vehicle.ownerId,
        bids: bids.map(bid => ({
          id: bid._id,
          amount: bid.amount,
          bidderName: bid.bidderName,
          createdAt: bid.createdAt,
        })),
      },
    });
  } catch (error: any) {
    console.error("Get vehicle error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch vehicle" });
  }
}

// Create new vehicle listing
export async function createVehicle(req: Request, res: Response) {
  try {
    const vehicleData = req.body;
    
    // TODO: Get ownerId from authenticated user
    const ownerId = req.body.ownerId || "anonymous";

    const vehicle = await Vehicle.create({
      ...vehicleData,
      ownerId,
    });

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: {
        id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
      },
    });
  } catch (error: any) {
    console.error("Create vehicle error:", error);
    return res.status(500).json({ error: error.message || "Failed to create vehicle" });
  }
}

// Update vehicle
export async function updateVehicle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error: any) {
    console.error("Update vehicle error:", error);
    return res.status(500).json({ error: error.message || "Failed to update vehicle" });
  }
}

// Delete vehicle
export async function deleteVehicle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Also delete associated bids
    await Bid.deleteMany({ vehicleId: id });

    return res.json({ message: "Vehicle deleted successfully" });
  } catch (error: any) {
    console.error("Delete vehicle error:", error);
    return res.status(500).json({ error: error.message || "Failed to delete vehicle" });
  }
}

// Get vehicles by owner
export async function getMyVehicles(req: Request, res: Response) {
  try {
    const { ownerId } = req.params;
    
    const vehicles = await Vehicle.find({ ownerId }).sort({ createdAt: -1 });

    const vehiclesWithBids = await Promise.all(
      vehicles.map(async (vehicle) => {
        const bids = await Bid.find({ vehicleId: vehicle._id.toString() }).sort({ amount: -1 });
        const highestBid = bids[0];
        
        return {
          id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.images[0] || "",
          currentPrice: highestBid ? highestBid.amount : vehicle.startingBid,
          bidsCount: bids.length,
          location: vehicle.location,
          endingAt: vehicle.auctionEndDate,
        };
      })
    );

    return res.json({ vehicles: vehiclesWithBids });
  } catch (error: any) {
    console.error("Get my vehicles error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch vehicles" });
  }
}