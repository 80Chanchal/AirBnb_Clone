/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          DEFAULT: '#FF385C',
        },
        brand: {
          pink:   '#FF385C',
          dark:   '#222222',
          gray:   '#717171',
          light:  '#F7F7F7',
          border: '#DDDDDD',
        },
        dark: {
          bg:      '#0F0F0F',
          surface: '#1A1A1A',
          card:    '#242424',
          border:  '#333333',
          text:    '#E5E5E5',
          muted:   '#999999',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card':   '0 2px 16px rgba(0,0,0,0.12)',
        'hover':  '0 8px 40px rgba(0,0,0,0.18)',
        'modal':  '0 25px 50px rgba(0,0,0,0.25)',
        'brand':  '0 4px 24px rgba(255,56,92,0.35)',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-in-out',
        'slide-up':     'slideUp 0.5s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'scale-in':     'scaleIn 0.2s ease-out',
        'shimmer':      'shimmer 1.5s infinite',
        'float':        'float 3s ease-in-out infinite',
        'pulse-brand':  'pulseBrand 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseBrand: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,56,92,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(255,56,92,0)' },
        },
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #FF385C 0%, #E31C5F 100%)',
        'gradient-dark':     'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
        'gradient-hero':     'linear-gradient(160deg, #0F0F0F 0%, #1a0a0f 50%, #0F0F0F 100%)',
        'shimmer-gradient':  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      }
    },
  },
  plugins: [],
}
