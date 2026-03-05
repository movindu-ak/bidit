/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        accent: "#2563EB",
        bid: "#DC2626",
        dark: "#111827",
      },
    },
  },
  plugins: [],
};
