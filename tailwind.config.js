/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1020',
        surface: '#121A2B',
        'surface-2': '#16203A',
        primary: {
          DEFAULT: '#367CF6',
          hover: '#2A6BE0',
          light: '#69A5FF',
        },
        accent: '#69A5FF',
        'text-main': '#EEF2F9',
        'text-secondary': '#8A9BB8',
        'border-default': '#1E2A42',
        'border-hover': '#2A3A5A',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
