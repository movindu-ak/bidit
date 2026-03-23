import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Heart, MapPin } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase/firebase";
import { favoritesAPI, vehiclesAPI } from "../../services/api";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  basePrice?: number;
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
    basePrice: 7500,
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
    basePrice: 9000,
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
    basePrice: 4500,
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
    basePrice: 11500,
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
    basePrice: 24500,
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
    basePrice: 14000,
    currentPrice: 13500,
    startingBid: 13000,
    bidsCount: 7,
    location: "Kurunegala, Sri Lanka",
    condition: "Good",
    category: "SUV",
  },
];

const CATEGORY_OPTIONS = [
  "Cars",
  "SUVs",
  "Vans",
  "Motorbikes",
  "Lorries",
  "Three Wheels",
  "Pickups",
  "Heavy-Duty",
] as const;

const CATEGORY_ALIAS_MAP: Record<string, string[]> = {
  Cars: ["car", "cars", "sedan", "hatchback", "sports", "electric"],
  SUVs: ["suv", "suvs"],
  Vans: ["van", "vans", "minivan", "minivans"],
  Motorbikes: ["motorbike", "motorbikes", "motorcycle", "motorcycles", "bike", "bikes", "scooter", "scooters"],
  Lorries: ["lorry", "lorries", "truck", "trucks"],
  "Three Wheels": ["three wheel", "three wheels", "three-wheeler", "three-wheelers", "threewheels", "tuk tuk", "tuktuk"],
  Pickups: ["pickup", "pickups", "pick-up", "pick-ups"],
  "Heavy-Duty": ["heavy duty", "heavy-duty", "heavyduty", "tractor", "excavator", "loader"],
};

