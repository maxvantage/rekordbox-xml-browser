/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0d0d12',
          800: '#13131a',
          700: '#1a1a24',
          600: '#22222f',
          500: '#2a2a3a',
          400: '#363648',
        },
        accent: {
          purple: '#8b5cf6',
          teal: '#2dd4bf',
          pink: '#f472b6',
          amber: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
};

