import { motion } from 'framer-motion';
import type { StatementSlide as StatementData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { Eyebrow } from '../components/Heading';
import { Rich } from '../components/Rich';
import { easeOut, Item, Stagger, useReduced } from '../motion';

function Keyword({ value, index }: { value: string; index: number }) {
  const reduce = useReduced();
  const delay = reduce ? 0 : 1.1 + index * 0.38;
  return (
    <span className="relative inline whitespace-nowrap">
      <motion.strong
        className="font-extrabold"
        initial={{ color: reduce ? 'var(--cyan-text)' : 'var(--ink)' }}
        animate={{ color: 'var(--cyan-text)' }}
        transition={{ duration: reduce ? 0 : 0.45, delay }}
      >
        {value}
      </motion.strong>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[0.06em] h-[0.12em] origin-left rounded-full"
        style={{ background: 'linear-gradient(90deg, var(--cyan), var(--aqua), var(--violet))' }}
        initial={{ scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={reduce ? { duration: 0.25 } : { duration: 0.55, ease: easeOut, delay }}
      />
    </span>
  );
}

export function StatementSlide({ data }: { data: StatementData }) {
  return (
    <SlideFrame tone={data.tone} arc={data.arc}>
      <Stagger className="max-w-[68rem]">
        <Item>
          <Eyebrow text={data.eyebrow} />
        </Item>
        <Item>
          <p
            className="mt-[clamp(1.25rem,4vh,2.5rem)] font-medium leading-[1.32] tracking-[-0.015em] text-ink"
            style={{ fontSize: 'clamp(1.35rem, min(2.9vw, 5.6vh), 2.85rem)' }}
          >
            <Rich text={data.text} renderKey={(value, index) => <Keyword value={value} index={index} />} />
          </p>
        </Item>
      </Stagger>
    </SlideFrame>
  );
}
