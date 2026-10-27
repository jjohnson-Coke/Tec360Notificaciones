import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Valores hex (no var()) para que funcionen los modificadores de opacidad, p. ej. bg-slate/35.
        // Deben coincidir con los tokens de :root en src/index.css.
        cyan: '#00A9CE',
        'cyan-text': '#00799A',
        aqua: '#1DD2DD',
        violet: '#7880CC',
        navy: '#1A2340',
        ink: '#111111',
        slate: '#596273',
        mist: '#F3F4F6',
        ice: '#DDEBF7',
        line: '#E2E5EB',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
