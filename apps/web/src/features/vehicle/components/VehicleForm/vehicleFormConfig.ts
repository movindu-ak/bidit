import type { SelectGroup, SelectOption } from "../inputs/SelectField";

// ── Year options ───────────────────────────────────────────────
export const YEAR_OPTIONS: SelectOption[] = Array.from({ length: 36 }, (_, i) => {
  const y = 2025 - i;
  return { value: y, label: String(y) };
});

// ── Brand groups ───────────────────────────────────────────────
const toOptions = (labels: string[]): SelectOption[] =>
  labels.map((label) => ({ value: label, label }));

export const BRAND_GROUPS: SelectGroup[] = [
  {
    label: "Japanese",
    options: toOptions([
      "Toyota", "Suzuki", "Nissan", "Honda", "Mazda",
      "Mitsubishi", "Subaru", "Daihatsu", "Isuzu",
    ]),
  },
  {
    label: "Korean",
    options: toOptions(["Hyundai", "Kia"]),
  },
  {
    label: "German",
    options: toOptions(["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Porsche"]),
  },
  {
    label: "European",
    options: toOptions(["Volvo", "Land Rover", "Jaguar", "MINI", "Peugeot", "Renault", "Skoda", "Fiat"]),
  },
  {
    label: "American",
    options: toOptions(["Ford", "Chevrolet", "Jeep", "Tesla", "Dodge", "GMC", "Cadillac"]),
  },
  {
    label: "Chinese",
    options: toOptions(["BYD", "Chery", "MG", "Geely", "Great Wall", "Haval"]),
  },
  {
    label: "Indian",
    options: toOptions(["Tata", "Mahindra", "Ashok Leyland", "Force Motors"]),
  },
];

// ── Simple dropdown options ────────────────────────────────────
export const CATEGORY_OPTIONS: SelectOption[] = toOptions([
  "Sedan", "SUV", "Hatchback", "Van", "Pickup", "Sports", "Electric",
]);

export const CONDITION_OPTIONS: SelectOption[] = toOptions([
  "New", "Excellent", "Good", "Fair",
]);

export const PREVIOUS_OWNERS_OPTIONS: SelectOption[] = [
  { value: "0", label: "0 — I am the first owner" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "5+", label: "5+" },
];

export const INSURANCE_CLAIMS_OPTIONS: SelectOption[] = [
  { value: "0", label: "No claims" },
  { value: "1", label: "1 claim" },
  { value: "2", label: "2 claims" },
  { value: "3", label: "3 claims" },
  { value: "4", label: "4 claims" },
  { value: "5+", label: "5 or more claims" },
];

// ── Tile selector options ──────────────────────────────────────
export const FUEL_OPTIONS = [
  { value: "Petrol",   icon: "⛽",  label: "Petrol"    },
  { value: "Diesel",   icon: "🛢️",  label: "Diesel"    },
  { value: "CNG",      icon: "💨",  label: "CNG"       },
  { value: "Hybrid",   icon: "🔋",  label: "Hybrid"    },
  { value: "Electric", icon: "⚡",  label: "Electric"  },
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "Manual",    icon: "🔧", label: "Manual"    },
  { value: "Automatic", icon: "⚙️", label: "Automatic" },
  { value: "Tiptronic", icon: "🔄", label: "Tiptronic" },
  { value: "Other",     icon: "🛠️", label: "Other"     },
] as const;

export const USAGE_OPTIONS = [
  { value: "Personal",  icon: "🏠",  label: "Personal"  },
  { value: "Commute",   icon: "🏢",  label: "Commute"   },
  { value: "Business",  icon: "💼",  label: "Business"  },
  { value: "Off-Road",  icon: "🏔️",  label: "Off-Road"  },
  { value: "Rental",    icon: "🔑",  label: "Rental"    },
] as const;

// ── Condition slider configuration ─────────────────────────────
export const CONDITION_SLIDERS = [
  {
    key: "tireCondition"     as const,
    label: "Tire Condition",
    min: "Poor",    mid: "Fair",      max: "Excellent",
    color: "#6366f1",
  },
  {
    key: "batteryCondition"  as const,
    label: "Battery Condition",
    min: "Weak",    mid: "Moderate",  max: "Strong",
    color: "#22c55e",
  },
  {
    key: "interiorCondition" as const,
    label: "Interior Condition",
    min: "Worn",    mid: "Good",      max: "Pristine",
    color: "#f59e0b",
  },
  {
    key: "exteriorCondition" as const,
    label: "Exterior Condition",
    min: "Damaged", mid: "Average",   max: "Flawless",
    color: "#14b8a6",
  },
] as const;

// ── Bidding duration options ───────────────────────────────────
export const BIDDING_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
