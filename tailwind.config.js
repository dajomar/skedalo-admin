/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',       // equivalente a --primary-color
        secondary: '#f1f5f9',     // equivalente a --secondary-color
        'text-primary': '#111827',   // equivalente a --text-primary
        'text-secondary': '#6b7280', // equivalente a --text-secondary
        "background-light": "#FFFFFF",
        "background-dark": "#121212",
      },
      fontFamily: {
        display: ["Roboto", "sans-serif"],
        // display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
}

// colors: {
//   primary: "#13a4ec",
//   "background-light": "#f6f7f8",
//   "background-dark": "#101c22",
  
// },