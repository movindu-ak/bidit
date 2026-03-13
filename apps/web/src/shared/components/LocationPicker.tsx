import { useState } from "react";

interface LocationPickerProps {
  value: string;
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

export function LocationPicker({ value, onLocationSelect }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoordinates({ lat, lng });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();

          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "Unknown Location";
          const formattedAddress = `${cityName}, ${data.address.country || ""}`;

          onLocationSelect({ address: formattedAddress, lat, lng });
        } catch {
          setError("Could not fetch address. Please enter manually.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError("Unable to retrieve your location. Please enter manually.");
        console.error(err);
      }
    );
  };

  const handleAddressChange = (value: string) => {
    if (coordinates) {
      onLocationSelect({ address: value, lat: coordinates.lat, lng: coordinates.lng });
    } else {
      onLocationSelect({ address: value, lat: 0, lng: 0 });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => handleAddressChange(e.target.value)}
          required
          placeholder="e.g. Colombo, Sri Lanka"
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#00a8e8]"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="px-4 py-2 bg-[#00a8e8] hover:bg-[#0090c8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-2 whitespace-nowrap transition-colors"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Getting...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Use My Location</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {coordinates && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
          📍 {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
