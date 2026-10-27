import { useEffect, useRef } from 'react';
import { useIsPresent } from 'framer-motion';
import type { VideoSlide as VideoData } from '../content/slides';
import { SlideFrame } from '../components/SlideFrame';
import { SlideHeading } from '../components/Heading';
import { Rich } from '../components/Rich';
import { Item, Stagger } from '../motion';

export function VideoSlide({ data }: { data: VideoData }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isPresent = useIsPresent();

  // Arranca solo al entrar. Los navegadores sólo permiten autoplay sin sonido,
  // así que inicia silenciado; el audio se activa desde los controles.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Si el navegador lo bloquea (p. ej. modo ahorro de batería), queda el botón de play.
    });
  }, []);

  // Pausa en cuanto la slide empieza a salir (y al desmontarse).
  useEffect(() => {
    const video = ref.current;
    if (!isPresent && video) {
      video.pause();
      video.blur();
    }
    return () => video?.pause();
  }, [isPresent]);

  return (
    <SlideFrame tone={data.tone} arc={data.arc} innerClassName="!px-[clamp(1rem,5vw,5.5rem)]">
      <Stagger className="flex flex-col items-center">
        <div className="w-full">
          <SlideHeading title={data.title} />
        </div>
        <Item className="mt-[clamp(1rem,3.5vh,2rem)] w-full">
          <figure className="mx-auto" style={{ width: 'min(100%, calc((100dvh - 19.5rem) * 16 / 9))' }}>
            <div className="overflow-hidden rounded-[clamp(0.75rem,1.4vw,1.5rem)] bg-navy shadow-[0_30px_70px_-35px_rgba(26,35,64,0.6)] ring-1 ring-line">
              <video
                ref={ref}
                className="block aspect-video h-auto w-full bg-navy"
                src={data.src}
                poster={data.poster}
                controls
                playsInline
                muted
                autoPlay
                loop
                preload="auto"
                aria-label={data.videoLabel}
                data-nav-lock
                onKeyDown={(e) => {
                  if (e.key === 'Escape') e.currentTarget.blur();
                }}
              />
            </div>
            <figcaption className="mt-3 text-center text-[clamp(0.85rem,1vw,1rem)] text-slate">
              <Rich text={data.caption} />
            </figcaption>
          </figure>
        </Item>
      </Stagger>
    </SlideFrame>
  );
}
