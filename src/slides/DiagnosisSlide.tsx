import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { DiagnosisSlide as DiagnosisData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { IconBadge, SlideHeading } from '../components/Heading';
import { CountUp } from '../components/CountUp';
import { Rich } from '../components/Rich';
import { Item, Stagger, useReduced } from '../motion';

/** Posiciones "desordenadas" (deterministas) para la nube de sobres: [x%, y%, rotación, tamaño]. */
const envelopes: [number, number, number, number][] = [
  [-4, -8, -18, 22], [14, -14, 12, 16], [34, -10, -6, 20], [58, -16, 20, 14], [82, -9, -24, 22],
  [100, 6, 16, 18], [104, 34, -12, 14], [98, 62, 22, 20], [104, 88, -8, 16], [84, 104, 14, 22],
  [60, 108, -20, 14], [36, 104, 8, 18], [12, 108, -14, 22], [-6, 92, 24, 16], [-8, 64, -10, 20],
  [-4, 36, 18, 14], [-9, 12, -26, 18], [70, -4, -4, 12], [24, 100, 28, 12], [102, 48, 6, 12],
];

function EnvelopeCloud() {
  const reduce = useReduced();
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden sm:block" aria-hidden="true">
      {envelopes.map(([x, y, r, s], i) => (
        <motion.span
          key={i}
          className="absolute text-cyan"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.3, rotate: reduce ? r : r - 40 }}
          animate={{ opacity: i % 3 === 0 ? 0.55 : 0.32, scale: 1, rotate: r }}
          transition={reduce ? { duration: 0.25 } : { delay: 0.5 + ((i * 7) % 20) * 0.06, type: 'spring', stiffness: 220, damping: 14 }}
        >
          <Mail size={s} strokeWidth={2} />
        </motion.span>
      ))}
    </div>
  );
}

export function DiagnosisSlide({ data }: { data: DiagnosisData }) {
  return (
    <SlideFrame tone={data.tone} arc={data.arc}>
      <Stagger>
        <SlideHeading eyebrow={data.eyebrow} title={data.title} />
        <div className="mt-[clamp(2rem,7vh,4rem)] grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {data.cards.map((card, i) => (
            <Item key={i} className="relative isolate">
              {i === 0 && <EnvelopeCloud />}
              <article className="card flex h-full flex-col gap-5 p-[clamp(1.4rem,2.4vw,2.25rem)]">
                <IconBadge icon={card.icon} size="lg" />
                <h3 className="text-[clamp(1.4rem,2.3vw,2.1rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
                  {card.stat ? (
                    <>
                      <span className="text-cyan-text">
                        <CountUp to={card.stat.value} duration={1.2} delay={0.55} />
                      </span>{' '}
                      {card.stat.suffix}
                    </>
                  ) : (
                    card.heading
                  )}
                </h3>
                <p className="body-text text-slate">
                  <Rich text={card.body} />
                </p>
              </article>
            </Item>
          ))}
        </div>
      </Stagger>
    </SlideFrame>
  );
}
