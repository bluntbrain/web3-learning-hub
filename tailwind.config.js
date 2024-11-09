/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rich: {
          DEFAULT: '#000814',
          light: '#001831',
        },
        oxford: {
          DEFAULT: '#001d3d',
          light: '#002a52',
        },
        yale: {
          DEFAULT: '#003566',
          light: '#004997',
        },
        mikado: {
          DEFAULT: '#ffc300',
          light: '#ffcf33',
        },
        gold: {
          DEFAULT: '#ffd60a',
          light: '#ffde3b',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
};