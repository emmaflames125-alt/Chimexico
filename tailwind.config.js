/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mexico: {
          green: "#006400",
          red: "#C8102E",
          gold: "#FFD700"
        }
      }
    }
  },
  plugins: [],
}