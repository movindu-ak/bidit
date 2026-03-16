import type { VehicleFormData, VehicleFormErrors } from "./types";

/**
 * Validates the vehicle form and returns any field-level errors.
 * Returns an empty object when the form is valid.
 */
export function validateVehicleForm(vehicle: VehicleFormData): VehicleFormErrors {
  const errors: VehicleFormErrors = {};

  if (!vehicle.make) {
    errors.make = "Brand is required";
  }

  if (!vehicle.model.trim()) {
    errors.model = "Model is required";
  }

  if (!vehicle.yearManufactured || isNaN(Number(vehicle.yearManufactured))) {
    errors.yearManufactured = "Valid year of manufacture is required";
  }

  if (!vehicle.basePrice) {
    errors.basePrice = "Base price is required";
  } else if (Number(vehicle.basePrice) <= 0) {
    errors.basePrice = "Price must be greater than 0";
  }

  if (!vehicle.startingBid) {
    errors.startingBid = "Starting bid is required";
  } else if (Number(vehicle.startingBid) <= 0) {
    errors.startingBid = "Starting bid must be greater than 0";
  }

  return errors;
}

/** Returns true when the errors object contains at least one error */
export function hasErrors(errors: VehicleFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
