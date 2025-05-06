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
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'loading-progress': 'loading 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        loading: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}