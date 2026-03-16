/** All fields managed by the Add Vehicle form */
export interface VehicleFormData {
  // Basic Info
  make: string;
  model: string;
  yearManufactured: number;
  yearRegistered: number;
  condition: string;
  category: string;
  location: string;

  // Specifications
  mileage: string;
  engineCC: string;
  transmission: "Manual" | "Automatic" | "Tiptronic" | "Other";
  fuel: "Petrol" | "Diesel" | "CNG" | "Hybrid" | "Electric";
  primaryUsage: string;

  // Condition ratings (0–100)
  tireCondition: number;
  batteryCondition: number;
  interiorCondition: number;
  exteriorCondition: number;

  // Ownership
  previousOwners: string;
  insuranceClaims: string;

  // Pricing
  basePrice: string;        // seller-entered market value
  startingBid: string;      // confirmed auction starting bid (auto-suggested or overridden)
  negotiationEnabled: boolean;
  auctionDays: number;

  // Description
  description: string;
}

/** Default state applied when the form mounts */
export const initialVehicleData: VehicleFormData = {
  make: "",
  model: "",
  yearManufactured: 2024,
  yearRegistered: 2024,
  condition: "Excellent",
  category: "Sedan",
  location: "",
  mileage: "",
  engineCC: "",
  transmission: "Automatic",
  fuel: "Petrol",
  primaryUsage: "Personal",
  tireCondition: 70,
  batteryCondition: 75,
  interiorCondition: 70,
  exteriorCondition: 75,
  previousOwners: "1",
  insuranceClaims: "0",
  basePrice: "",
  startingBid: "",
  negotiationEnabled: false,
  auctionDays: 3,
  description: "",
};

/** Field-level validation errors keyed to form field names */
export interface VehicleFormErrors {
  make?: string;
  model?: string;
  yearManufactured?: string;
  basePrice?: string;
  startingBid?: string;
}
