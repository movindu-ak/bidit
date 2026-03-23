import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { MOCK_VEHICLES } from "../data";

export function EditAd() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = MOCK_VEHICLES.find(v => v.id === id);

  const [formData, setFormData] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year || "",
    price: vehicle?.currentPrice || "",
    location: vehicle?.location || "",
    mileage: vehicle?.specs?.mileage || "",
    condition: vehicle?.condition || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the vehicle data
    alert(t("editAd.updated"));
    navigate("/my-ads");
  };

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t("editAd.vehicleNotFound")}</p>
        <Link to="/my-ads" className="text-[#00a8e8] hover:underline mt-4 inline-block">
          {t("editAd.backToMyAds")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">{t("nav.home")}</Link> / 
        <Link to="/my-ads" className="text-[#00a8e8] hover:underline"> {t("myAds.title")}</Link> / 
        <span> {t("editAd.title")}</span>
      </div>

      <h1 className="text-2xl font-bold">{t("editAd.title")}</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-3xl">
        <div className="space-y-6">
          {/* Vehicle Image */}
          <div>
            <label className="block text-sm mb-2">{t("editAd.currentImage")}</label>
            <img 
              src={vehicle.image} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-64 h-48 object-cover rounded border border-gray-200"
            />
          </div>

          {/* Make */}
          <div>
            <label className="block text-sm mb-2">{t("editAd.make")}</label>
            <input
              type="text"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm mb-2">{t("editAd.model")}</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm mb-2">{t("editAd.year")}</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-2">{t("editAd.currentBidPrice")}</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm mb-2">{t("common.location")}</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Mileage */}
          <div>
            <label className="block text-sm mb-2">{t("common.mileage")}</label>
            <input
              type="text"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm mb-2">{t("common.condition")}</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
              required
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="New">New</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#5cb85c] hover:bg-[#4cae4c] text-white rounded transition-colors"
            >
              {t("editAd.updateAd")}
            </button>
            <Link
              to="/my-ads"
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition-colors inline-block"
            >
              {t("editAd.cancel")}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
