export interface FavouriteVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  currentPrice: number;
  bidsCount: number;
  location: string;
}

const FAVOURITES_KEY = "favouriteVehicles";

export function getFavouriteVehicles(): FavouriteVehicle[] {
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavouriteVehicle[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavouriteVehicles(vehicles: FavouriteVehicle[]): void {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(vehicles));
}

export function isFavouriteVehicle(vehicleId: string): boolean {
  return getFavouriteVehicles().some((vehicle) => vehicle.id === vehicleId);
}

export function toggleFavouriteVehicle(vehicle: FavouriteVehicle): boolean {
  const existing = getFavouriteVehicles();
  const isAlreadyFavourite = existing.some((item) => item.id === vehicle.id);

  if (isAlreadyFavourite) {
    const filtered = existing.filter((item) => item.id !== vehicle.id);
    saveFavouriteVehicles(filtered);
    return false;
  }

  saveFavouriteVehicles([vehicle, ...existing]);
  return true;
}

export function removeFavouriteVehicle(vehicleId: string): void {
  const existing = getFavouriteVehicles();
  saveFavouriteVehicles(existing.filter((vehicle) => vehicle.id !== vehicleId));
}
