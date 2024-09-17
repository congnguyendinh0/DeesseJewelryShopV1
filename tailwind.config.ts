import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      beige: '#f3ede6',
    },
  },
  plugins: [],
} satisfies Config;
