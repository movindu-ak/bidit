const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";


// Auth API
export const authAPI = {
  signup: async (idToken: string, displayName: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ displayName }),
    });

    return response.json();
  },

  login: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.json();
  },

  me: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (filters?: {
    make?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.make) params.append("make", filters.make);
    if (filters?.condition) params.append("condition", filters.condition);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

    const response = await fetch(`${API_BASE_URL}/vehicles?${params}`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    return response.json();
  },

  create: async (vehicleData: any) => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    });
    return response.json();
  },

  update: async (id: string, vehicleData: any) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    });
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  getMyVehicles: async (ownerId: string) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/owner/${ownerId}`);
    return response.json();
  },
};

// Bids API
export const bidsAPI = {
  create: async (bidData: {
    vehicleId: string;
    amount: number;
    bidderId: string;
    bidderName: string;
    bidderEmail: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bidData),
    });
    return response.json();
  },

  getVehicleBids: async (vehicleId: string) => {
    const response = await fetch(`${API_BASE_URL}/bids/vehicle/${vehicleId}`);
    return response.json();
  },

  getUserBids: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/bids/user/${userId}`);
    return response.json();
  },
};
