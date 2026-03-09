import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { vehiclesAPI } from "../../services/api";
import { auth } from "../../firebase/firebase";
import { uploadVehicleImages } from "../utils/uploadToFirebase"; // adjust if needed

export function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ NEW: keep real files + preview strings separately
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  // ✅ UPDATED: Handle image selection from device
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imageFiles.length + files.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }

    // 1) store File objects
    setImageFiles((prev) => [...prev, ...files]);

    // 2) generate previews (base64) for UI only
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // reset input so same file can be re-selected
    e.target.value = "";
  };

  // ✅ UPDATED: Remove both file + preview by same index
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
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

      const idToken = await currentUser.getIdToken();
      const firebaseUid = currentUser.uid;

      // ✅ 1) Upload images to Firebase Storage
      const uploadedUrls =
        imageFiles.length > 0
          ? await uploadVehicleImages({ files: imageFiles, firebaseUid })
          : [];

      const auctionEndDate = new Date();
      auctionEndDate.setDate(
        auctionEndDate.getDate() + Number(formData.auctionDays)
      );

      // ✅ 2) Send URL list to backend
      const vehicleData = {
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
          uploadedUrls.length > 0
            ? uploadedUrls
            : ["https://via.placeholder.com/800x600"],
        status: "active",
        bids: [],
      };

      const response = await vehiclesAPI.create(vehicleData, idToken);

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
                (max 6 images)
              </span>
            </h3>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />

            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={url}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 6 && (
                <label
                  htmlFor="image-upload"
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00a8e8] hover:bg-blue-50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    Click to upload
                  </span>
                </label>
              )}
            </div>

            <p className="text-xs text-gray-400">
              Accepted: JPG, PNG, WEBP — up to 6 photos
            </p>
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