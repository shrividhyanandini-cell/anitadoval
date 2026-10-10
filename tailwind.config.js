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
        // ── Primary Brand Palette ──────────────────────
        brand: {
          dark: '#211F1B',    // Dark CTA
        },
        gold: {
          50: '#F0EAE1',
          100: '#E5D9C7',
          200: '#D5B46A',   // Soft Gold
          300: '#C9A45D',
          400: '#B78325',   // Primary Accent (Muted Antique Gold)
          500: '#A67828',
          600: '#8C641C',   // Dark Gold
          700: '#735217',
          800: '#5A4012',
          900: '#322819',
        },
        // ── Backgrounds & Surfaces ─────────────────────
        cream: {
          50: '#FBF8F1',   // Primary Background (Warm Ivory)
          100: '#F5EFE4',   // Secondary Background (Soft Warm Beige)
          200: '#FFFDF8',   // Card Background (Warm White)
        },
        // ── Typography ──────────────────────────────────
        charcoal: {
          100: '#A3998D',
          200: '#91877A',   // Muted Text
          300: '#8B8174',
          400: '#7A7267',
          500: '#6E665D',   // Secondary Text
          600: '#625B52',
          700: '#322D27',
          800: '#26221D',
          900: '#25221E',   // Primary Text
        },
        // ── Borders ──────────────────────────────────────
        border: {
          warm: '#E8DED0',
          light: '#EFE8DD',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(45, 35, 20, 0.05)',
        'card-hover': '0 12px 32px rgba(45, 35, 20, 0.08)',
        'float': '0 10px 30px rgba(50, 40, 25, 0.08)',
      },
      maxWidth: {
        'container': '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 50s linear infinite',
        'spin-slow-reverse': 'spin 60s linear infinite reverse',
        'orbit': 'spin 90s linear infinite',
        'orbit-reverse': 'spin 120s linear infinite reverse',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}