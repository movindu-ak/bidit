import React from "react";
import { TextAreaField } from "../inputs/TextAreaField";
import type { VehicleFormData } from "./types";

interface DescriptionSectionProps {
  vehicle: VehicleFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

/** Free-text description of the vehicle */
export function DescriptionSection({ vehicle, onChange }: DescriptionSectionProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-gray-200">
      <h3 className="font-bold text-gray-900 text-base">Description</h3>
      <TextAreaField
        name="description"
        value={vehicle.description}
        onChange={onChange}
        rows={5}
        placeholder="Describe your vehicle..."
      />
    </div>
  );
}
