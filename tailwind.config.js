/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif TC"', 'Songti SC', 'PMingLiU', 'Georgia', 'serif'],
        sans: ['"Noto Serif TC"', 'Songti SC', 'PMingLiU', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
