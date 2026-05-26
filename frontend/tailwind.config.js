/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        graphite: "#111111",
        platinum: "#f7f7f2",
        line: "rgba(255,255,255,0.12)",
        mint: "#a7f3d0",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px rgba(255,255,255,0.12)",
        premium: "0 24px 80px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "luxury-grid":
          "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
