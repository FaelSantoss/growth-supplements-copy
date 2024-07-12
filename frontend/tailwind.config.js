/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue_primary: '#1899D5',
        gray_200: '#858585',
        gray_100: '#DFDFDF',
        green_300: '#2CB424'
      },
    },
  },
  plugins: [],
}
