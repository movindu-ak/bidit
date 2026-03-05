import { MOCK_VEHICLES } from "../data";
import { Link } from "react-router";
import { Clock, Trash2, Edit2, MapPin } from "lucide-react";

export function MyAds() {
  const myVehicles = MOCK_VEHICLES.slice(0, 2);

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

      <div className="space-y-4">
        {myVehicles.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <img 
                  src={v.image} 
                  alt={`${v.make} ${v.model}`}
                  className="w-48 h-36 object-cover rounded"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {v.make} {v.model} {v.year} Car
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{v.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span>Ends in 1d 4h</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-700 mb-1">
                  Current Bid: ${v.currentPrice.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {v.bidsCount} bids • {v.condition}
                </p>
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

      {myVehicles.length === 0 && (
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