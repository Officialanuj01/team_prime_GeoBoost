/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        // Primary cyan-to-blue gradient spectrum
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Light background shades
        surface: {
          50: '#f8fdff',
          100: '#f0f9ff',
          200: '#e6f4ff',
          300: '#d4edff',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'gradient-primary-r': 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        'gradient-hero': 'linear-gradient(180deg, #f0f9ff 0%, #ecfeff 40%, #ffffff 100%)',
        'gradient-section': 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%)',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(6, 182, 212, 0.08)',
        'soft-md': '0 4px 30px rgba(6, 182, 212, 0.12)',
        'soft-lg': '0 8px 40px rgba(6, 182, 212, 0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(6,182,212,0.06)',
        'card-hover': '0 4px 30px rgba(6,182,212,0.15), 0 0 0 1px rgba(6,182,212,0.1)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.25)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.25)',
        'btn': '0 4px 15px rgba(6, 182, 212, 0.3)',
        'btn-hover': '0 8px 30px rgba(6, 182, 212, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}