/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          peach: '#E99E75',
          purple: '#44426E',
          mauve: '#776483',
          lavender: '#BBAAB8',
          navy: '#292643',
        },
        custom: {
          peach: '#E99E75',
          purple: '#44426E',
          mauve: '#776483',
          lavender: '#BBAAB8',
          navy: '#292643',
        },
      },
      backgroundColor: {
        'gradient-peach-purple': 'linear-gradient(to right, #E99E75, #44426E)',
      },
    },
  },
  plugins: [],
}