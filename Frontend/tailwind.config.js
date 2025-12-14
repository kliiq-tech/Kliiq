/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D10', // Deep Tech Black
        surface: '#111827', // Dark Slate
        primary: {
          DEFAULT: '#0A84FF', // Brand Gradient Start
          end: '#4C00FF',    // Brand Gradient End
        },
        accent: '#00D4FF', // Neon Aqua
        text: {
          primary: '#FFFFFF',
          secondary: '#C9D1D9',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '24px',
        md: '12px',
        sm: '8px',
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        marquee2: 'marquee2 var(--duration) linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
