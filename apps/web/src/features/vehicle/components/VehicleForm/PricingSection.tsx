import React from "react";
import { Sparkles } from "lucide-react";
import { InputField } from "../inputs/InputField";
import { BIDDING_DAYS } from "./vehicleFormConfig";
import type { VehicleFormData, VehicleFormErrors } from "./types";
import type { PricingResult } from "../../services/pricingSuggestionService";

interface PricingSectionProps {
  vehicle: VehicleFormData;
  errors: VehicleFormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onNegotiationChange: (value: boolean) => void;
  onAuctionDaysChange: (days: number) => void;
  /** Populated once the seller types a base price — null while basePrice is empty */
  pricingSuggestion: PricingResult | null;
  /** Called when seller accepts the suggested starting bid */
  onAcceptSuggestion: () => void;
}

/**
 * Pricing section:
 * Base Price field, Enable Price Negotiation checkbox card,
 * and Bidding Duration tile buttons (1–7 days).
 */
export function PricingSection({
  vehicle,
  errors,
  onChange,
  onNegotiationChange,
  onAuctionDaysChange,
  pricingSuggestion,
  onAcceptSuggestion,
}: PricingSectionProps) {
  return (
    <div className="space-y-4 pt-2 border-t border-gray-200">
      <h3 className="font-bold text-gray-900 text-base">Pricing</h3>

      {/* Base Price */}
      <div>
        <InputField
          label="Base Price (Rs.)"
          name="basePrice"
          value={vehicle.basePrice}
          onChange={onChange}
          type="number"
          placeholder="e.g., 2500000"
          required
        />
        {errors.basePrice && (
          <p className="text-xs text-red-500 mt-1">{errors.basePrice}</p>
        )}
      </div>

      {/* AI / Rule-based suggestion card — shown once basePrice is entered */}
      {pricingSuggestion && (
        <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
          <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800">
              Suggested Starting Bid:{" "}
              <span className="text-blue-900">
                Rs. {pricingSuggestion.suggestedStartingBid.toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-blue-600 mt-0.5">{pricingSuggestion.reasoning}</p>
          </div>
          <button
            type="button"
            onClick={onAcceptSuggestion}
            className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      )}

      {/* Starting Bid (overridable) */}
      <div>
        <InputField
          label="Starting Bid (Rs.)"
          name="startingBid"
          value={vehicle.startingBid}
          onChange={onChange}
          type="number"
          placeholder="Auto-filled or enter manually"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          This is the minimum opening bid. Accept the suggestion above or set your own.
        </p>
        {errors.startingBid && (
          <p className="text-xs text-red-500 mt-1">{errors.startingBid}</p>
        )}
      </div>

      {/* Enable Price Negotiation */}
      <label
        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
          vehicle.negotiationEnabled
            ? "border-purple-400 bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            className="sr-only"
            checked={vehicle.negotiationEnabled}
            onChange={(e) => onNegotiationChange(e.target.checked)}
          />
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
              vehicle.negotiationEnabled
                ? "bg-purple-600 border-purple-600"
                : "bg-white border-gray-300"
            }`}
          >
            {vehicle.negotiationEnabled && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5l3.5 3.5L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Enable Price Negotiation
          </p>
          <p className="text-xs text-amber-700 mt-1">
            💡 <strong>Flexible pricing option:</strong> Allow buyers to negotiate
            directly with you for potential deals outside the bidding system. This
            can attract more serious buyers.
          </p>
        </div>
      </label>

      {/* Show only when negotiation is enabled */}
      {vehicle.negotiationEnabled && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800">Bidding Duration</p>
          <div className="flex flex-wrap gap-3">
            {BIDDING_DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onAuctionDaysChange(d)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 text-sm font-bold transition-all ${
                  vehicle.auctionDays === d
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <span className="text-lg leading-none">{d}</span>
                <span className="text-xs font-normal">{d === 1 ? "day" : "days"}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Select how many days the bidding will remain active (max 7 days)
          </p>
        </div>
      )}
    </div>
  );
}
