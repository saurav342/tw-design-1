/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: '#5B21D1',
        night: '#170B2E',
        orchid: '#C084FC',
        lilac: '#F5ECFF',
        'night-soft': '#E9E1FF',
        blossom: '#FF4F9A',
        petal: '#FF8AC4',
        sunbeam: '#F7C948',
        honey: '#FFE78C',
        sprout: '#2EDC92',
        mint: '#9FF5CF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-royal': '0 18px 60px rgba(91, 33, 209, 0.35)',
        'glow-blossom': '0 24px 80px rgba(255, 79, 154, 0.28)',
        'glow-sunbeam': '0 20px 70px rgba(247, 201, 72, 0.3)',
        'glow-sprout': '0 20px 70px rgba(46, 220, 146, 0.28)',
      },
    },
  },
  plugins: [],
}
