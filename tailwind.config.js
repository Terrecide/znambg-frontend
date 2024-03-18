import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      'black': '#000000',
      'white': '#FFFFFF',
      'purple': '#6F30C2',
      'purple-light': '#8F4CE7',
      'purple-dark': '#612AA8',
      'pink': '#E37FCA',
      'pink-light': '#F78BDC',
      'pink-dark': '#C971B3',
      'green': '#C7E357',
      'green-light': '#D8F368',
      'green-dark': '#B9D645',
      'red': '#E35757',
      'red-light': '#F16464',
      'red-dark': '#D44E4E',
      'yellow': '#ffeb69',
      'yellow-light': '#fff4ad',
      'yellow-dark': '#ccb104',
      'ecru': '#FDF9F3',
      'gray-1': '#F7F7F7',
      'gray-2': '#EAEAEA',
      'gray-3': '#BEBEBE',
      'gray-4': '#A3A3A3',
      'gray-5': '#898787',
      'gray-6': '#686868',
      'gray-7': '#1A1A1A',
      transparent: colors.transparent
    },
    fontSize: {
      xs: '0.125rem',
      sm: '0.25rem',
      base: '0.5rem', // 8px
      rg: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '3rem',
      '10xl': '5rem',
    },
    fontFamily: {
      neuropol: ['Neuropol'],
      binaria_regular: ['Binaria-Regular'],
      binaria_bold: ['Binaria-Bold'],
    },
    extend: {
    },
  },
  plugins: [],
}

