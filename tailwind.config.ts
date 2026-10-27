import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: 'var(--cyan)',
        'cyan-text': 'var(--cyan-text)',
        aqua: 'var(--aqua)',
        violet: 'var(--violet)',
        navy: 'var(--navy)',
        ink: 'var(--ink)',
        slate: 'var(--slate)',
        mist: 'var(--mist)',
        ice: 'var(--ice)',
        line: 'var(--line)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
