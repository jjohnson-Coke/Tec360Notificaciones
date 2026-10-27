import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { stages, type StageKey, type TimelineSlide as TimelineData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { SlideHeading } from '../components/Heading';
import { Rich, plainRich } from '../components/Rich';
import { easeOut, useReduced, Stagger } from '../motion';

const BASE_DELAY = 0.6;
const STEP = 0.42;

function StageTag({ stage }: { stage: StageKey }) {
  const { label, color } = stages[stage];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-bold uppercase leading-none tracking-[0.12em] text-ink"
      style={{ borderColor: `${color}66`, backgroundColor: `${color}1f` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

function Legend({ keys }: { keys: StageKey[] }) {
  return (
    <ul className="flex max-w-[34rem] flex-wrap gap-x-4 gap-y-2 lg:justify-end">
      {keys.map((k) => (
        <li key={k} className="flex items-center gap-1.5 text-[0.8rem] font-medium text-slate">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stages[k].color }} aria-hidden="true" />
          {stages[k].label}
        </li>
      ))}
    </ul>
  );
}

function PhaseProgress({ progress }: { progress: NonNullable<TimelineData['phaseProgress']> }) {
  const reduce = useReduced();
  const n = progress.phases.length;
  return (
    <motion.div
      className="mt-[clamp(1rem,3vh,1.75rem)] rounded-2xl border border-line bg-white/80 px-4 py-3"
      role="group"
      aria-label={progress.label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : 0.35 }}
    >
      <div className="relative h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 rounded-full bg-violet/45" style={{ width: `${(progress.activeIndex / n) * 100}%` }} />
        <motion.div
          className="absolute inset-y-0 origin-left rounded-full"
          style={{
            left: `${(progress.activeIndex / n) * 100}%`,
            width: `${100 / n}%`,
            background: 'linear-gradient(90deg, var(--cyan), var(--aqua))',
          }}
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 1.1, ease: easeOut, delay: 0.55 }}
        />
      </div>
      <ol className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[1fr_auto_1fr]">
        {progress.phases.map((p, i) => (
          <li key={p.name} className={`contents`}>
            {i > 0 && <ArrowRight className="hidden self-center text-slate sm:block" size={16} aria-hidden="true" />}
            <p className={`text-[0.85rem] leading-snug ${i === progress.activeIndex ? 'text-ink' : 'text-slate'} ${i > 0 ? 'sm:text-right' : ''}`}>
              <span className={`font-extrabold ${i === progress.activeIndex ? 'text-cyan-text' : ''}`}>{p.name}</span>
              <span aria-hidden="true"> · </span>
              <span className="sr-only">: </span>
              {p.detail}
            </p>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

export function TimelineSlide({ data }: { data: TimelineData }) {
  const reduce = useReduced();
  const count = data.milestones.length;
  const DateIcon = data.dateIcon;
  const at = (i: number) => (reduce ? 0 : BASE_DELAY + i * STEP);
  const cols = count === 5 ? 'lg:grid-cols-5' : count === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <SlideFrame tone={data.tone} arc={data.arc}>
      <Stagger>
        <SlideHeading eyebrow={data.eyebrow} title={data.title} aside={<Legend keys={data.legend} />} />
      </Stagger>
      {data.phaseProgress && <PhaseProgress progress={data.phaseProgress} />}

      <ol className={`mt-[clamp(1.25rem,4vh,2.25rem)] grid gap-5 ${cols} lg:gap-4`}>
        {data.milestones.map((m, i) => {
          const isCurrent = data.currentIndex === i;
          const isLast = i === count - 1;
          const color = stages[m.stage].color;
          return (
            <li key={m.n} className="relative grid grid-cols-[3rem_1fr] gap-x-4 lg:flex lg:flex-col lg:gap-3">
              {!isLast && (
                <>
                  {/* Tramo horizontal (escritorio) */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-6 top-6 hidden h-[3px] w-[calc(100%+1rem)] origin-left -translate-y-1/2 rounded-full lg:block"
                    style={{ background: `linear-gradient(90deg, ${color}, ${stages[data.milestones[i + 1].stage].color})` }}
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: STEP, ease: 'linear', delay: at(i) + 0.15 }}
                  />
                  {/* Tramo vertical (mobile) */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-6 top-6 h-[calc(100%+1.25rem)] w-[3px] origin-top -translate-x-1/2 rounded-full lg:hidden"
                    style={{ background: `linear-gradient(180deg, ${color}, ${stages[data.milestones[i + 1].stage].color})` }}
                    initial={{ scaleY: reduce ? 1 : 0 }}
                    animate={{ scaleY: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: STEP, ease: 'linear', delay: at(i) + 0.15 }}
                  />
                </>
              )}

              <motion.div
                className="relative z-10 flex items-center gap-2 self-start"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 320, damping: 20, delay: at(i) }}
              >
                <span className="relative flex h-12 w-12 flex-none items-center justify-center">
                  {isCurrent && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ opacity: 0.45, scale: 1 }}
                      animate={reduce ? { opacity: 0.25, scale: 1.25 } : { opacity: [0.45, 0], scale: [1, 1.75] }}
                      transition={reduce ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: at(i) + 0.4 }}
                    />
                  )}
                  <span
                    className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] bg-white text-lg font-extrabold text-ink shadow-sm"
                    style={{ borderColor: color }}
                  >
                    {m.n}
                  </span>
                </span>
                {isCurrent && (
                  <span className="hidden whitespace-nowrap rounded-full bg-navy px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white lg:inline-block">
                    {data.currentLabel}
                  </span>
                )}
              </motion.div>

              <motion.article
                className="card col-start-2 flex flex-col gap-2.5 rounded-2xl p-[clamp(1rem,1.3vw,1.25rem)] lg:h-full"
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0.2 } : { duration: 0.5, ease: easeOut, delay: at(i) + 0.08 }}
                aria-label={`${m.n}. ${plainRich(m.title)}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StageTag stage={m.stage} />
                  {isCurrent && (
                    <span className="rounded-full bg-navy px-2.5 py-1 text-[0.72rem] font-bold uppercase leading-none tracking-[0.12em] text-white lg:hidden">
                      {data.currentLabel}
                    </span>
                  )}
                </div>
                <h3 className="text-[clamp(1rem,1.15vw,1.15rem)] font-extrabold leading-snug tracking-[-0.01em] text-ink">
                  <Rich text={m.title} />
                </h3>
                <p className="text-[clamp(0.86rem,0.92vw,0.95rem)] leading-[1.5] text-slate">
                  <Rich text={m.description} />
                </p>
                <p className="mt-auto flex items-start gap-1.5 pt-1 text-[0.85rem] font-bold leading-snug text-navy">
                  <DateIcon size={16} className="mt-[1px] flex-none text-cyan-text" aria-hidden="true" />
                  {m.date}
                </p>
              </motion.article>
            </li>
          );
        })}
      </ol>
    </SlideFrame>
  );
}
