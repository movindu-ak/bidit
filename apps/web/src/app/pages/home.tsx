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

const EXAMPLE_VEHICLES: Vehicle[] = [
  {
    id: "ex-1",
    make: "Toyota",
    model: "Aqua",
    year: 2022,
    image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=640&q=80",
    currentPrice: 7200,
    startingBid: 7000,
    bidsCount: 5,
    location: "Colombo, Sri Lanka",
    condition: "Excellent",
    category: "Sedan",
  },
  {
    id: "ex-2",
    make: "Honda",
    model: "Vezel",
    year: 2021,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=640&q=80",
    currentPrice: 8500,
    startingBid: 8000,
    bidsCount: 9,
    location: "Kandy, Sri Lanka",
    condition: "Excellent",
    category: "SUV",
  },
  {
    id: "ex-3",
    make: "Suzuki",
    model: "Alto",
    year: 2023,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640&q=80",
    currentPrice: 4100,
    startingBid: 4000,
    bidsCount: 3,
    location: "Galle, Sri Lanka",
    condition: "New",
    category: "Sedan",
  },
  {
    id: "ex-4",
    make: "Nissan",
    model: "X-Trail",
    year: 2020,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=640&q=80",
    currentPrice: 11000,
    startingBid: 10500,
    bidsCount: 12,
    location: "Negombo, Sri Lanka",
    condition: "Good",
    category: "SUV",
  },
  {
    id: "ex-5",
    make: "BMW",
    model: "320i",
    year: 2019,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=640&q=80",
    currentPrice: 24000,
    startingBid: 22000,
    bidsCount: 18,
    location: "Colombo, Sri Lanka",
    condition: "Excellent",
    category: "Sedan",
  },
  {
    id: "ex-6",
    make: "Mitsubishi",
    model: "Outlander",
    year: 2021,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=640&q=80",
    currentPrice: 13500,
    startingBid: 13000,
    bidsCount: 7,
    location: "Kurunegala, Sri Lanka",
    condition: "Good",
    category: "SUV",
  },
];

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
      const fetched: Vehicle[] = data.vehicles || [];

      // Merge real vehicles first, then append examples that aren't duplicated
      const combined = [
        ...fetched,
        ...EXAMPLE_VEHICLES.filter(
          (ex) => !fetched.some((v) => v.id === ex.id)
        ),
      ];
      setVehicles(combined);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      setVehicles(EXAMPLE_VEHICLES);
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