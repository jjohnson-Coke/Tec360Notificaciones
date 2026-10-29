import { Fragment } from 'react';
import { motion } from 'framer-motion';
import type { CoverSlide as CoverData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { easeOut, useReduced } from '../motion';

export function CoverSlide({ data }: { data: CoverData }) {
  const reduce = useReduced();
  const words = data.titleLines.map((line) => line.split(' '));
  let wordIndex = 0;

  const backdrop = (
    <>
      <motion.img
        src={data.image}
        alt={data.imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        initial={{ scale: reduce ? 1 : 1.02 }}
        animate={{ scale: reduce ? 1 : 1.12 }}
        transition={{ duration: 14, ease: 'linear' }}
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top right, rgba(10,14,30,0.92) 0%, rgba(10,14,30,0.7) 30%, rgba(10,14,30,0.15) 62%, rgba(10,14,30,0) 80%), linear-gradient(to top, rgba(10,14,30,0.55), rgba(10,14,30,0) 45%)',
        }}
        aria-hidden="true"
      />
    </>
  );

  return (
    <SlideFrame tone="dark" arc={data.arc} background="bg-navy text-white" backdrop={backdrop} innerClassName="!justify-end">
      <h1
        className="font-extrabold leading-[0.98] tracking-[-0.035em] text-white"
        style={{ fontSize: 'clamp(2.4rem, min(5.4vw, 10.5vh), 6.25rem)' }}
      >
        {words.map((line, li) => (
          <span key={li} className="block">
            {line.map((word, wi) => {
              const i = wordIndex++;
              return (
                <Fragment key={wi}>
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: reduce ? 0 : '0.45em' }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0.25 } : { duration: 0.8, ease: easeOut, delay: 0.45 + i * 0.14 }}
                  >
                    {word}
                  </motion.span>
                  {/* Espacio normal fuera del bloque: permite que el título se acomode en mobile. */}
                  {wi < line.length - 1 && ' '}
                </Fragment>
              );
            })}
          </span>
        ))}
      </h1>
      <motion.div
        className="mt-[clamp(1.5rem,5vh,3rem)] flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.25 : 0.8, delay: reduce ? 0 : 1.6 }}
      >
        <img
          src={data.logo}
          alt={data.logoAlt}
          width={data.logoSize.width}
          height={data.logoSize.height}
          className="h-auto w-[clamp(10rem,17vw,15rem)]"
        />
        <span className="text-[clamp(0.9rem,1.2vw,1.1rem)] font-medium text-white/90">{data.footer}</span>
      </motion.div>
    </SlideFrame>
  );
}
