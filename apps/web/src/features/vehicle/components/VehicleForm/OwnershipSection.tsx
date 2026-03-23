import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <div className="space-y-4 pt-2 border-t border-gray-200">
      <h3 className="font-bold text-gray-900 text-base">{t("vehicleForm.ownershipInsurance")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label={t("vehicleForm.previousOwners")}
          name="previousOwners"
          value={vehicle.previousOwners}
          onChange={onChange}
          options={PREVIOUS_OWNERS_OPTIONS}
        />
        <SelectField
          label={t("vehicleForm.insuranceClaims")}
          name="insuranceClaims"
          value={vehicle.insuranceClaims}
          onChange={onChange}
          options={INSURANCE_CLAIMS_OPTIONS}
        />
      </div>
    </div>
  );
}
