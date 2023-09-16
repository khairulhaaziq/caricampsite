import type { Config } from 'tailwindcss';
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [
    require('./tailwind-preset.js')
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
} satisfies Config;

