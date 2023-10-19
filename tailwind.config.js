/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'big-cart': '30rem',
        'small-cart': '21rem',
      },
      colors: {
        brand: {
          teal: "rgb(45 212 191);",
          tealDark: "rgba(45, 212, 191, 0.03);",
          dark: "rgb(17 24 39);",
        },
      },
    },
  },
  plugins: [],
}
