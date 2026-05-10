const colors = require('./config/theme/colors.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: colors,
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(55 65 81)', // gray-700
            'h2, h3, h4': { color: 'rgb(17 24 39)', marginTop: '1.25em', marginBottom: '0.5em' },
            'p, li': { marginTop: '0.5em', marginBottom: '0.5em' },
            'ul, ol': { marginTop: '0.5em', marginBottom: '0.5em', paddingLeft: '1.25em' },
            a: { color: 'rgb(37 99 235)', textDecoration: 'none' },
            'a:hover': { textDecoration: 'underline' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
