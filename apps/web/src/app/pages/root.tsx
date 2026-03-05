import { Outlet, Link } from "react-router";
import { 
  Car, 
  Heart, 
  Truck,
  Bus
} from "lucide-react";

export function Root() {

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
              <Link 
                to="/add-vehicle"
                className="bg-[#ff6b35] hover:bg-[#ff5722] px-6 py-2 rounded text-sm transition-colors"
              >
                + Post Free Vehicle Ad
              </Link>
              <Link to="/auth" className="hover:underline text-sm">
                Login
              </Link>
              <Link to="/my-ads" className="hover:underline text-sm">
                My Ads
              </Link>
              <button className="hover:underline text-sm">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <Link to="/" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-sm">Buy Cars</span>
            </Link>
            <Link to="/" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Truck className="h-6 w-6" />
              </div>
              <span className="text-sm">Buy SUVs</span>
            </Link>
            <Link to="/" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Bus className="h-6 w-6" />
              </div>
              <span className="text-sm">Buy Vans</span>
            </Link>
            <Link to="/my-bids" className="flex flex-col items-center gap-2 text-gray-700 hover:text-[#00a8e8] transition-colors">
              <div className="bg-gray-100 p-4 rounded">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-sm">My Bids</span>
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
              <h4 className="font-bold mb-4">AutoBid Sri Lanka</h4>
              <p className="text-sm text-gray-400">
                The trusted vehicle auction platform for Sri Lankan buyers and sellers.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">Browse Vehicles</Link></li>
                <li><Link to="/add-vehicle" className="hover:text-white">Post an Ad</Link></li>
                <li><Link to="/my-bids" className="hover:text-white">My Bids</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                support@autobid.lk<br />
                +94 11 234 5678
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © 2026 AutoBid Sri Lanka. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}