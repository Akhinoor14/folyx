import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        folyx: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a4bbfd',
          400: '#7e96fa',
          500: '#5d6ef5',
          600: '#4550ea',
          700: '#3a40d6',
          800: '#3036ad',
          900: '#2d3289',
          950: '#1c1f52',
        },
        accent: {
          DEFAULT: '#00e5ff',
          dark: '#00b8cc',
        },
        surface: {
          0: '#080c14',
          1: '#0d1220',
          2: '#121929',
          3: '#1a2235',
          4: '#202c42',
        },
      },
      fontFamily: {
        display: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'grid-folyx': 'radial-gradient(circle, rgba(93,110,245,0.12) 1px, transparent 1px)',
        'glow-folyx': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(93,110,245,0.35) 0%, transparent 70%)',
        'glow-accent': 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0,229,255,0.12) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(93,110,245,0.4)',
        'glow-md': '0 0 24px rgba(93,110,245,0.35)',
        'glow-lg': '0 0 48px rgba(93,110,245,0.25)',
        'glow-accent': '0 0 20px rgba(0,229,255,0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(93,110,245,0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
