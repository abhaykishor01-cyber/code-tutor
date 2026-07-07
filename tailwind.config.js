/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0e1a",
          900: "#0f1524",
          800: "#161d33",
          700: "#1f2942",
        },
        gold: {
          400: "#e8c674",
          500: "#d4af37",
          600: "#b8932c",
        },
      },
    },
  },
  plugins: [],
};
