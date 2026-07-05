/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#F5A623',
        secondary: '#2E7D32',
        dark:      '#1A5276',
        neutral:   '#F2F3F4',
        text:      '#1C2833',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}