/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "2xs": "2.5rem",
      },
      colors: {
        "primary-orange": "#FF5722",
        "dark-blue-bg": "#2C5050",
        glassmorphism: "rgba(16, 16, 18, 0.60)",
      },
      screens: {
        xs: "400px",
      },
      spacing: {
        15: "3.75rem",
        25: "6.25rem",
      },
    },
  },
  plugins: [],
};
