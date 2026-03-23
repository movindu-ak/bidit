import { Outlet, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../../shared/components/LanguageToggle";
import { 
  Car, 
  Bike,
  Truck,
  Bus,
  Pickaxe,
  UserCircle,
} from "lucide-react";

export function Root() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success(t("header.toast.logoutSuccess"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top Header - Blue */}
      <header className="bg-[#00a8e8] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8" />
              <span className="text-2xl">AutoBid</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Link 
                to="/add-vehicle"
                className="bg-[#ff6b35] hover:bg-[#ff5722] px-6 py-2 rounded text-sm transition-colors"
              >
                {t("header.postAd")}
              </Link>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
                >
                  {t("header.logout")}
                </button>
              ) : (
                <Link to="/auth" className="hover:underline text-sm">
                  {t("header.login")}
                </Link>
              )}
              <Link to="/my-ads" className="hover:underline text-sm">
                {t("header.myAds")}
              </Link>
              {user && (
                <Link
                  to="/profile"
                  className="flex items-center gap-1 hover:underline text-sm"
                >
                  <UserCircle className="h-4 w-4" />
                  {t("header.myProfile")}
                </Link>
              )}
              <button className="hover:underline text-sm">
                {t("header.contactUs")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <Link to="/?category=Cars" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyCars")}</span>
            </Link>
            <Link to="/?category=SUVs" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buySUVs")}</span>
            </Link>
            <Link to="/?category=Vans" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Bus className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyVans")}</span>
            </Link>
            <Link to="/?category=Motorbikes" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Bike className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyMotorbikes")}</span>
            </Link>
            <Link to="/?category=Lorries" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Truck className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyLorries")}</span>
            </Link>
            <Link to="/?category=Three Wheels" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Bus className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyThreeWheels")}</span>
            </Link>
            <Link to="/?category=Pickups" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Truck className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyPickups")}</span>
            </Link>
            <Link to="/?category=Heavy-Duty" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Pickaxe className="h-6 w-6" />
              </div>
              <span className="text-sm">{t("categories.buyHeavyDuty")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 min-h-[calc(100vh-20rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">{t("footer.brand")}</h4>
              <p className="text-sm text-gray-400">
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.quickLinks")}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">{t("footer.browseVehicles")}</Link></li>
                <li><Link to="/add-vehicle" className="hover:text-white">{t("footer.postAd")}</Link></li>
                <li><Link to="/my-bids" className="hover:text-white">{t("footer.myBids")}</Link></li>
                <li><Link to="/favourites" className="hover:text-white">{t("footer.favourites")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.contact")}</h4>
              <p className="text-sm text-gray-400">
                support@autobid.lk<br />
                +94 11 234 5678
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            {t("footer.rights")}
          </div>
        </div>
      </footer>
    </div>
  );
}