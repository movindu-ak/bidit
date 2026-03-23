import type { Request, Response } from "express";
import { Vehicle } from "../models/vehicle.model.js";
import { Bid } from "../models/bid.model.js";
import type { AuthRequest } from "../middleware/requireAuth.js";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[^\d.-]/g, "").trim();
  if (!cleaned) return undefined;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toTitleCase(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeToken(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.toLowerCase().replace(/\s+/g, "");
}

function normalizeCategory(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const map: Record<string, string> = {
    cars: "Cars",
    car: "Cars",
    suvs: "SUVs",
    suv: "SUV",
    vans: "Vans",
    van: "Van",
    motorbikes: "Motorbikes",
    motorbike: "Motorbikes",
    motorcycles: "Motorbikes",
    lorries: "Lorries",
    lorry: "Lorries",
    threewheels: "Three Wheels",
    pickups: "Pickups",
    pickup: "Pickups",
    heavyduty: "Heavy-Duty",
    sports: "Sports",
    electric: "Electric",
    truck: "Truck",
  };

  return map[key] ?? toTitleCase(value);
}

function getPricing(vehicle: any) {
  return {
    basePrice: vehicle?.pricing?.basePrice ?? vehicle?.basePrice,
    startingBid: vehicle?.pricing?.startingBid ?? vehicle?.startingBid,
    negotiationEnabled: vehicle?.pricing?.negotiationEnabled ?? vehicle?.negotiationEnabled ?? false,
  };
}

function getAuction(vehicle: any) {
  return {
    auctionDays: vehicle?.auction?.auctionDays ?? vehicle?.auctionDays,
    auctionEndDate: vehicle?.auction?.auctionEndDate ?? vehicle?.auctionEndDate,
  };
}

function getSpecsForClient(vehicle: any) {
  const specs = vehicle?.specs ?? {};
  const mileageKm = specs.mileageKm ?? toNumber(specs.mileage);
  const engineCc = specs.engineCc ?? toNumber(specs.engine);

  return {
    mileage: mileageKm != null ? `${mileageKm} km` : specs.mileage,
    engine: engineCc != null ? `${engineCc} cc` : specs.engine,
    transmission: specs.transmission,
    fuel: specs.fuel,
    yearRegistered: specs.yearRegistered,
    previousOwners:
      specs.previousOwners != null ? String(specs.previousOwners) : undefined,
    primaryUsage: specs.primaryUsage,
    insuranceClaims:
      specs.insuranceClaims != null ? String(specs.insuranceClaims) : undefined,
    tireCondition: specs.tireCondition,
    batteryCondition: specs.batteryCondition,
    interiorCondition: specs.interiorCondition,
    exteriorCondition: specs.exteriorCondition,
  };
}

function normalizeVehiclePayload(raw: any) {
  const specs = raw?.specs ?? {};
  const pricing = raw?.pricing ?? {};
  const auction = raw?.auction ?? {};

  const make = toTitleCase(raw?.make) ?? "";
  const model = toTitleCase(raw?.model) ?? "";
  const normalizedMake = normalizeToken(make) ?? "";
  const normalizedModel = normalizeToken(model) ?? "";

  const mileageKm = toNumber(specs.mileageKm ?? specs.mileage);
  const engineCc = toNumber(specs.engineCc ?? specs.engine ?? specs.engineCapacity);
  const yearRegistered = toNumber(specs.yearRegistered);
  const previousOwners = toNumber(specs.previousOwners);
  const insuranceClaims = toNumber(specs.insuranceClaims);
  const tireCondition = toNumber(specs.tireCondition);
  const batteryCondition = toNumber(specs.batteryCondition);
  const interiorCondition = toNumber(specs.interiorCondition);
  const exteriorCondition = toNumber(specs.exteriorCondition);

  const transmission = toTitleCase(specs.transmission) ?? "";
  const fuel = toTitleCase(specs.fuel ?? specs.fuelType) ?? "";
  const primaryUsage = toTitleCase(specs.primaryUsage);
  const condition = toTitleCase(raw?.condition) as any;
  const category = normalizeCategory(raw?.category) as any;
  const location = toTitleCase(raw?.location) ?? "";
  const description = toTitleCase(raw?.description);

  const basePrice = toNumber(pricing.basePrice ?? raw.basePrice);
  const negotiationEnabled =
    typeof (pricing.negotiationEnabled ?? raw.negotiationEnabled) === "boolean"
      ? (pricing.negotiationEnabled ?? raw.negotiationEnabled)
      : false;

  const auctionDays = toNumber(auction.auctionDays ?? raw.auctionDays);
  const auctionEndDate =
    auction.auctionEndDate ?? raw.auctionEndDate ?? new Date().toISOString();

  return {
    make,
    model,
    normalizedMake,
    normalizedModel,
    year: toNumber(raw?.year) as number,
    condition,
    category,
    location,
    ...(description ? { description } : {}),
    images: Array.isArray(raw?.images) ? raw.images : [],
    specs: {
      mileageKm: mileageKm as number,
      engineCc: engineCc as number,
      transmission,
      fuel,
      ...(yearRegistered != null ? { yearRegistered } : {}),
      ...(previousOwners != null ? { previousOwners } : {}),
      ...(primaryUsage ? { primaryUsage } : {}),
      ...(insuranceClaims != null ? { insuranceClaims } : {}),
      ...(tireCondition != null ? { tireCondition } : {}),
      ...(batteryCondition != null ? { batteryCondition } : {}),
      ...(interiorCondition != null ? { interiorCondition } : {}),
      ...(exteriorCondition != null ? { exteriorCondition } : {}),
    },
    pricing: {
      ...(basePrice != null ? { basePrice } : {}),
      startingBid: toNumber(pricing.startingBid ?? raw.startingBid) as number,
      negotiationEnabled,
    },
    auction: {
      ...(auctionDays != null ? { auctionDays } : {}),
      auctionEndDate,
    },
  };
}

// Get all vehicles/auctions
export async function getAllVehicles(req: Request, res: Response) {
  try {
    const { make, condition, minPrice, maxPrice } = req.query;
    
    const filter: any = {};
    
    if (make && make !== "Any Make") filter.make = make;
    if (condition && condition !== "Any Condition") filter.condition = condition;
    if (minPrice) filter["pricing.startingBid"] = { ...filter["pricing.startingBid"], $gte: Number(minPrice) };
    if (maxPrice) filter["pricing.startingBid"] = { ...filter["pricing.startingBid"], $lte: Number(maxPrice) };

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

    // Get bid counts and current prices for each vehicle
    const vehiclesWithBids = await Promise.all(
      vehicles.map(async (vehicle) => {
        const bids = await Bid.find({ vehicleId: vehicle._id.toString() }).sort({ amount: -1 });
        const highestBid = bids[0];
        const pricing = getPricing(vehicle);
        const auction = getAuction(vehicle);
        
        return {
          id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.images[0] || "",
          images: vehicle.images,
          basePrice: pricing.basePrice ?? pricing.startingBid,
          currentPrice: highestBid ? highestBid.amount : pricing.startingBid,
          startingBid: pricing.startingBid,
          bidsCount: bids.length,
          location: vehicle.location,
          condition: vehicle.condition,
          category: vehicle.category,
          specs: getSpecsForClient(vehicle),
          description: vehicle.description,
          endingAt: auction.auctionEndDate,
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

    const bids = await Bid.find({ vehicleId: id as string }).sort({ amount: -1 });
    const highestBid = bids[0];
    const pricing = getPricing(vehicle);
    const auction = getAuction(vehicle);

    return res.json({
      vehicle: {
        id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        images: vehicle.images,
        basePrice: pricing.basePrice ?? pricing.startingBid,
        currentPrice: highestBid ? highestBid.amount : pricing.startingBid,
        startingBid: pricing.startingBid,
        negotiationEnabled: pricing.negotiationEnabled ?? false,
        auctionDays:
          auction.auctionDays ??
          Math.max(
            1,
            Math.ceil(
              (new Date(auction.auctionEndDate).getTime() - new Date(vehicle.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          ),
        bidsCount: bids.length,
        location: vehicle.location,
        condition: vehicle.condition,
        category: vehicle.category,
        specs: getSpecsForClient(vehicle),
        description: vehicle.description,
        endingAt: auction.auctionEndDate,
        createdAt: vehicle.createdAt,
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
export async function createVehicle(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const vehicleData = normalizeVehiclePayload(req.body);

    // ✅ ownerId from Firebase token
    const ownerId = req.user.uid;

    const vehicle = await Vehicle.create({
      ...vehicleData,
      ownerId,
    });

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
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
    const updateData = normalizeVehiclePayload(req.body);

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
    await Bid.deleteMany({ vehicleId: id as string });

    return res.json({ message: "Vehicle deleted successfully" });
  } catch (error: any) {
    console.error("Delete vehicle error:", error);
    return res.status(500).json({ error: error.message || "Failed to delete vehicle" });
  }
}

// Get vehicles by owner
export async function getMyVehicles(req: AuthRequest, res: Response) {
  try {
    const { ownerId } = req.params;
    const uid = req.user?.uid;

    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!ownerId || ownerId !== uid) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    const vehicles = await Vehicle.find({ ownerId: uid }).sort({ createdAt: -1 });

    const vehiclesWithBids = await Promise.all(
      vehicles.map(async (vehicle) => {
        const bids = await Bid.find({ vehicleId: vehicle._id.toString() }).sort({ amount: -1 });
        const highestBid = bids[0];
        const pricing = getPricing(vehicle);
        const auction = getAuction(vehicle);
        const isAuctionEnded = new Date(auction.auctionEndDate).getTime() <= Date.now();
        
        return {
          id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          image: vehicle.images[0] || "",
          currentPrice: highestBid ? highestBid.amount : pricing.startingBid,
          bidsCount: bids.length,
          condition: vehicle.condition,
          location: vehicle.location,
          endingAt: auction.auctionEndDate,
          bids: isAuctionEnded
            ? bids.map((bid) => ({
                id: bid._id,
                bidderName: bid.bidderName,
                bidderEmail: bid.bidderEmail,
                amount: bid.amount,
                createdAt: bid.createdAt,
              }))
            : [],
        };
      })
    );

    return res.json({ vehicles: vehiclesWithBids });
  } catch (error: any) {
    console.error("Get my vehicles error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch vehicles" });
  }
}