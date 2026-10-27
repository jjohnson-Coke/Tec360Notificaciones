import { motion } from 'framer-motion';
import type { CtaSlide as CtaData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { IconBadge, SlideHeading } from '../components/Heading';
import { easeInOut, easeOut, Stagger, useReduced } from '../motion';

/** Flecha animada de la reunión al entregable: horizontal en escritorio, vertical en mobile. */
function FlowArrow({ delay }: { delay: number }) {
  const reduce = useReduced();
  const draw = (d: string, i: number) => (
    <motion.path
      key={i}
      d={d}
      fill="none"
      stroke="var(--aqua)"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={reduce ? { duration: 0.25 } : { duration: i === 0 ? 0.7 : 0.3, ease: easeInOut, delay: delay + i * 0.65 }}
    />
  );
  // Punto que recorre la flecha una y otra vez (sólo con movimiento completo).
  const pulseTransition = { duration: 1.8, times: [0, 0.1, 0.85, 1], repeat: Infinity, repeatDelay: 0.6, delay: delay + 1.1 };
  const pulseX = reduce ? null : (
    <motion.circle r={5} fill="var(--cyan)" cy={24} initial={{ cx: 8, opacity: 0 }} animate={{ cx: [8, 8, 92, 92], opacity: [0, 1, 1, 0] }} transition={pulseTransition} />
  );
  const pulseY = reduce ? null : (
    <motion.circle r={5} fill="var(--cyan)" cx={24} initial={{ cy: 8, opacity: 0 }} animate={{ cy: [8, 8, 92, 92], opacity: [0, 1, 1, 0] }} transition={pulseTransition} />
  );
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <svg className="hidden h-12 w-[clamp(4rem,9vw,8rem)] md:block" viewBox="0 0 100 48" preserveAspectRatio="none">
        {[ 'M 4 24 L 94 24', 'M 80 12 L 94 24 L 80 36' ].map(draw)}
        {pulseX}
      </svg>
      <svg className="h-16 w-12 md:hidden" viewBox="0 0 48 100" preserveAspectRatio="none">
        {['M 24 4 L 24 94', 'M 12 80 L 24 94 L 36 80'].map(draw)}
        {pulseY}
      </svg>
    </div>
  );
}

export function CtaSlide({ data }: { data: CtaData }) {
  const reduce = useReduced();
  const DurationIcon = data.meeting.duration.icon;
  const enter = (delay: number, x: number) => ({
    initial: { opacity: 0, x: reduce ? 0 : x, y: 0 },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: reduce ? { duration: 0.2 } : { duration: 0.7, ease: easeOut, delay },
  });

  return (
    <SlideFrame tone="dark" arc={data.arc}>
      <Stagger>
        <SlideHeading title={data.title} tone="dark" />
      </Stagger>

      <div className="mt-[clamp(1.75rem,7vh,4rem)] grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr] md:gap-4">
        <motion.article
          {...enter(0.45, -30)}
          className="flex flex-col gap-5 rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-[clamp(1.5rem,2.8vw,2.75rem)] backdrop-blur-sm"
        >
          <IconBadge icon={data.meeting.icon} size="lg" />
          <h3 className="text-[clamp(1.6rem,2.8vw,2.6rem)] font-extrabold leading-tight tracking-[-0.02em] text-white">{data.meeting.title}</h3>
          <p className="body-text text-white/85">
            <span className="font-bold text-aqua">{data.meeting.participantsLabel}</span> {data.meeting.participants}
          </p>
          <p className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-aqua/50 bg-aqua/10 px-4 py-2 text-[clamp(0.9rem,1.1vw,1.05rem)] font-bold text-white">
            <DurationIcon size={18} className="text-aqua" aria-hidden="true" />
            {data.meeting.duration.text}
          </p>
        </motion.article>

        <FlowArrow delay={reduce ? 0 : 1.05} />

        <motion.article
          {...enter(1.6, 30)}
          className="relative flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border-2 border-cyan bg-gradient-to-br from-cyan/25 via-white/[0.06] to-violet/20 p-[clamp(1.5rem,2.8vw,2.75rem)] shadow-[0_30px_80px_-30px_rgba(0,169,206,0.7)]"
        >
          <IconBadge icon={data.deliverable.icon} size="lg" />
          <h3 className="eyebrow text-aqua">{data.deliverable.title}</h3>
          <p className="text-[clamp(2rem,4vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">{data.deliverable.text}</p>
        </motion.article>
      </div>
    </SlideFrame>
  );
}
