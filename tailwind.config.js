/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        india: {
          saffron: '#FF9933',
          saffronSoft: '#FFF2E6',
          green: '#138808',
          greenSoft: '#EAF9ED',
          navy: '#000080',
          navySoft: '#EEF3FF',
          ink: '#0F172A',
          mist: '#F7F7F5',
          card: '#FFFFFF',
        },
        civic: {
          50:  '#F8FAFC',
          100: '#EEF3FF',
          200: '#DDE7FF',
          300: '#C5D8FF',
          400: '#7AA2FF',
          500: '#4F7BFF',
          600: '#2F5DEB',
          700: '#2348BE',
          800: '#1A3777',
          900: '#10214C',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        card: '0 18px 48px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
