import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../../firebase/firebase";
import { favoritesAPI, vehiclesAPI } from "../../services/api";

type FavouriteVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  currentPrice: number;
  bidsCount: number;
  location: string;
};

export function Favourites() {
  const [favourites, setFavourites] = useState<FavouriteVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setFavourites([]);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setLoading(true);

      try {
        const [favoritesResponse, vehiclesResponse] = await Promise.all([
          favoritesAPI.getMyFavorites(),
          vehiclesAPI.getAll(),
        ]);

        const favouriteIds: string[] = Array.isArray(favoritesResponse?.favorites)
          ? favoritesResponse.favorites
          : [];

        const vehicles = Array.isArray(vehiclesResponse?.vehicles)
          ? vehiclesResponse.vehicles
          : [];

        const favouriteVehicles = vehicles
          .filter((vehicle: any) => favouriteIds.includes(String(vehicle.id)))
          .map((vehicle: any) => ({
            id: String(vehicle.id),
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            image: vehicle.image || vehicle.images?.[0] || "",
            currentPrice: vehicle.currentPrice ?? vehicle.startingBid ?? 0,
            bidsCount: vehicle.bidsCount ?? 0,
            location: vehicle.location || "",
          }));

        setFavourites(favouriteVehicles);
      } catch {
        setFavourites([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      const response = await favoritesAPI.removeFavorite(id);
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      setFavourites((prev) => prev.filter((vehicle) => vehicle.id !== id));
      toast.success("Removed from favourites");
    } catch {
      toast.error("Failed to remove favourite");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">My Favourites</h1>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Loading favourites...</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Please sign in to view favourites.</p>
          <Link to="/auth" className="inline-block mt-3 text-[#00a8e8] hover:underline">
            Sign in
          </Link>
        </div>
      ) : favourites.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No favourite vehicles yet.</p>
          <Link to="/" className="inline-block mt-3 text-[#00a8e8] hover:underline">
            Browse vehicles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {favourites.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white border border-gray-200 rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => handleRemove(vehicle.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full border border-gray-200 hover:bg-gray-50"
                aria-label="Remove from favourites"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>

              <Link to={`/vehicle/${vehicle.id}`} className="block">
                <h3 className="text-base font-bold text-gray-900 mb-3 pr-10">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h3>

                <div className="flex gap-4">
                  <img
                    src={vehicle.image || "https://via.placeholder.com/160x128"}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-40 h-28 object-cover rounded border border-gray-200"
                  />

                  <div className="space-y-2">
                    <p className="text-lg font-bold text-green-700">
                      Rs. {vehicle.currentPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{vehicle.bidsCount} bids</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vehicle.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
