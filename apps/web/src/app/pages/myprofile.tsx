import { useEffect, useState } from "react";
import { Link } from "react-router";
import { onAuthStateChanged, updateProfile as firebaseUpdateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import {
  User as UserIcon,
  Mail,
  Phone,
  Pencil,
  Check,
  X,
  Gavel,
  Heart,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { auth } from "../../firebase/firebase";
import { authAPI, bidsAPI } from "../../services/api";

// ── Stat card ─────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ── Editable field row ────────────────────────────────────────
function EditableRow({
  label,
  value,
  icon,
  editing,
  editValue,
  onEditValue,
  onStartEdit,
  onSave,
  onCancel,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  editing: boolean;
  editValue: string;
  onEditValue: (v: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
          {editing ? (
            <input
              autoFocus
              type={type}
              value={editValue}
              onChange={(e) => onEditValue(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-[#00a8e8] rounded px-3 py-1.5 text-sm focus:outline-none"
            />
          ) : (
            <p className="text-sm font-medium text-gray-900 truncate">
              {value || <span className="text-gray-400 italic">Not set</span>}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
        {editing ? (
          <>
            <button
              type="button"
              onClick={onSave}
              className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="p-1.5 text-gray-400 hover:text-[#00a8e8] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function MyProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Profile fields
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  // Edit state
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Stats
  const [totalBids, setTotalBids] = useState<number>(0);
  const [favourites] = useState<number>(0); // extend when favourites feature is added
  const [walletBalance] = useState<number>(0); // extend when wallet feature is added

  const [saving, setSaving] = useState(false);

  // ── Load user on mount ──────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);

      if (firebaseUser) {
        setUsername(firebaseUser.displayName || "");
        setPhone(firebaseUser.phoneNumber || "");

        // Fetch backend profile for extra fields (phone stored in backend)
        try {
          const idToken = await firebaseUser.getIdToken();
          const data = await authAPI.me(idToken);
          if (data?.phoneNumber) setPhone(data.phoneNumber);
          if (data?.displayName && !firebaseUser.displayName)
            setUsername(data.displayName);
        } catch {
          // backend may be offline — use Firebase data only
        }

        // Load total bids count
        try {
          const bids = await bidsAPI.getUserBids(firebaseUser.uid);
          if (Array.isArray(bids)) setTotalBids(bids.length);
        } catch {
          // ignore
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // ── Save username ───────────────────────────────────────────
  const handleSaveUsername = async () => {
    if (!editUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setSaving(true);
    try {
      if (user) await firebaseUpdateProfile(user, { displayName: editUsername.trim() });
      setUsername(editUsername.trim());
      setEditingUsername(false);
      toast.success("Username updated");
    } catch {
      toast.error("Failed to update username");
    } finally {
      setSaving(false);
    }
  };

  // ── Save phone ──────────────────────────────────────────────
  const handleSavePhone = async () => {
    setSaving(true);
    try {
      // Store phone via backend if available; fall back to local state
      if (user) {
        const idToken = await user.getIdToken();
        await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ phoneNumber: editPhone.trim() }),
          }
        ).catch(() => null); // non-fatal if endpoint not wired yet
      }
      setPhone(editPhone.trim());
      setEditingPhone(false);
      toast.success("Phone number updated");
    } catch {
      toast.error("Failed to update phone number");
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar initials ─────────────────────────────────────────
  const initials = username
    ? username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  // ── Loading / unauthenticated ───────────────────────────────
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="animate-spin h-6 w-6 border-2 border-[#00a8e8] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-4">
        <UserIcon className="h-16 w-16 text-gray-300 mx-auto" />
        <p className="text-gray-600">Please log in to view your profile.</p>
        <Link
          to="/auth"
          className="inline-block bg-[#00a8e8] text-white px-6 py-2 rounded hover:bg-[#008ec5] transition-colors text-sm"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/" className="text-[#00a8e8] hover:underline">
          Home
        </Link>{" "}
        /<span> My Profile</span>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* Avatar + heading */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#00a8e8] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{username || "No name set"}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.metadata.creationTime && (
              <p className="text-xs text-gray-400 mt-0.5">
                Member since{" "}
                {new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* ── Editable fields ── */}
        <div className="rounded-xl border border-gray-100 overflow-hidden px-4">
          {/* Username */}
          <EditableRow
            label="Username"
            value={username}
            icon={<UserIcon className="h-4 w-4" />}
            editing={editingUsername}
            editValue={editUsername}
            onEditValue={setEditUsername}
            onStartEdit={() => {
              setEditUsername(username);
              setEditingUsername(true);
            }}
            onSave={handleSaveUsername}
            onCancel={() => setEditingUsername(false)}
            placeholder="Enter your name"
          />

          {/* Email — read-only */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-gray-400 flex-shrink-0">
                <Mail className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
            </div>
            <span className="ml-3 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
              Read-only
            </span>
          </div>

          {/* Phone */}
          <EditableRow
            label="Phone Number"
            value={phone}
            icon={<Phone className="h-4 w-4" />}
            editing={editingPhone}
            editValue={editPhone}
            onEditValue={setEditPhone}
            onStartEdit={() => {
              setEditPhone(phone);
              setEditingPhone(true);
            }}
            onSave={handleSavePhone}
            onCancel={() => setEditingPhone(false)}
            placeholder="+94 77 000 0000"
            type="tel"
          />
        </div>

        {saving && (
          <p className="text-xs text-gray-400 text-center mt-3">Saving…</p>
        )}
      </div>

      {/* ── Stats ── */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">Activity Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Gavel className="h-5 w-5 text-[#00a8e8]" />}
            label="Total Bids"
            value={totalBids}
            color="bg-blue-50"
          />
          <StatCard
            icon={<Heart className="h-5 w-5 text-rose-500" />}
            label="Favourites"
            value={favourites}
            color="bg-rose-50"
          />
          <StatCard
            icon={<Wallet className="h-5 w-5 text-emerald-600" />}
            label="Wallet Balance"
            value={`Rs. ${walletBalance.toLocaleString()}`}
            color="bg-emerald-50"
          />
        </div>
      </div>
    </div>
  );
}
