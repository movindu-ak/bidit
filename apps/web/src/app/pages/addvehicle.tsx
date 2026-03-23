import { VehicleForm } from "../../features/vehicle/components/VehicleForm/VehicleForm";
import { useTranslation } from "react-i18next";

/**
 * AddVehicle page  thin shell that renders the modular VehicleForm.
 * All form state, handlers, and sub-sections live inside VehicleForm/.
 */
export function AddVehicle() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <a href="/" className="text-[#00a8e8] hover:underline">
          {t("nav.home")}
        </a>{" "}
        /<span> {t("addVehicle.breadcrumb")}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t("addVehicle.title")}
        </h1>
        <VehicleForm />
      </div>
    </div>
  );
}
