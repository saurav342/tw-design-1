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
        aurora: '#FFE066',
        amberflare: '#FFB100',
        solstice: '#FF8A3D',
        dusk: '#241E4E',
        midnight: '#111322',
        sand: '#FFF9ED',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 12px 40px rgba(99, 102, 241, 0.35)',
        'glow-purple': '0 30px 120px rgba(139, 92, 246, 0.35)',
        'glow-amber': '0 20px 60px rgba(255, 158, 43, 0.35)',
      },
    },
  },
  plugins: [],
}
