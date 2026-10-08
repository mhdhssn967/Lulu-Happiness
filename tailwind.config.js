/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lulu: {
          green: '#008F5A',
          greenLight: '#009B5A',
          red: '#E31B23',
        },
        happiness: {
          blue: '#164F8F',
          blueDark: '#14579A',
          lime: '#9ACD32',
        },
        background: '#F5F8F5',
        textDark: '#172018',
        textMuted: '#66736A',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        shine: 'shine 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}