const normalizeCategory = (value: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const isCategoryMatch = (vehicleCategory: string, selectedCategory: string) => {
  if (selectedCategory === "Any Category") return true;
  const normalizedVehicleCategory = normalizeCategory(vehicleCategory);
  const aliases = CATEGORY_ALIAS_MAP[selectedCategory] || [selectedCategory];
  return aliases.map(normalizeCategory).includes(normalizedVehicleCategory);
};

const toSafeNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export function Home() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMake, setSelectedMake] = useState("Any Make");
  const [selectedCategory, setSelectedCategory] = useState("Any Category");
  const [selectedCondition, setSelectedCondition] = useState("Any Condition");
  const [currentPage, setCurrentPage] = useState(1);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "Any Category";
    const isSupportedCategory = CATEGORY_OPTIONS.includes(categoryFromUrl as typeof CATEGORY_OPTIONS[number]);
    setSelectedCategory(isSupportedCategory ? categoryFromUrl : "Any Category");
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFavouriteIds(new Set());
        return;
      }

      try {
        const response = await favoritesAPI.getMyFavorites();
        const ids = Array.isArray(response?.favorites) ? response.favorites : [];
        setFavouriteIds(new Set(ids));
      } catch {
        setFavouriteIds(new Set());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [selectedMake, selectedCondition, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMake, selectedCondition, selectedCategory]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedMake !== "Any Make") filters.make = selectedMake;
      if (selectedCategory !== "Any Category") filters.category = selectedCategory;
      if (selectedCondition !== "Any Condition") filters.condition = selectedCondition;
      
      const data = await vehiclesAPI.getAll(filters);
      const fetchedRaw = Array.isArray(data?.vehicles) ? data.vehicles : [];
      const fetched: Vehicle[] = fetchedRaw.map((v: any) => {
        const startingBid = toSafeNumber(v?.startingBid);
        const basePrice = v?.basePrice != null ? toSafeNumber(v.basePrice, startingBid) : undefined;
        const currentPrice = toSafeNumber(v?.currentPrice, startingBid || basePrice || 0);

        return {
          id: String(v?.id ?? v?._id ?? ""),
          make: String(v?.make ?? ""),
          model: String(v?.model ?? ""),
          year: toSafeNumber(v?.year),
          image: String(v?.image ?? v?.images?.[0] ?? ""),
          basePrice,
          currentPrice,
          startingBid,
          bidsCount: toSafeNumber(v?.bidsCount),
          location: String(v?.location ?? "Location not specified"),
          condition: (v?.condition ?? "Good") as Vehicle["condition"],
          category: String(v?.category ?? "Cars"),
        };
      });

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

  const filteredVehicles = vehicles.filter((vehicle) =>
    isCategoryMatch(vehicle.category, selectedCategory)
  );

  const handleToggleFavourite = async (vehicleId: string) => {
    if (!auth.currentUser) {
      toast.error("Please sign in to save favorites");
      return;
    }

    const isCurrentlyFavourite = favouriteIds.has(vehicleId);

    try {
      const response = isCurrentlyFavourite
        ? await favoritesAPI.removeFavorite(vehicleId)
        : await favoritesAPI.addFavorite(vehicleId);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      const updatedFavorites = Array.isArray(response?.favorites) ? response.favorites : [];
      setFavouriteIds(new Set(updatedFavorites));
      toast.success(isCurrentlyFavourite ? "Removed from favourites" : "Added to favourites");
    } catch {
      toast.error("Failed to update favourites");
    }
  };

  const totalResults = filteredVehicles.length;
  const resultsPerPage = 14;
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, totalResults);
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">{t("home.title")}</Link> / 
        <Link to="/" className="text-[#00a8e8] hover:underline"> {t("home.allAds")}</Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold">{t("home.title")}</h1>
      <p className="text-sm text-gray-600 -mt-4">{t("home.subtitle")}</p>

      {/* Search Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select 
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded bg-white text-sm"
          >
            <option>{t("home.anyMake")}</option>
            <option>Porsche</option>
            <option>BMW</option>
            <option>Mercedes-Benz</option>
          </select>
          
          <input 
            type="text"
            placeholder={t("home.model")}
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded bg-white text-sm"
          >
            <option>{t("home.anyCategory")}</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select 
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded bg-white text-sm"
          >
            <option>{t("home.anyCondition")}</option>
            <option>New</option>
            <option>Excellent</option>
            <option>Good</option>
          </select>

          <input 
            type="text"
            placeholder={t("home.minPrice")}
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          />

          <input 
            type="text"
            placeholder={t("home.maxPrice")}
            className="px-4 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        
        <div className="mt-4 flex justify-center">
          <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-12 py-2 rounded text-sm transition-colors">
            {t("home.search")}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">{t("home.loading")}</p>
        </div>
      )}

      {/* Results Count & Pagination */}
      {!loading && (
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          {t("home.displaying")} <strong>{totalResults === 0 ? 0 : startIndex + 1} - {endIndex}</strong> of <strong>{totalResults}</strong> {t("home.results")}
        </p>
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center border text-sm ${
                safeCurrentPage === page 
                  ? 'bg-[#00a8e8] text-white border-[#00a8e8]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={safeCurrentPage === totalPages}
            className="px-3 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("home.next")}
          </button>
        </div>
      </div>
      )}

      {/* Vehicle Grid */}
      {!loading && (
      <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paginatedVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isFavourite={favouriteIds.has(vehicle.id)}
            onToggleFavourite={handleToggleFavourite}
          />
        ))}
      </div>

      {/* Bottom Pagination */}
      <div className="flex justify-end">
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center border text-sm ${
                safeCurrentPage === page 
                  ? 'bg-[#00a8e8] text-white border-[#00a8e8]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={safeCurrentPage === totalPages}
            className="px-3 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("home.next")}
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

function VehicleCard({
  vehicle,
  isFavourite,
  onToggleFavourite,
}: {
  vehicle: Vehicle;
  isFavourite: boolean;
  onToggleFavourite: (vehicleId: string) => void;
}) {
  const { t } = useTranslation();
  const safeStartingBid = toSafeNumber(vehicle.startingBid);
  const safeBasePrice = toSafeNumber(vehicle.basePrice, safeStartingBid);
  const safeCurrentPrice = toSafeNumber(vehicle.currentPrice, safeStartingBid || safeBasePrice);
  const basePriceLKR = safeBasePrice.toLocaleString();
  const currentPriceLKR = safeCurrentPrice.toLocaleString();
  const sellerTopic = `${vehicle.make ?? ""} ${vehicle.model ?? ""}`.trim();
  const sellerTopicLower = sellerTopic.toLowerCase();
  const yearText = String(vehicle.year ?? "").trim();
  const hasYearInTopic = yearText.length > 0 && sellerTopicLower.includes(yearText.toLowerCase());
  const adTitle = `${sellerTopic}${!hasYearInTopic && yearText ? ` ${yearText}` : ""}${vehicle.category ? ` ${vehicle.category}` : ""}`.trim();

  return (
    <Link 
      to={`/vehicle/${vehicle.id}`}
      className="bg-white border-2 border-[#c8e6c9] rounded hover:shadow-md transition-shadow block relative"
    >
      <div className="p-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavourite(vehicle.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 border border-gray-200 hover:bg-gray-50"
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart
            className={`h-5 w-5 ${isFavourite ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* Title at top */}
        <h3 className="text-center text-base font-bold text-gray-900 mb-3">
          {adTitle}
        </h3>
        
        <div className="flex gap-4">
          {/* Image on left */}
          <div className="flex-shrink-0">
            <img 
              src={vehicle.image || "https://placehold.co/160x128?text=No+Image"} 
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-40 h-32 object-contain bg-gray-100 rounded border border-gray-200"
            />
          </div>

          {/* Content on right */}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t("common.location")}: </span>
              {vehicle.location}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium">{t("common.year")}: </span>
              {vehicle.year}
            </p>
            <div className="space-y-1">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">{t("common.price")}</p>
                <p className="text-sm font-semibold text-gray-700">Rs. {basePriceLKR}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">{t("common.startingBid")}</p>
                <p className="text-xl font-bold text-green-700">Rs. {currentPriceLKR}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{vehicle.bidsCount} {t("common.bids")}</p>
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