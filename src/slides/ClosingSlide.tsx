import { useId } from 'react';
import { motion } from 'framer-motion';
import type { ClosingSlide as ClosingData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { easeInOut, useReduced } from '../motion';

export function ClosingSlide({ data }: { data: ClosingData }) {
  const reduce = useReduced();
  const id = useId().replace(/:/g, '');
  // Un arco que entra desde fuera y se cierra en un círculo completo (el "360").
  const ring = 'M 200 20 A 180 180 0 1 1 199.9 20';
  const tail = 'M -260 330 C -120 250, 40 40, 200 20';

  return (
    <SlideFrame tone="dark" arc="none" background="bg-black text-white" innerClassName="items-center">
      <div className="relative flex aspect-square w-[min(78vw,58vh,30rem)] items-center justify-center">
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="50%" stopColor="var(--aqua)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <motion.path
            d={tail}
            fill="none"
            stroke={`url(#ring-${id})`}
            strokeWidth={14}
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 0.9 }}
            animate={reduce ? { opacity: 0 } : { pathLength: [0, 1, 1], opacity: [0.9, 0.9, 0] }}
            transition={reduce ? { duration: 0 } : { duration: 1.6, times: [0, 0.45, 1], ease: easeInOut, delay: 0.2 }}
          />
          <motion.path
            d={ring}
            fill="none"
            stroke={`url(#ring-${id})`}
            strokeWidth={14}
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={
              reduce
                ? { duration: 0.3 }
                : { pathLength: { duration: 1.4, ease: easeInOut, delay: 0.85 }, opacity: { duration: 0.1, delay: 0.85 } }
            }
          />
        </svg>
        <motion.img
          src={data.logo}
          alt={data.logoAlt}
          width={290}
          height={70}
          className="relative h-auto w-[62%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.3 : 1.1, delay: reduce ? 0 : 1.9 }}
        />
      </div>
      <motion.p
        className="mt-[clamp(1.5rem,5vh,3rem)] text-[clamp(0.95rem,1.3vw,1.2rem)] font-medium tracking-[0.06em] text-white/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.3 : 0.8, delay: reduce ? 0 : 2.4 }}
      >
        {data.text}
      </motion.p>
    </SlideFrame>
  );
}
