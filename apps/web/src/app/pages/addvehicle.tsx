import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { vehiclesAPI } from "../../services/api";

export function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: 2024,
    condition: "Excellent",
    mileage: "",
    transmission: "Automatic",
    engine: "",
    fuel: "Gasoline",
    category: "Sedan",
    location: "",
    startingBid: "",
    auctionDays: 7,
    description: "",
  });

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    if (imageUrls.length >= 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    setImageUrls((prev) => [...prev, imageInput.trim()]);
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      toast.error("Please login to post a vehicle");
      navigate("/auth");
      return;
    }

    if (!formData.make || !formData.model || !formData.startingBid) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const auctionEndDate = new Date();
      auctionEndDate.setDate(auctionEndDate.getDate() + Number(formData.auctionDays));

      const vehicleData = {
        ownerId: user.id || user._id,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        condition: formData.condition,
        category: formData.category,
        specs: {
          mileage: formData.mileage + " km",
          engine: formData.engine,
          transmission: formData.transmission,
          fuel: formData.fuel,
        },
        location: formData.location,
        startingBid: Number(formData.startingBid),
        currentBid: Number(formData.startingBid),
        auctionEndDate: auctionEndDate.toISOString(),
        description: formData.description,
        images:
          imageUrls.length > 0
            ? imageUrls
            : ["https://via.placeholder.com/800x600"],
        status: "active",
        bids: [],
      };

      console.log("Submitting vehicle:", vehicleData);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <a href="/" className="text-[#00a8e8] hover:underline">
          Home
        </a>{" "}
        /<span> Post Vehicle Ad</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Post a Vehicle for Sale
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Vehicle Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Toyota"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Corolla"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] bg-white"
                >
                  {Array.from({ length: 15 }, (_, i) => 2024 - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] bg-white"
                >
                  <option>New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] bg-white"
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] bg-white"
                >
                  <option>Gasoline</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Engine Size
                </label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 2.0L"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Colombo"
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-900">Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Starting Bid (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Auction Duration (days)
                </label>
                <input
                  type="number"
                  name="auctionDays"
                  value={formData.auctionDays}
                  onChange={handleChange}
                  required
                  min="1"
                  max="30"
                  placeholder="7"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
              <strong>Note:</strong> Minimum bid increment is $5,000. Maximum
              increment is 1% of base price.
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-900">Description</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your vehicle..."
              className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8] resize-none"
            ></textarea>
          </div>

          {/* Images */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-900">
              Photos{" "}
              <span className="text-xs text-gray-400 font-normal">
                (max 6)
              </span>
            </h3>

            {/* Image URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL here..."
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddImage())}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#00a8e8] text-white rounded text-sm hover:bg-[#0090c8] transition-colors"
              >
                Add
              </button>
            </div>

            {/* Image previews */}
            <div className="grid grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-full object-cover rounded border border-gray-200"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x600")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {imageUrls.length < 6 && (
                <button
                  type="button"
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="url"]')?.focus()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-2 hover:border-[#00a8e8] hover:bg-blue-50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </button>
              )}
            </div>
          </div>

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
      </div>
    </div>
  );
}