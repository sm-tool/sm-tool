/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/theme';
import animatePlugin from 'tailwindcss-animate';
import container from '@tailwindcss/container-queries';
import { colors } from './lib/theme/colors.config';

export default {
  darkMode: 'class',
  content: ['./**/*.{ts,tsx}', '!./node_modules/**'],
  variants: {
    fill: ['hover', 'focus'],
  },
  prefix: '',
  theme: {
    extend: {
      keyframes: {
        'appear-from-bottom': {
          '0%': { opacity: 0, transform: 'translateY(100%)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },

        'appear-from-top': {
          '0%': { opacity: 0, transform: 'translateY(-100%)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'appear-from-right': {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(-30px)' },
          '20%': { opacity: '1', transform: 'translateY(-40px)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
        'dash-forward': {
          to: {
            strokeDashoffset: '-16',
          },
        },
        'dash-backward': {
          to: {
            strokeDashoffset: '16',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'dash-forward': 'dash-forward 1s linear infinite',
        'dash-backward': 'dash-backward 1s linear infinite',
        'appear-from-bottom': 'appear-from-bottom 0.2s ease-out',
        'appear-from-top': 'appear-from-top 0.2s ease-out',
        'appear-from-right': 'appear-from-right 0.2s ease-out',
        'fade-out': 'fade-out 2s ease-out forwards',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [
    animatePlugin,
    container,
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          extend: 'light',
          colors: colors.light,
        },
        dark: {
          extend: 'dark',
          colors: colors.dark,
        },
      },
    }),
  ],
};
