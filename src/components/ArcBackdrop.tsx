import { useId } from 'react';
import { motion } from 'framer-motion';
import type { ArcVariant, Tone } from '../content/slides';
import { easeInOut, useReduced } from '../motion';

/**
 * Trazos en un lienzo de 1600×900 (se recorta con "slice", así que siempre cubre la slide).
 * Cada slide tiene su propia posición: el arco "viaja" de una slide a otra.
 */
const paths: Record<Exclude<ArcVariant, 'none'>, { d: string; width: number }> = {
  cover: { d: 'M -120 640 C 260 980, 1180 900, 1520 520 C 1760 250, 1380 40, 980 150', width: 34 },
  'sweep-top': { d: 'M 1720 300 C 1500 -40, 700 -60, 260 160 C -40 310, -60 520, 120 620', width: 40 },
  statement: { d: 'M -120 860 C 520 1010, 1420 900, 1530 520 C 1610 230, 1350 60, 1020 70', width: 46 },
  low: { d: 'M 760 -90 C 1120 10, 1500 60, 1720 300', width: 40 },
  credential: { d: 'M 1180 -80 C 1720 120, 1760 620, 1300 860 C 1000 1010, 620 960, 420 900', width: 42 },
  'timeline-a': { d: 'M 300 -80 C 800 50, 1300 40, 1720 150', width: 34 },
  'timeline-b': { d: 'M -120 150 C 300 40, 800 50, 1300 -80', width: 34 },
  cta: { d: 'M 1720 600 C 1500 760, 1260 880, 980 1000 M -100 120 C 200 -40, 520 -40, 760 -120', width: 40 },
  video: { d: 'M -140 260 C 40 -20, 520 -80, 820 -40', width: 40 },
};

export function ArcBackdrop({ variant, tone }: { variant: ArcVariant; tone: Tone }) {
  const reduce = useReduced();
  const id = useId().replace(/:/g, '');
  if (variant === 'none') return null;
  const { d, width } = paths[variant];
  const opacity = variant === 'cover' ? 0.85 : tone === 'dark' ? 0.55 : 0.32;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`arc-${id}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="55%" stopColor="var(--aqua)" />
          <stop offset="100%" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#arc-${id})`}
        strokeWidth={width}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity }}
        transition={
          reduce
            ? { duration: 0.25 }
            : { pathLength: { duration: 1.6, ease: easeInOut, delay: 0.15 }, opacity: { duration: 0.4, delay: 0.15 } }
        }
      />
    </svg>
  );
}
