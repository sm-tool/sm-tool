/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/theme';
import animatePlugin from 'tailwindcss-animate';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  variants: {
    fill: ['hover', 'focus'],
  },
  prefix: '',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [
    animatePlugin,
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          extend: 'light',
          colors: {
            background: '#fafafa',
            focus: '#f7a200',
            default: {
              '50': '#FAFAFA',
              '100': '#F4F4F5',
              '200': '#E4E4E7',
              '300': '#D4D4D8',
              '400': '#A1A1AA',
              '500': '#71717A',
              '600': '#52525B',
              '700': '#3F3F46',
              '800': '#27272A',
              '900': '#18181B',
              DEFAULT: '#3f3f46',
              foreground: '#18181B',
            },
            primary: {
              50: '#fffbeb',
              100: '#fef4c8',
              200: '#fee989',
              300: '#fed747',
              400: '#ffc300',
              500: '#f7a200',
              600: '#da7a00',
              700: '#b55500',
              800: '#934105',
              900: '#78360b',
            },
            secondary: {
              50: '#eff6ff',
              100: '#dae9fc',
              200: '#bddafa',
              300: '#92c3f6',
              400: '#60a4f0',
              500: '#3b82e8',
              600: '#2365d9',
              700: '#1a52c5',
              800: '#1d439d',
              900: '#1e3b7b',
            },
          },
        },
        dark: {
          extend: 'dark',
          colors: {
            background: '#18181b',
            focus: '#f7a200',
            default: {
              '50': '#18181b',
              '100': '#27272a',
              '200': '#3f3f46',
              '300': '#52525b',
              '400': '#71717a',
              '500': '#a1a1aa',
              '600': '#d4d4d8',
              '700': '#e4e4e7',
              '800': '#f4f4f5',
              '900': '#fafafa',
              DEFAULT: '#3f3f46',
              foreground: '#fafafa',
            },
            primary: {
              50: '#78360b',
              100: '#934105',
              200: '#b55500',
              300: '#da7a00',
              400: '#f7a200',
              500: '#ffc300',
              600: '#fed747',
              700: '#fee989',
              800: '#fef4c8',
              900: '#fffbeb',
            },
            secondary: {
              50: '#1e3b7b',
              100: '#1d439d',
              200: '#1a52c5',
              300: '#2365d9',
              400: '#3b82e8',
              500: '#60a4f0',
              600: '#92c3f6',
              700: '#bddafa',
              800: '#dae9fc',
              900: '#eff6ff',
            },
          },
        },
      },
    }),
  ],
};
