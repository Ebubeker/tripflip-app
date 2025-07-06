/** @type {import('tailwindcss').Config} */

module.exports = {

  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF8CBE"
      },
      fontFamily: {
        'lato': ['Lato-Regular'],
        'lato-light': ['Lato-Light'],
        'lato-bold': ['Lato-Bold'],
        'lato-black': ['Lato-Black'],
      },
    },
  },
  plugins: [],
}