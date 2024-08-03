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
        gray_50: '#b5a26f',
        gray_30: '#f1f1f1',
        green_300: '#00cf00',
        green_500: '#2ab523',
        green_700: '#4aae51',
        green_800: '#067215',
        red_700: '#e2002e',
        yellow_600: '#f9a825',
      },
    },
    animation: {
      'slide-left': 'slide-left 0.2s ease-out',
      'slide-right': 'slide-right 0.2s ease-in',
    },
    keyframes: {
      'slide-left': {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' },
      },
      'slide-right': {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(100%)' },
      },
    },
  },
  plugins: [],
};
