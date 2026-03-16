import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Clock, Trash2, Edit2, MapPin } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { vehiclesAPI } from "../../services/api";

type MyVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  image?: string;
  location?: string;
  currentPrice?: number;
  startingBid?: number;
  bidsCount?: number;
  condition?: string;
  endingAt?: string;
};

export function MyAds() {
  const [myVehicles, setMyVehicles] = useState<MyVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setMyVehicles([]);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setLoading(true);

      try {
        const response = await vehiclesAPI.getMyVehicles(user.uid);
        const vehicles = Array.isArray(response?.vehicles)
          ? response.vehicles
          : Array.isArray(response)
            ? response
            : [];
        setMyVehicles(vehicles);
      } catch {
        setMyVehicles([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatTimeLeft = useMemo(
    () => (endingAt?: string) => {
      if (!endingAt) return "Ending soon";
      const end = new Date(endingAt).getTime();
      const now = Date.now();
      const diff = end - now;

      if (Number.isNaN(end) || diff <= 0) return "Auction ended";

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;

      if (days <= 0) return `${hours}h left`;
      return `${days}d ${hours}h left`;
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">Home</Link> / 
        <span> My Ads</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Advertisements</h1>
        <Link 
          to="/add-vehicle" 
          className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff5722] text-white rounded text-sm transition-colors"
        >
          + Post New Ad
        </Link>
      </div>

      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          Loading your listings...
        </div>
      )}

      {!loading && !isAuthenticated && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">Please log in to view your ads</p>
          <Link
            to="/auth"
            className="inline-block px-6 py-2 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded transition-colors"
          >
            Login
          </Link>
        </div>
      )}

      {!loading && isAuthenticated && myVehicles.length > 0 && (
        <div className="space-y-4">
        {myVehicles.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <Link to={`/vehicle/${v.id}`}>
                  <img 
                    src={v.image || "https://via.placeholder.com/400x300"} 
                    alt={`${v.make} ${v.model}`}
                    className="w-48 h-36 object-cover rounded"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="flex-1">
                <Link to={`/vehicle/${v.id}`} className="hover:text-[#00a8e8] transition-colors">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {v.make} {v.model} {v.year} Car
                  </h3>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{v.location || "Location not set"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>{formatTimeLeft(v.endingAt)}</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-700 mb-1">
                  Current Bid: Rs. {(v.currentPrice ?? v.startingBid ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {(v.bidsCount ?? 0)} bids {v.condition ? `• ${v.condition}` : ""}
                </p>
                <Link
                  to={`/vehicle/${v.id}`}
                  className="inline-block mt-3 text-sm text-[#00a8e8] hover:underline"
                >
                  View Details
                </Link>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link 
                  to={`/my-ads/edit/${v.id}`}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </Link>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && isAuthenticated && myVehicles.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">You don't have any active listings</p>
          <Link 
            to="/add-vehicle"
            className="inline-block px-6 py-2 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded transition-colors"
          >
            Post Your First Ad
          </Link>
        </div>
      )}
    </div>
  );
}