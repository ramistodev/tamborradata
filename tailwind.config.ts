import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'media', // usa el esquema del sistema (prefers-color-scheme)
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-secondary': 'var(--color-bg-secondary)',
        primary: 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        loading: 'var(--color-loading)',
      },
    },
  },
  plugins: [],
};

export default config;
