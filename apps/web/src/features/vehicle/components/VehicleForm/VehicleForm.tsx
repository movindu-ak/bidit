import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { vehiclesAPI } from "../../../../services/api";
import { auth } from "../../../../firebase/firebase";
import { uploadVehicleImages } from "../../../../app/utils/uploadToFirebase";
import { suggestStartingBid, type PricingResult } from "../../services/pricingSuggestionService";

import { type VehicleFormData, type VehicleFormErrors, initialVehicleData } from "./types";
import { validateVehicleForm, hasErrors } from "./vehicleValidation";

import { BasicInfoSection } from "./BasicInfoSection";
import { SpecificationsSection } from "./SpecificationsSection";
import { OwnershipSection } from "./OwnershipSection";
import { PricingSection } from "./PricingSection";
import { DescriptionSection } from "./DescriptionSection";
import { MediaUploadSection } from "./MediaUploadSection";

/**
 * VehicleForm — main form orchestrator.
 *
 * State: a single `vehicle` object covers every field.
 * Handlers: a generic `handleChange` handles all text/select/textarea inputs;
 *           typed helpers handle booleans, numbers, and tile selections.
 * Validation: field-level errors via `validateVehicleForm` before submission.
 */
export function VehicleForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [pricingSuggestion, setPricingSuggestion] = useState<PricingResult | null>(null);

  /** Single structured state for all vehicle form fields */
  const [vehicle, setVehicle] = useState<VehicleFormData>(initialVehicleData);

  // ── Handlers ────────────────────────────────────────────────

  /** Generic handler — updates any string/number field by name */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVehicle((prev) => {
      const next = { ...prev, [name]: value };

      // Recompute pricing suggestion whenever basePrice changes
      if (name === "basePrice") {
        const suggestion = suggestStartingBid({
          basePrice: Number(value),
          condition: prev.condition,
          year: prev.yearManufactured,
        });
        setPricingSuggestion(suggestion);
      }

      return next;
    });
  };

  /** Typed updater for fields that aren't driven by a DOM event */
  const handleFieldUpdate = <K extends keyof VehicleFormData>(
    name: K,
    value: VehicleFormData[K]
  ) => {
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Submit ───────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Please login to post a vehicle");
      navigate("/auth");
      return;
    }

    // Client-side validation
    const validationErrors = validateVehicleForm(vehicle);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted errors");
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const firebaseUid = currentUser.uid;

      const uploadedUrls =
        imageFiles.length > 0
          ? await uploadVehicleImages({ files: imageFiles, firebaseUid })
          : [];

      const auctionEndDate = new Date();
      auctionEndDate.setDate(auctionEndDate.getDate() + Number(vehicle.auctionDays));

      const vehicleData = {
        make: vehicle.make,
        model: vehicle.model,
        year: Number(vehicle.yearManufactured),
        condition: vehicle.condition,
        category: vehicle.category,
        negotiationEnabled: vehicle.negotiationEnabled,
        specs: {
          mileage: vehicle.mileage + " km",
          engine: vehicle.engineCC + " cc",
          transmission: vehicle.transmission,
          fuel: vehicle.fuel,
          yearRegistered: Number(vehicle.yearRegistered),
          primaryUsage: vehicle.primaryUsage,
          previousOwners: vehicle.previousOwners,
          insuranceClaims: vehicle.insuranceClaims,
          tireCondition: vehicle.tireCondition,
          batteryCondition: vehicle.batteryCondition,
          interiorCondition: vehicle.interiorCondition,
          exteriorCondition: vehicle.exteriorCondition,
        },
        location: vehicle.location,
        basePrice: Number(vehicle.basePrice),
        startingBid: Number(vehicle.startingBid),
        currentBid: Number(vehicle.startingBid),
        auctionDays: Number(vehicle.auctionDays),
        auctionEndDate: auctionEndDate.toISOString(),
        description: vehicle.description,
        images:
          uploadedUrls.length > 0
            ? uploadedUrls
            : ["https://via.placeholder.com/800x600"],
        status: "active",
        bids: [],
      };

      const response = await vehiclesAPI.create(vehicleData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Vehicle listing created successfully!");
        navigate("/my-ads");
      }
    } catch (error: any) {
      console.error("Create vehicle error:", error);
      toast.error(error.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Basic vehicle identification */}
      <BasicInfoSection
        vehicle={vehicle}
        errors={errors}
        onChange={handleChange}
        onLocationSelect={(address) => handleFieldUpdate("location", address)}
      />

      {/* 2. Fuel, transmission, condition sliders, primary usage */}
      <SpecificationsSection
        vehicle={vehicle}
        onTileChange={(name, value) =>
          handleFieldUpdate(name, value as VehicleFormData[typeof name])
        }
        onSliderChange={(name, value) =>
          handleFieldUpdate(name, value as VehicleFormData[typeof name])
        }
      />

      {/* 3. Previous owners & insurance */}
      <OwnershipSection vehicle={vehicle} onChange={handleChange} />

      {/* 4. Base price, negotiation, bidding duration */}
      <PricingSection
        vehicle={vehicle}
        errors={errors}
        onChange={handleChange}
        onNegotiationChange={(value) =>
          handleFieldUpdate("negotiationEnabled", value)
        }
        onAuctionDaysChange={(days) => handleFieldUpdate("auctionDays", days)}
        pricingSuggestion={pricingSuggestion}
        onAcceptSuggestion={() =>
          pricingSuggestion &&
          handleFieldUpdate("startingBid", String(pricingSuggestion.suggestedStartingBid))
        }
      />

      {/* 5. Description */}
      <DescriptionSection vehicle={vehicle} onChange={handleChange} />

      {/* 6. Photo uploads */}
      <MediaUploadSection
        previews={imagePreviews}
        onSelect={handleImageSelect}
        onRemove={handleRemoveImage}
      />

      {/* Submit */}
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#5cb85c] hover:bg-[#4cae4c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Submitting...
            </>
          ) : (
            "Submit Listing"
          )}
        </button>
      </div>
    </form>
  );
}
