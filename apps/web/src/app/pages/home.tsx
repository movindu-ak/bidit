import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { vehiclesAPI } from "../../services/api";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  currentPrice: number;
  startingBid: number;
  bidsCount: number;
  location: string;
  condition: "New" | "Excellent" | "Good" | "Fair";
  category: string;
}

export function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMake, setSelectedMake] = useState("Any Make");
  const [selectedCondition, setSelectedCondition] = useState("Any Condition");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadVehicles();
  }, [selectedMake, selectedCondition]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedMake !== "Any Make") filters.make = selectedMake;
      if (selectedCondition !== "Any Condition") filters.condition = selectedCondition;
      
      const data = await vehiclesAPI.getAll(filters);
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles;

  const totalResults = filteredVehicles.length;
  const resultsPerPage = 40;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">Home</Link> / 
        <Link to="/" className="text-[#00a8e8] hover:underline"> All Ads</Link> / 
        <span> Car</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold">Cars for sale in Sri Lanka</h1>

      {/* Search Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select 
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded bg-white text-sm"
          >
            <option>Any Make</option>
            <option>Porsche</option>
            <option>BMW</option>
            <option>Mercedes-Benz</option>
          </select>
          
          <input 
            type="text"
            placeholder="Model"
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          />
          
          <select className="px-4 py-2 border border-gray-300 rounded bg-white text-sm">
            <option>Car</option>
            <option>SUV</option>
            <option>Van</option>
          </select>

          <select 
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded bg-white text-sm"
          >
            <option>Any Condition</option>
            <option>New</option>
            <option>Excellent</option>
            <option>Good</option>
          </select>

          <input 
            type="text"
            placeholder="Min Price"
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          />

          <input 
            type="text"
            placeholder="Max Price"
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        
        <div className="mt-4 flex justify-center">
          <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-12 py-2 rounded text-sm transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      )}

      {/* Results Count & Pagination */}
      {!loading && (
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Displaying <strong>1 - {Math.min(resultsPerPage, totalResults)}</strong> of <strong>{totalResults}</strong> Search Results
        </p>
        
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center border text-sm ${
                currentPage === page 
                  ? 'bg-[#00a8e8] text-white border-[#00a8e8]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
      )}

      {/* Vehicle Grid */}
      {!loading && (
      <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Bottom Pagination */}
      <div className="flex justify-end">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center border text-sm ${
                currentPage === page 
                  ? 'bg-[#00a8e8] text-white border-[#00a8e8]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const priceLKR = (vehicle.currentPrice * 325).toLocaleString();

  return (
    <Link 
      to={`/vehicle/${vehicle.id}`}
      className="bg-white border-2 border-[#c8e6c9] rounded hover:shadow-md transition-shadow block relative"
    >
      <div className="p-4">
        {/* Title at top */}
        <h3 className="text-center text-base font-bold text-gray-900 mb-3">
          {vehicle.make} {vehicle.model} {vehicle.year} Car
        </h3>
        
        <div className="flex gap-4">
          {/* Image on left */}
          <div className="flex-shrink-0">
            <img 
              src={vehicle.image || "https://via.placeholder.com/160x128"} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-40 h-32 object-cover rounded border border-gray-200"
            />
          </div>

          {/* Content on right */}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-gray-600">{vehicle.location}</p>
            <p className="text-xl font-bold text-green-700">Rs. {priceLKR}</p>
            <p className="text-sm text-gray-600">{vehicle.bidsCount} bids</p>
          </div>
        </div>
        
        {/* Location pin icon - bottom right corner */}
        <div className="absolute bottom-3 right-3">
          <MapPin className="h-6 w-6 text-[#ff6b35]" />
        </div>
      </div>
    </Link>
  );
}