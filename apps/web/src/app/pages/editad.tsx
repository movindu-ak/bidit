import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { MOCK_VEHICLES } from "../data";

export function EditAd() {
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
    alert("Ad updated successfully!");
    navigate("/my-ads");
  };

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Vehicle not found</p>
        <Link to="/my-ads" className="text-[#00a8e8] hover:underline mt-4 inline-block">
          Back to My Ads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">Home</Link> / 
        <Link to="/my-ads" className="text-[#00a8e8] hover:underline"> My Ads</Link> / 
        <span> Edit Ad</span>
      </div>

      <h1 className="text-2xl font-bold">Edit Advertisement</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-3xl">
        <div className="space-y-6">
          {/* Vehicle Image */}
          <div>
            <label className="block text-sm mb-2">Current Image</label>
            <img 
              src={vehicle.image} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-64 h-48 object-cover rounded border border-gray-200"
            />
          </div>

          {/* Make */}
          <div>
            <label className="block text-sm mb-2">Make</label>
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
            <label className="block text-sm mb-2">Model</label>
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
            <label className="block text-sm mb-2">Year</label>
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
            <label className="block text-sm mb-2">Current Bid Price (USD)</label>
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
            <label className="block text-sm mb-2">Location</label>
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
            <label className="block text-sm mb-2">Mileage</label>
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
            <label className="block text-sm mb-2">Condition</label>
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
              Update Ad
            </button>
            <Link
              to="/my-ads"
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
