import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bounce: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#E8332A',
          600: '#D42B23',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        surface: {
          primary: '#FAFAF8',
          secondary: '#F5F5F0',
          elevated: '#FFFFFF',
        },
        ink: {
          primary: '#1C1917',
          secondary: '#78716C',
          tertiary: '#A8A29E',
        },
        voice: {
          backdrop: '#0C0A09',
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-soft': 'cubic-bezier(0.22, 1.0, 0.36, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'orb-pulse': 'orbPulse 2.5s ease-in-out infinite',
        'orb-glow': 'orbGlow 3s ease-in-out infinite',
        'voice-mode-in': 'voiceModeIn 350ms cubic-bezier(0.22, 1.0, 0.36, 1) forwards',
        'voice-mode-out': 'voiceModeOut 250ms ease-out forwards',
        'msg-spring': 'messageSpring 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'typing-dot': 'typingDot 1.4s ease-in-out infinite',
        'chip-spring': 'chipSpring 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'stagger-fade': 'staggerFadeIn 500ms cubic-bezier(0.22, 1.0, 0.36, 1) forwards',
        'status-pulse': 'statusPulse 2s ease-in-out infinite',
      },
      keyframes: {
        orbPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        orbGlow: {
          '0%, 100%': { boxShadow: '0 0 40px 10px rgba(232, 51, 42, 0.15), inset 0 -8px 24px rgba(0,0,0,0.15)' },
          '50%': { boxShadow: '0 0 60px 20px rgba(232, 51, 42, 0.25), inset 0 -8px 24px rgba(0,0,0,0.15)' },
        },
        voiceModeIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        voiceModeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        messageSpring: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        chipSpring: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        staggerFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
