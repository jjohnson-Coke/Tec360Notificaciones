import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Rich as RichText, Tone } from '../content/slides';
import { Item } from '../motion';
import { Rich } from './Rich';

export function Eyebrow({ text, tone = 'light' }: { text: RichText; tone?: Tone }) {
  return (
    <p className={`eyebrow ${tone === 'dark' ? 'text-aqua' : 'text-cyan-text'}`}>
      <Rich text={text} />
    </p>
  );
}

interface SlideHeadingProps {
  eyebrow?: RichText;
  title: RichText;
  tone?: Tone;
  aside?: ReactNode;
}

/** Eyebrow + título con aparición escalonada (debe vivir dentro de un <Stagger>). */
export function SlideHeading({ eyebrow, title, tone = 'light', aside }: SlideHeadingProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && (
          <Item>
            <Eyebrow text={eyebrow} tone={tone} />
          </Item>
        )}
        <Item>
          <h2 className={`slide-title ${eyebrow ? 'mt-3' : ''} ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>
            <Rich text={title} />
          </h2>
        </Item>
      </div>
      {aside && <Item>{aside}</Item>}
    </div>
  );
}

/** Icono lucide dentro de un cuadro redondeado con gradiente cian/aqua. */
export function IconBadge({ icon: Icon, size = 'md' }: { icon: LucideIcon; size?: 'sm' | 'md' | 'lg' }) {
  const box = { sm: 'h-9 w-9 rounded-xl', md: 'h-12 w-12 rounded-2xl', lg: 'h-14 w-14 rounded-2xl' }[size];
  const icon = { sm: 18, md: 24, lg: 28 }[size];
  return (
    <span className={`icon-badge ${box}`} aria-hidden="true">
      <Icon size={icon} strokeWidth={2.2} />
    </span>
  );
}
