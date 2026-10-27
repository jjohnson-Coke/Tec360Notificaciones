import type { ReactNode } from 'react';
import type { ArcVariant, Tone } from '../content/slides';
import { ArcBackdrop } from './ArcBackdrop';

interface SlideFrameProps {
  tone: Tone;
  arc: ArcVariant;
  /** Clase del fondo (por defecto, mist en claras y navy en oscuras). */
  background?: string;
  /** Capa a sangre completa detrás del contenido (por ejemplo, la foto de portada). */
  backdrop?: ReactNode;
  innerClassName?: string;
  children: ReactNode;
}

/**
 * Marco común: fondo, arco y un contenedor con scroll vertical propio
 * (sólo se activa si la slide no cabe en altura, típicamente en mobile).
 */
export function SlideFrame({ tone, arc, background, backdrop, innerClassName = '', children }: SlideFrameProps) {
  const bg = background ?? (tone === 'dark' ? 'bg-navy text-white' : 'bg-mist text-ink');
  return (
    <div className={`absolute inset-0 overflow-hidden ${bg}`}>
      {backdrop}
      <ArcBackdrop variant={arc} tone={tone} />
      <div className="slide-scroll" data-slide-scroll>
        <div className={`slide-inner ${innerClassName}`}>{children}</div>
      </div>
    </div>
  );
}
