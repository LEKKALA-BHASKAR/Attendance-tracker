module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",      // Custom primary color (blue-500)
        secondary: "#10B981",    // Custom secondary color (emerald-500)
        danger: "#EF4444",       // Custom danger color (red-500)
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Custom font
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),    // Adds better form styling
    require("@tailwindcss/typography") // Better prose/typography
  ],
}