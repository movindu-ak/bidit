import { TileGroup } from "./TileGroup";
import { ConditionSlider } from "./ConditionSlider";
import {
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  USAGE_OPTIONS,
  CONDITION_SLIDERS,
} from "./vehicleFormConfig";
import type { VehicleFormData } from "./types";

interface SpecificationsSectionProps {
  vehicle: VehicleFormData;
  /** Fired when a TileGroup value changes */
  onTileChange: (name: keyof VehicleFormData, value: string) => void;
  /** Fired when a ConditionSlider value changes */
  onSliderChange: (name: keyof VehicleFormData, value: number) => void;
}

/**
 * Vehicle specification tiles and condition sliders:
 * Fuel Type, Transmission Type, 4× Condition Sliders, Primary Usage.
 */
export function SpecificationsSection({
  vehicle,
  onTileChange,
  onSliderChange,
}: SpecificationsSectionProps) {
  return (
    <>
      {/* ── Fuel Type ── */}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <TileGroup
          label="Fuel Type"
          value={vehicle.fuel}
          onChange={(v) => onTileChange("fuel", v)}
          options={FUEL_OPTIONS}
        />
      </div>

      {/* ── Transmission Type ── */}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <TileGroup
          label="Transmission Type"
          value={vehicle.transmission}
          onChange={(v) => onTileChange("transmission", v)}
          options={TRANSMISSION_OPTIONS}
        />
      </div>

      {/* ── Vehicle Condition sliders ── */}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <h3 className="font-bold text-gray-900 text-base">Vehicle Condition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONDITION_SLIDERS.map((slider) => (
            <ConditionSlider
              key={slider.key}
              label={slider.label}
              value={vehicle[slider.key]}
              onChange={(v) => onSliderChange(slider.key, v)}
              min={slider.min}
              mid={slider.mid}
              max={slider.max}
              color={slider.color}
            />
          ))}
        </div>
      </div>

      {/* ── Primary Vehicle Usage ── */}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <h3 className="font-bold text-gray-900 text-base">Primary Vehicle Usage</h3>
        <TileGroup
          label="What is this vehicle mainly used for?"
          value={vehicle.primaryUsage as "Personal" | "Commute" | "Business" | "Off-Road" | "Rental"}
          onChange={(v) => onTileChange("primaryUsage", v)}
          options={USAGE_OPTIONS}
        />
      </div>
    </>
  );
}
