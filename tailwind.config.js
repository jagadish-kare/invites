/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#8B0000',
          dark: '#5a0000',
          light: '#a52a2a',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f5d67a',
          dark: '#b8960c',
        },
        cream: {
          DEFAULT: '#f5e6d3',
          dark: '#e8d5b5',
        },
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
