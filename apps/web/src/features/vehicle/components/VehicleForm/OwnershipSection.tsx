import React from "react";
import { SelectField } from "../inputs/SelectField";
import {
  PREVIOUS_OWNERS_OPTIONS,
  INSURANCE_CLAIMS_OPTIONS,
} from "./vehicleFormConfig";
import type { VehicleFormData } from "./types";

interface OwnershipSectionProps {
  vehicle: VehicleFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

/** Previous owner count and insurance claim history dropdowns */
export function OwnershipSection({ vehicle, onChange }: OwnershipSectionProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-gray-200">
      <h3 className="font-bold text-gray-900 text-base">Ownership & Insurance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Number of Previous Owners"
          name="previousOwners"
          value={vehicle.previousOwners}
          onChange={onChange}
          options={PREVIOUS_OWNERS_OPTIONS}
        />
        <SelectField
          label="Insurance Claim History"
          name="insuranceClaims"
          value={vehicle.insuranceClaims}
          onChange={onChange}
          options={INSURANCE_CLAIMS_OPTIONS}
        />
      </div>
    </div>
  );
}
