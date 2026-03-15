/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1e',
          800: '#0d1530',
          700: '#111d42',
          600: '#162154',
        },
        electric: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        ice: {
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
        },
      },
    },
  },
  plugins: [],
}
