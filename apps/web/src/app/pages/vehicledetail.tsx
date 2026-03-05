import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Calendar,
  Gauge,
  Fuel,
  Settings,
  TrendingUp,
  X,
  Clock
} from "lucide-react";
import { vehiclesAPI, bidsAPI } from "../../services/api";
import { toast } from "sonner";

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehiclesAPI.getById(id!);
      setVehicle(data.vehicle);
      setBidAmount(data.vehicle.currentPrice + 1000);
    } catch (error) {
      console.error("Failed to load vehicle:", error);
      toast.error("Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Vehicle not found</h2>
        <Link to="/" className="text-[#00a8e8] mt-4 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handlePlaceBid = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    if (!user) {
      toast.error("Please login to place a bid");
      return;
    }
    
    if (bidAmount <= vehicle.currentPrice) {
      toast.error("Bid must be higher than current price");
      return;
    }

    try {
      const response = await bidsAPI.create({
        vehicleId: vehicle.id,
        amount: bidAmount,
        bidderId: user.id,
        bidderName: user.displayName,
        bidderEmail: user.email,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Bid placed successfully!");
        setIsBidModalOpen(false);
        loadVehicle(); // Reload to get updated data
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place bid");
    }
  };

  const currentPriceLKR = (vehicle.currentPrice * 325).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">Home</Link> / 
        <Link to="/" className="text-[#00a8e8] hover:underline"> All Ads</Link> / 
        <span> {vehicle.make} {vehicle.model}</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={vehicle.image} 
              alt={vehicle.model}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Title & Basic Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {vehicle.make} {vehicle.model} {vehicle.year} Car
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Gauge className="h-4 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Mileage</p>
                  <p className="text-sm font-semibold">{vehicle.specs.mileage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Settings className="h-4 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Transmission</p>
                  <p className="text-sm font-semibold">{vehicle.specs.transmission}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Fuel className="h-4 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Fuel</p>
                  <p className="text-sm font-semibold">{vehicle.specs.fuel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Engine</p>
                  <p className="text-sm font-semibold">{vehicle.specs.engine}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{vehicle.location}</span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                This {vehicle.year} {vehicle.make} {vehicle.model} is in {vehicle.condition.toLowerCase()} condition. 
                Equipped with a {vehicle.specs.engine} engine and {vehicle.specs.transmission.toLowerCase()} transmission. 
                Perfect for the Sri Lankan market with verified import documentation.
              </p>
            </div>
          </div>

          {/* Bidding History */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Bidding History</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span>{vehicle.bidsCount} Bids</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {vehicle.bids && vehicle.bids.length > 0 ? (
                vehicle.bids.map((bid: any) => (
                  <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{bid.bidderName}</span>
                    <span className="font-bold text-green-700">${bid.amount.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No bids yet. Be the first to bid!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Bidding Sidebar */}
        <div className="space-y-6">
          {/* Price & Bid */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Current Bid</p>
              <p className="text-3xl font-bold text-green-700">
                ${vehicle.currentPrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Rs. {currentPriceLKR}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
              <Clock className="h-4 w-4 text-red-500" />
              <span>Auction ends in <strong>1d 4h 22m</strong></span>
            </div>

            <button 
              onClick={() => setIsBidModalOpen(true)}
              className="w-full py-3 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded font-semibold transition-colors mb-3"
            >
              Place Bid
            </button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Starting bid: ${vehicle.startingBid.toLocaleString()}</p>
              <p>• Total bids: {vehicle.bidsCount}</p>
              <p>• Minimum increment: $5,000</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={vehicle.seller.avatar} 
                alt={vehicle.seller.name}
                className="h-12 w-12 rounded-full border border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-900">{vehicle.seller.name}</p>
                <div className="flex items-center gap-1 text-xs text-yellow-500">
                  {"★".repeat(5)}
                  <span className="text-gray-500 ml-1">({vehicle.seller.rating})</span>
                </div>
              </div>
            </div>
            <button className="w-full py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
              Contact Seller
            </button>
          </div>

          {/* Additional Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">Vehicle Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-semibold">{vehicle.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">{vehicle.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-semibold">${vehicle.basePrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bidding Modal */}
      {isBidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Place Your Bid</h2>
              <button 
                onClick={() => setIsBidModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-100 rounded">
                  <p className="text-xs text-gray-600 mb-1">Current Bid</p>
                  <p className="font-bold text-gray-900">
                    ${vehicle.currentPrice.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600 mb-1">Min Next Bid</p>
                  <p className="font-bold text-[#00a8e8]">
                    ${(vehicle.currentPrice + 5000).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Bid Amount (USD)</label>
                <input 
                  type="number"
                  step="5000"
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded px-4 py-3 text-lg font-semibold focus:outline-none focus:border-[#00a8e8]"
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-2">
                {[5000, 10000, 25000].map((inc) => (
                  <button 
                    key={inc}
                    onClick={() => {
                      const current = vehicle.currentPrice;
                      setBidAmount(current + inc);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-semibold transition-colors"
                  >
                    +${inc/1000}k
                  </button>
                ))}
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <strong>Note:</strong> Bids must be in $5,000 increments with a maximum of 1% of base price.
              </div>

              <button 
                onClick={handlePlaceBid}
                className="w-full py-3 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded font-semibold transition-colors"
              >
                Confirm Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}