/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burnt: '#AF3800',
        sunset: '#FE621D',
        blaze: '#FD5200',
        lagoon: '#00CFC1',
        neon: '#00FFE7',
        'brand-dark': '#0f172a',
        'brand-muted': '#0f172a0d',
      },
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
