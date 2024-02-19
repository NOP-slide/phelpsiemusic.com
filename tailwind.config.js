/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'formDark': '0px 2px 4px rgba(0, 0, 0, 0.5), 0px 1px 6px rgba(0, 0, 0, 0.25)',
        'formLight': '0px 0px 0px 3px rgba(43, 212, 189, 0.25), 0px 1px 1px 0px rgba(255, 255, 255, 0.12)',
        'formError': '0px 2px 4px rgba(0, 0, 0, 0.5), 0px 1px 6px rgba(0, 0, 0, 0.25), 0 0 0 1px rgb(254, 135, 161)',
      },
      width: {
        'big-cart': '30rem',
        'small-cart': '21rem',
      },
      colors: {
        brand: {
          teal: "rgb(45 212 191);",
          tealTranslucent: "rgba(45, 212, 191, 0.15)",
          tealShadow: "rgba(45, 212, 191, 0.35)",
          tealDark: "rgba(45, 212, 191, 0.03);",
          dark: "rgb(17 24 39);",
          darkInactiveTab: "rgba(17, 24, 39, 0.5)",
          formInputBorder: "rgba(43, 212, 189, 0.4)",
          formInputNormalBorder: "rgb(66, 67, 83)",
          formError: "rgb(254, 135, 161)",
        },
      },
    },
  },
  plugins: [],
}
