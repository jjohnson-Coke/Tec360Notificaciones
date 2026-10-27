import { motion } from 'framer-motion';
import type { RoleSlide as RoleData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { IconBadge, SlideHeading } from '../components/Heading';
import { CountUp } from '../components/CountUp';
import { easeOut, Stagger, useReduced } from '../motion';

export function RoleSlide({ data }: { data: RoleData }) {
  const reduce = useReduced();
  const DedicationIcon = data.dedication.icon;
  const RoleIcon = data.roleIcon;
  const cardDelay = reduce ? 0 : 0.5;

  return (
    <SlideFrame tone={data.tone} arc={data.arc}>
      <Stagger>
        <SlideHeading eyebrow={data.eyebrow} title={data.title} />
      </Stagger>

      <div className="mt-[clamp(1.5rem,5vh,3rem)] flex justify-center" style={{ perspective: 1400 }}>
        <motion.article
          className="card grid w-full max-w-[64rem] overflow-hidden md:grid-cols-[0.9fr_1.1fr]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, rotateY: -22, rotateX: 8, y: 30 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, rotateY: 0, rotateX: 0, y: 0 }}
          transition={reduce ? { duration: 0.25 } : { duration: 0.9, ease: easeOut, delay: cardDelay }}
          aria-label={`${data.roleLabel}: ${data.roleName}`}
        >
          <div className="flex flex-col gap-4 bg-navy p-[clamp(1.5rem,2.6vw,2.5rem)] text-white">
            <span className="h-2 w-16 rounded-full bg-white/25" aria-hidden="true" />
            <p className="eyebrow text-aqua">{data.roleLabel}</p>
            <div className="flex items-center gap-4">
              <IconBadge icon={RoleIcon} size="lg" />
              <h3 className="text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">{data.roleName}</h3>
            </div>
            <p className="body-text mt-auto text-white/85">{data.description}</p>
          </div>

          <div className="flex flex-col gap-4 p-[clamp(1.5rem,2.6vw,2.5rem)]">
            <p className="eyebrow text-cyan-text">{data.responsibilitiesLabel}</p>
            <ul className="flex flex-col gap-3">
              {data.responsibilities.map((r, i) => (
                <motion.li
                  key={r.text}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-mist/70 px-3 py-3"
                  initial={{ opacity: 0, x: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={reduce ? { duration: 0.2 } : { duration: 0.5, ease: easeOut, delay: 1.2 + i * 0.25 }}
                >
                  <IconBadge icon={r.icon} size="sm" />
                  <span className="body-text font-bold text-ink">{r.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            className="flex items-center gap-3 border-t border-line bg-ice px-[clamp(1.5rem,2.6vw,2.5rem)] py-4 md:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : 2.05 }}
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-navy text-aqua" aria-hidden="true">
              <DedicationIcon size={20} strokeWidth={2.2} />
            </span>
            <p className="text-[clamp(1.05rem,1.6vw,1.45rem)] font-bold text-navy">
              {data.dedication.prefix}{' '}
              <span className="text-[1.35em] font-extrabold text-cyan-text">
                <CountUp to={data.dedication.value} duration={0.9} delay={2.2} />
              </span>{' '}
              {data.dedication.suffix}
            </p>
          </motion.div>
        </motion.article>
      </div>
    </SlideFrame>
  );
}
