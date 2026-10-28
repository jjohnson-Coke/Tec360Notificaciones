import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ClosingSlide as ClosingData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { useReduced } from '../motion';

/** Bordes difuminados: el recuadro del video se funde con el fondo aunque el color varíe un poco al decodificar. */
const softEdges = 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)';

export function ClosingSlide({ data }: { data: ClosingData }) {
  const reduce = useReduced();
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const showStill = reduce || blocked;

  // Se reproduce una vez cada vez que se entra a la slide y queda en el último cuadro.
  useEffect(() => {
    const video = ref.current;
    if (!video || showStill) return;
    video.muted = true;
    video.currentTime = 0;
    video.play().catch(() => setBlocked(true));
  }, [showStill]);

  return (
    <SlideFrame
      tone="light"
      arc="none"
      background="text-ink"
      backdrop={<div className="absolute inset-0" style={{ backgroundColor: data.background }} aria-hidden="true" />}
      innerClassName="items-center"
    >
      {/* En mobile el video se amplía (los costados están vacíos) y el sobrante se recorta aquí. */}
      <div className="flex w-full justify-center overflow-hidden">
        <div
          className="relative w-[140vw] max-w-none shrink-0 md:w-[min(100%,calc((100dvh-12rem)*16/9),68rem)]"
          style={{ maskImage: softEdges, WebkitMaskImage: softEdges }}
        >
          {showStill ? (
            <img src={data.finalFrame} alt="" className="block aspect-video h-auto w-full" draggable={false} />
          ) : (
            <video
              ref={ref}
              className="block aspect-video h-auto w-full"
              src={data.video}
              poster={data.poster}
              muted
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
          <span className="sr-only">{data.logoAlt}</span>
        </div>
      </div>
      <motion.p
        className="-mt-[clamp(0.5rem,4vh,2.5rem)] text-[clamp(0.95rem,1.3vw,1.2rem)] font-medium tracking-[0.06em] text-slate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.3 : 0.8, delay: reduce ? 0 : 1.5 }}
      >
        {data.text}
      </motion.p>
    </SlideFrame>
  );
}
