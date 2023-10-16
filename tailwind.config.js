/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,jsx,ts,tsx}",
  "./src/components/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {colors: {
      brand: {
        teal: 'rgb(45 212 191);',
        dark: 'rgb(17 24 39);',
      },
    },},
  },
  plugins: [],
}

