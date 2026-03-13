import React from "react";
import { LocationPicker } from "../../../../shared/components/LocationPicker";
import { InputField } from "../inputs/InputField";
import { SelectField } from "../inputs/SelectField";
import {
  BRAND_GROUPS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  YEAR_OPTIONS,
} from "./vehicleFormConfig";
import type { VehicleFormData, VehicleFormErrors } from "./types";

interface BasicInfoSectionProps {
  vehicle: VehicleFormData;
  errors: VehicleFormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onLocationSelect: (address: string) => void;
}

/**
 * Basic vehicle identification fields:
 * Make, Model, Year (manufacture + registration), Condition,
 * Mileage, Engine CC, Category, and Location.
 */
export function BasicInfoSection({
  vehicle,
  errors,
  onChange,
  onLocationSelect,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 text-base border-b pb-2">
        Vehicle Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make */}
        <div>
          <SelectField
            label="Make"
            name="make"
            value={vehicle.make}
            onChange={onChange}
            groups={BRAND_GROUPS}
            required
            placeholder="Select brand"
          />
          {errors.make && (
            <p className="text-xs text-red-500 mt-1">{errors.make}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <InputField
            label="Model"
            name="model"
            value={vehicle.model}
            onChange={onChange}
            required
            placeholder="e.g. Corolla"
          />
          {errors.model && (
            <p className="text-xs text-red-500 mt-1">{errors.model}</p>
          )}
        </div>

        {/* Year of Manufacture */}
        <SelectField
          label="Year of Manufacture"
          name="yearManufactured"
          value={vehicle.yearManufactured}
          onChange={onChange}
          options={YEAR_OPTIONS}
        />

        {/* Year of Registration */}
        <SelectField
          label="Year of Registration"
          name="yearRegistered"
          value={vehicle.yearRegistered}
          onChange={onChange}
          options={YEAR_OPTIONS}
        />

        {/* Condition */}
        <SelectField
          label="Condition"
          name="condition"
          value={vehicle.condition}
          onChange={onChange}
          options={CONDITION_OPTIONS}
        />

        {/* Mileage */}
        <InputField
          label="Mileage (km)"
          name="mileage"
          value={vehicle.mileage}
          onChange={onChange}
          type="number"
          placeholder="0"
          required
        />

        {/* Engine Capacity */}
        <InputField
          label="Engine Capacity (cc)"
          name="engineCC"
          value={vehicle.engineCC}
          onChange={onChange}
          type="number"
          placeholder="e.g. 1500"
          required
        />

        {/* Category */}
        <SelectField
          label="Category"
          name="category"
          value={vehicle.category}
          onChange={onChange}
          options={CATEGORY_OPTIONS}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">Location</label>
        <LocationPicker
          value={vehicle.location}
          onLocationSelect={({ address }: { address: string; lat: number; lng: number }) => onLocationSelect(address)}
        />
      </div>
    </div>
  );
}
