import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Clock, MapPin } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { bidsAPI } from "../../services/api";
import { useTranslation } from "react-i18next";

type MyBid = {
  id: string;
  vehicleId: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    image?: string;
    location?: string;
  };
  myBid: number;
  currentPrice: number;
  status: "Winning" | "Outbid";
  date: string;
};

export function MyBids() {
  const { t } = useTranslation();
  const [myBids, setMyBids] = useState<MyBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setMyBids([]);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setLoading(true);

      try {
        const response = await bidsAPI.getUserBids(user.uid);
        const bids = Array.isArray(response?.bids)
          ? response.bids
          : Array.isArray(response)
          ? response
          : [];
        setMyBids(bids);
      } catch {
        setMyBids([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatBidDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return t("myBids.recently");
    return parsed.toLocaleDateString("en-CA");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">Home</Link> / 
        <span> {t("myBids.title")}</span>
      </div>

      <h1 className="text-2xl font-bold">{t("myBids.title")}</h1>

      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          {t("myBids.loading")}
        </div>
      )}

      {!loading && !isAuthenticated && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">{t("myBids.loginPrompt")}</p>
          <Link
            to="/auth"
            className="inline-block px-6 py-2 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded transition-colors"
          >
            {t("header.login")}
          </Link>
        </div>
      )}

      {!loading && isAuthenticated && myBids.length > 0 && (
      <div className="space-y-4">
        {myBids.map((v) => (
          (() => {
            const sellerTopic = `${v.vehicle?.make ?? ""} ${v.vehicle?.model ?? ""}`.trim();
            const sellerTopicLower = sellerTopic.toLowerCase();
            const yearText = String(v.vehicle?.year ?? "").trim();
            const hasYearInTopic = yearText.length > 0 && sellerTopicLower.includes(yearText.toLowerCase());
            const adTitle = `${sellerTopic}${!hasYearInTopic && yearText ? ` ${yearText}` : ""}`.trim();

            return (
          <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <img 
                  src={v.vehicle?.image || "https://placehold.co/400x300?text=No+Image"}
                  alt={`${v.vehicle?.make} ${v.vehicle?.model}`}
                  className="w-48 h-36 object-cover rounded"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 text-xs rounded ${
                    v.status === "Winning" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {v.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {adTitle}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{v.vehicle?.location || t("myBids.locationNotSet")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t("myBids.bidPlacedOn")} {formatBidDate(v.date)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">{t("myBids.yourBid")}</p>
                    <p className="font-bold text-gray-900">Rs. {v.myBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t("myBids.currentPrice")}</p>
                    <p className={`font-bold ${v.status === "Outbid" ? "text-red-600" : "text-green-600"}`}>
                      Rs. {v.currentPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center">
                <Link 
                  to={`/vehicle/${v.vehicleId}`}
                  className="px-4 py-2 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded text-sm transition-colors"
                >
                  {t("common.viewDetails")}
                </Link>
              </div>
            </div>
          </div>
            );
          })()
        ))}
      </div>
      )}

      {!loading && isAuthenticated && myBids.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">{t("myBids.noBids")}</p>
          <Link 
            to="/"
            className="inline-block px-6 py-2 bg-[#00a8e8] hover:bg-[#0096d1] text-white rounded transition-colors"
          >
            {t("myBids.browse")}
          </Link>
        </div>
      )}
    </div>
  );
}