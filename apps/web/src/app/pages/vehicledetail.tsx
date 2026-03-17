import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import {
  MapPin,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  Clock,
  TrendingUp,
  X,
  Heart,
  Tag,
  MessageCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { vehiclesAPI, bidsAPI, favoritesAPI } from "../../services/api";
import { toast } from "sonner";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      if (vehicle?.id) {
        syncFavouriteStatus(String(vehicle.id));
      }
    });

    return () => unsubscribe();
  }, [vehicle?.id]);

  const syncFavouriteStatus = async (vehicleId: string) => {
    if (!auth.currentUser) {
      setIsFavourite(false);
      return;
    }

    try {
      const favoritesResponse = await favoritesAPI.getMyFavorites();
      const ids = Array.isArray(favoritesResponse?.favorites)
        ? favoritesResponse.favorites
        : [];
      setIsFavourite(ids.includes(vehicleId));
    } catch {
      setIsFavourite(false);
    }
  };

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehiclesAPI.getById(id!);
      const fetchedVehicle = data?.vehicle ?? null;
      setVehicle(fetchedVehicle);
      setSelectedImageIndex(0);
      await syncFavouriteStatus(String(fetchedVehicle?.id ?? ""));
      setBidAmount(String((fetchedVehicle?.currentPrice ?? fetchedVehicle?.startingBid ?? 0) + 5000));
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

  const vehicleImages: string[] = Array.isArray(vehicle.images) && vehicle.images.length > 0
    ? vehicle.images
    : vehicle.image
      ? [vehicle.image]
      : ["https://via.placeholder.com/1200x800"];
  const activeImageIndex = Math.min(selectedImageIndex, vehicleImages.length - 1);
  const primaryImage = vehicleImages[activeImageIndex];
  const sellerName = vehicle.seller?.name || "Verified Seller";
  const currentPrice = vehicle.currentPrice ?? vehicle.startingBid ?? 0;
  const startingBid = vehicle.startingBid ?? vehicle.basePrice ?? 0;
  const firebaseUser = auth.currentUser;
  const isOwnerViewing = !!firebaseUser && vehicle.ownerId === firebaseUser.uid;
  const vehicleDescription =
    vehicle.description ||
    `This ${vehicle.year} ${vehicle.make} ${vehicle.model} is in ${String(vehicle.condition || "good").toLowerCase()} condition. Equipped with a ${vehicle.specs?.engine || "well-maintained"} engine and ${String(vehicle.specs?.transmission || "reliable").toLowerCase()} transmission.`;
  const endingDate = vehicle.endingAt ? new Date(vehicle.endingAt).getTime() : null;
  const timeLeftText = (() => {
    if (!endingDate || Number.isNaN(endingDate)) return "Auction end date unavailable";
    const diff = endingDate - Date.now();
    if (diff <= 0) return "Auction ended";
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  })();

  const handlePlaceBid = async () => {
    const firebaseUser = auth.currentUser;
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const numericBidAmount = Number(bidAmount);
    
    if (!firebaseUser) {
      toast.error("Please login to place a bid");
      return;
    }

    if (vehicle.ownerId && vehicle.ownerId === firebaseUser.uid) {
      toast.error("You cannot bid on your own vehicle");
      return;
    }
    
    if (!numericBidAmount || numericBidAmount <= currentPrice) {
      toast.error("Bid must be higher than current price");
      return;
    }

    const increment = numericBidAmount - currentPrice;
    if (increment % 5000 !== 0) {
      toast.error("Bid increase must be in Rs. 5,000 increments");
      return;
    }

    try {
      const response = await bidsAPI.create({
        vehicleId: vehicle.id,
        amount: numericBidAmount,
        bidderId: firebaseUser.uid,
        bidderName: firebaseUser.displayName || storedUser?.displayName || "Anonymous",
        bidderEmail: firebaseUser.email || storedUser?.email || "",
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

  const openBidModal = () => {
    setBidAmount(String(currentPrice + 5000));
    setIsBidModalOpen(true);
  };

  const selectedAuctionDays = Number(vehicle.auctionDays) > 0 ? Number(vehicle.auctionDays) : 7;
  const auctionStartAt = vehicle.createdAt ? new Date(vehicle.createdAt).getTime() : Date.now();

  // Build day-based price progression where x-axis is 0..selectedAuctionDays
  // and the first/lowest point is always starting bid.
  const priceHistory = [
    { day: 0, price: startingBid },
    ...((vehicle.bids ?? []) as any[])
      .map((bid) => {
        const bidTime = bid.createdAt ? new Date(bid.createdAt).getTime() : auctionStartAt;
        const rawDay = Math.floor((bidTime - auctionStartAt) / (1000 * 60 * 60 * 24));
        const day = Math.min(selectedAuctionDays, Math.max(0, rawDay));
        return { day, price: Math.max(startingBid, Number(bid.amount) || startingBid) };
      })
      .sort((a, b) => a.day - b.day),
  ];

  const formatK = (value: number) =>
    value >= 1_000_000
      ? `${(value / 1_000_000).toFixed(1)}M`
      : value >= 1_000
      ? `${(value / 1_000).toFixed(0)}k`
      : String(value);

  const basePrice = vehicle.basePrice ?? startingBid;

  const handleToggleFavourite = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    try {
      const response = isFavourite
        ? await favoritesAPI.removeFavorite(String(vehicle.id))
        : await favoritesAPI.addFavorite(String(vehicle.id));

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      const ids = Array.isArray(response?.favorites) ? response.favorites : [];
      const nowFavourite = ids.includes(String(vehicle.id));
      setIsFavourite(nowFavourite);
      toast.success(nowFavourite ? "Added to favourites" : "Removed from favourites");
    } catch {
      toast.error("Failed to update favourites");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to="/" className="text-[#00a8e8] hover:underline">Home</Link>
        {" / "}
        <Link to="/" className="text-[#00a8e8] hover:underline">All Ads</Link>
        {" / "}
        <span>{vehicle.make} {vehicle.model}</span>
      </div>

      {/* â”€â”€ Hero: Image | Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left â€“ Vehicle Image */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm p-3 space-y-3">
          <img
            src={primaryImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-[420px] object-contain bg-gray-100 rounded-xl cursor-zoom-in"
            onClick={() => setIsImageModalOpen(true)}
          />

          {vehicleImages.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">
                {vehicleImages.length} Photos Available
              </p>
              <div className="grid grid-cols-5 gap-2">
                {vehicleImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsImageModalOpen(true);
                    }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      index === activeImageIndex
                        ? "border-[#00a8e8]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${vehicle.make} ${vehicle.model} photo ${index + 1}`}
                      className="w-full h-14 object-contain bg-gray-100"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right â€“ Info Panel */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {vehicle.make} {vehicle.model} {vehicle.year} â€“{" "}
              <span className="text-gray-600 font-medium">{vehicle.condition} Condition</span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFavourite}
                className="flex-shrink-0 p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart className={`h-5 w-5 ${isFavourite ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
              </button>

              {vehicle.category && (
                <span className="flex-shrink-0 flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700 border border-blue-200 rounded-full">
                  <Tag className="h-3 w-3" />
                  {vehicle.category}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.location || "Location not specified"}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {vehicleDescription}
          </p>

          {/* Negotiable banner */}
          {vehicle.negotiationEnabled && (
            <div className="flex items-center gap-2 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-800">
              <MessageCircle className="h-4 w-4 flex-shrink-0 text-sky-500" />
              <span>
                <strong>Price is negotiable</strong> â€“ Seller is open to reasonable offers
              </span>
            </div>
          )}

          {/* â”€â”€ 4-stat grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Base Price</p>
              <p className="text-sm font-bold text-gray-800">
                Rs. {basePrice.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-emerald-600 mb-1">Starting Bid</p>
              <p className="text-sm font-bold text-emerald-700">
                Rs. {startingBid.toLocaleString()}
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-indigo-500 mb-1">Current Price</p>
              <p className="text-lg font-extrabold text-indigo-700">
                Rs. {currentPrice.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Total Bids</p>
              <p className="text-sm font-bold text-gray-800">
                {vehicle.bidsCount ?? vehicle.bids?.length ?? 0}
              </p>
            </div>
          </div>

          {/* Time remaining */}
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
            <Clock className="h-4 w-4 flex-shrink-0 text-red-500" />
            <span>Time Remaining: <strong>{timeLeftText}</strong></span>
          </div>

          {/* Price Progression chart (only when negotiation is enabled) */}
          {vehicle.negotiationEnabled && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Price Progression</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={priceHistory} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    dataKey="day"
                    domain={[0, selectedAuctionDays]}
                    ticks={Array.from({ length: selectedAuctionDays + 1 }, (_, i) => i)}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: "Days in Auction", position: "insideBottom", offset: -2, fill: "#6b7280", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={formatK}
                    domain={[startingBid, "auto"]}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    label={{ value: "Price (Rs.)", angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v: number | string | undefined) => [
                      `Rs. ${Number(v ?? 0).toLocaleString()}`,
                      "Price",
                    ]}
                    labelFormatter={(label) => `Day ${String(label)}`}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={(dotProps: any) => {
                      const isStartPoint = dotProps?.payload?.day === 0;
                      return (
                        <circle
                          cx={dotProps.cx}
                          cy={dotProps.cy}
                          r={isStartPoint ? 6 : 4}
                          fill={isStartPoint ? "#ef4444" : "#6366f1"}
                          stroke="white"
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Track how the price has changed throughout the auction period
              </p>
            </div>
          )}

          {/* Place Bid button */}
          <button
            onClick={openBidModal}
            disabled={isOwnerViewing}
            className="w-full py-3.5 bg-[#00a8e8] hover:bg-[#0096d1] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-colors"
          >
            {isOwnerViewing ? "Your Own Vehicle" : "Place Bid"}
          </button>
          {isOwnerViewing && (
            <p className="text-xs text-amber-700 text-center -mt-2">
              Bidding is disabled for your own listing.
            </p>
          )}
        </div>
      </div>

      {/* â”€â”€ Specs strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Gauge className="h-4 w-4" />, label: "Mileage", value: vehicle.specs?.mileage || "N/A" },
          { icon: <Settings className="h-4 w-4" />, label: "Transmission", value: vehicle.specs?.transmission || "N/A" },
          { icon: <Fuel className="h-4 w-4" />, label: "Fuel", value: vehicle.specs?.fuel || "N/A" },
          { icon: <Calendar className="h-4 w-4" />, label: "Engine", value: vehicle.specs?.engine || "N/A" },
        ].map((spec) => (
          <div key={spec.label} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <span className="text-gray-400">{spec.icon}</span>
            <div>
              <p className="text-xs text-gray-400">{spec.label}</p>
              <p className="text-sm font-semibold text-gray-800">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Bid history + Seller â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bid History */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Bid History</h3>
          {vehicle.bids && vehicle.bids.length > 0 ? (
            <div className="space-y-2">
              {[...vehicle.bids].reverse().map((bid: any) => (
                <div key={bid.id ?? bid._id} className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{bid.bidderName ?? "Anonymous"}</span>
                  <span className="font-bold text-emerald-700">Rs. {bid.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No bids yet. Be the first!</p>
          )}
        </div>

        {/* Seller Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900">Seller</h3>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{sellerName}</p>
              <div className="flex text-yellow-400 text-xs">{"â˜…".repeat(5)}</div>
            </div>
          </div>
          <div className="text-xs space-y-1.5 text-gray-600">
            <div className="flex justify-between">
              <span>Condition</span>
              <span className="font-semibold text-gray-800">{vehicle.condition}</span>
            </div>
            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-semibold text-gray-800">{vehicle.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Min. increment</span>
              <span className="font-semibold text-gray-800">Rs. 5,000</span>
            </div>
          </div>
          <button className="w-full py-2 border border-gray-300 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            Contact Seller
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={primaryImage}
              alt={`${vehicle.make} ${vehicle.model} preview`}
              className="w-full max-h-[85vh] object-contain rounded-2xl bg-black"
            />
          </div>
        </div>
      )}

      {/* â”€â”€ Bid Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isBidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Place Your Bid</h2>
              <button onClick={() => setIsBidModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Current Bid</p>
                  <p className="font-bold text-gray-900">Rs. {currentPrice.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <p className="text-xs text-indigo-500 mb-1">Min Next Bid</p>
                  <p className="font-bold text-indigo-700">Rs. {(currentPrice + 5000).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Bid Amount (Rs.)</label>
                <input
                  type="number"
                  step="5000"
                  min={currentPrice + 5000}
                  placeholder="Enter amount"
                  value={bidAmount}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {[5000, 10000, 25000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmount(String(currentPrice + inc))}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
                  >
                    +{(inc / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <strong>Note:</strong> Bid increase must be in Rs. 5,000 increments.
              </div>

              <button
                onClick={handlePlaceBid}
                className="w-full py-3 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded-xl font-bold text-base transition-colors"
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
