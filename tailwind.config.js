/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        DMSans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'tabiBlue': '#268DC7',
        'tabiBlueDark': '#0070AE',
        'white': '#FFFFFF'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};