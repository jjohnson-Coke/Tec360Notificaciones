import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { PillarsSlide as PillarsData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { IconBadge, SlideHeading } from '../components/Heading';
import { easeInOut, Item, Stagger, useReduced } from '../motion';

/**
 * Líneas finas que conectan las columnas de pilares con el nodo "Impacto" (mitad superior)
 * y el nodo con las columnas de beneficios (mitad inferior). Sólo en escritorio.
 */
function Connectors({ count, half, delay }: { count: number; half: 'top' | 'bottom'; delay: number }) {
  const reduce = useReduced();
  const xs = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100);
  const lines = xs.map((x) => (half === 'top' ? `M ${x} 0 C ${x} 70, 50 30, 50 100` : `M 50 0 C 50 70, ${x} 30, ${x} 100`));
  return (
    <motion.svg
      className="hidden h-[clamp(1.25rem,4vh,3rem)] w-full lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      initial={{ clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', opacity: reduce ? 0 : 1 }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      transition={reduce ? { duration: 0.25 } : { duration: 0.6, ease: easeInOut, delay }}
    >
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--cyan)" strokeOpacity={0.6} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      ))}
    </motion.svg>
  );
}

export function PillarsSlide({ data }: { data: PillarsData }) {
  const reduce = useReduced();
  return (
    <SlideFrame tone={data.tone} arc={data.arc}>
      <Stagger>
        <SlideHeading eyebrow={data.eyebrow} title={data.title} />
      </Stagger>

      <Stagger delay={0.45} stagger={0.12} className="mt-[clamp(1.5rem,5vh,3rem)] grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {data.pillars.map((p) => (
          <Item key={p.name} className="h-full">
            <article className="card flex h-full flex-col gap-4 p-[clamp(1.25rem,2vw,1.9rem)]">
              <IconBadge icon={p.icon} />
              <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-extrabold leading-tight tracking-[-0.015em] text-ink">{p.name}</h3>
              <p className="body-text text-slate">{p.description}</p>
            </article>
          </Item>
        ))}
      </Stagger>

      <Connectors count={data.pillars.length} half="top" delay={1.15} />

      <motion.section
        className="mt-6 lg:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : 1.55 }}
        aria-labelledby="impacto-label"
      >
        <div className="flex justify-center">
          <h3 id="impacto-label" className="eyebrow rounded-full bg-navy px-5 py-2 text-white">
            {data.impactLabel}
          </h3>
        </div>
        <Connectors count={data.impacts.length} half="bottom" delay={1.75} />
        <ul className="mt-4 grid gap-3 lg:mt-0 lg:grid-cols-3 lg:gap-6">
          {data.impacts.map((text, i) => (
            <motion.li
              key={text}
              className="flex items-center gap-3 rounded-full border border-cyan/30 bg-white px-4 py-3 text-[clamp(0.92rem,1.05vw,1.05rem)] font-bold leading-snug text-navy shadow-sm"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduce ? 0.2 : 0.45, delay: reduce ? 0 : 2.05 + i * 0.12 }}
            >
              <span className="icon-badge h-8 w-8 rounded-full" aria-hidden="true">
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              {text}
            </motion.li>
          ))}
        </ul>
      </motion.section>
    </SlideFrame>
  );
}
