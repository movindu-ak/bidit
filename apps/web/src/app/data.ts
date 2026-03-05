export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  basePrice: number;
  currentPrice: number;
  startingBid: number;
  bidsCount: number;
  location: string;
  condition: "New" | "Excellent" | "Good" | "Fair";
  category: "Sedan" | "SUV" | "Sports" | "Electric";
  specs: {
    mileage: string;
    engine: string;
    transmission: string;
    fuel: string;
  };
  seller: {
    name: string;
    rating: number;
    avatar: string;
  };
  endingAt: string;
  history: { day: number; price: number }[];
}

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    make: "Porsche",
    model: "911 Carrera",
    year: 2023,
    image: "https://images.unsplash.com/photo-1654425210135-78ab49d8507a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBwb3JzY2hlJTIwYm13JTIwdGVzbGF8ZW58MXx8fHwxNzcxMzk0ODg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    basePrice: 120000,
    currentPrice: 135000,
    startingBid: 110000,
    bidsCount: 14,
    location: "Los Angeles, CA",
    condition: "Excellent",
    category: "Sports",
    specs: {
      mileage: "1,200 mi",
      engine: "3.0L Flat-6",
      transmission: "8-Speed PDK",
      fuel: "Gasoline"
    },
    seller: {
      name: "Luxury Autos LA",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/150?u=luxury"
    },
    endingAt: "2026-02-20T18:00:00Z",
    history: [
      { day: 1, price: 110000 },
      { day: 2, price: 115000 },
      { day: 3, price: 115000 },
      { day: 4, price: 122000 },
      { day: 5, price: 128000 },
      { day: 6, price: 135000 },
    ]
  },
  {
    id: "2",
    make: "BMW",
    model: "M4 Competition",
    year: 2024,
    image: "https://images.unsplash.com/photo-1646217317235-b1c589b2e440?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBtNCUyMGJsdWV8ZW58MXx8fHwxNzcxMzk0ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    basePrice: 85000,
    currentPrice: 92000,
    startingBid: 80000,
    bidsCount: 8,
    location: "Miami, FL",
    condition: "New",
    category: "Sports",
    specs: {
      mileage: "45 mi",
      engine: "3.0L Inline-6",
      transmission: "Automatic",
      fuel: "Gasoline"
    },
    seller: {
      name: "Elite Motors",
      rating: 4.8,
      avatar: "https://i.pravatar.cc/150?u=elite"
    },
    endingAt: "2026-02-22T12:00:00Z",
    history: [
      { day: 1, price: 80000 },
      { day: 3, price: 85000 },
      { day: 5, price: 92000 },
    ]
  },
  {
    id: "3",
    make: "Mercedes-Benz",
    model: "G 63 AMG",
    year: 2022,
    image: "https://images.unsplash.com/photo-1709473559904-78a8048a2371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMGJlbnolMjBnJTIwd2Fnb24lMjBibGFja3xlbnwxfHx8fDE3NzEzOTQ4OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    basePrice: 180000,
    currentPrice: 195000,
    startingBid: 175000,
    bidsCount: 22,
    location: "New York, NY",
    condition: "Excellent",
    category: "SUV",
    specs: {
      mileage: "8,500 mi",
      engine: "4.0L V8 Biturbo",
      transmission: "9-Speed Automatic",
      fuel: "Gasoline"
    },
    seller: {
      name: "Gotham Exotics",
      rating: 5.0,
      avatar: "https://i.pravatar.cc/150?u=gotham"
    },
    endingAt: "2026-02-19T20:00:00Z",
    history: [
      { day: 1, price: 175000 },
      { day: 2, price: 178000 },
      { day: 3, price: 182000 },
      { day: 4, price: 188000 },
      { day: 5, price: 195000 },
    ]
  }
];
