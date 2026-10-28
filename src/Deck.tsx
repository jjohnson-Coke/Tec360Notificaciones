import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import { slides, ui, type SlideData } from './content/slides';
import { easeOut, useReduced } from './motion';
import { useFullscreen } from './useFullscreen';
import { CoverSlide } from './slides/CoverSlide';
import { DiagnosisSlide } from './slides/DiagnosisSlide';
import { StatementSlide } from './slides/StatementSlide';
import { PillarsSlide } from './slides/PillarsSlide';
import { RoleSlide } from './slides/RoleSlide';
import { TimelineSlide } from './slides/TimelineSlide';
import { CtaSlide } from './slides/CtaSlide';
import { VideoSlide } from './slides/VideoSlide';
import { ClosingSlide } from './slides/ClosingSlide';

const TOTAL = slides.length;
const TRANSITION_MS = 500;
/** Bloqueo tras cada cambio para evitar dobles avances mientras anima. */
const NAV_LOCK_MS = 420;
const SWIPE_THRESHOLD = 50;
/** Color del degradado bajo los controles en mobile (igual al fondo de la slide). */
const FADE_COLORS: Partial<Record<SlideData['kind'], string>> = { cta: '#1A2340', closing: '#FEFEFE' };

type Renderers = { [K in SlideData['kind']]: ComponentType<{ data: Extract<SlideData, { kind: K }> }> };
const renderers: Renderers = {
  cover: CoverSlide,
  diagnosis: DiagnosisSlide,
  statement: StatementSlide,
  pillars: PillarsSlide,
  role: RoleSlide,
  timeline: TimelineSlide,
  cta: CtaSlide,
  video: VideoSlide,
  closing: ClosingSlide,
};

function renderSlide(slide: SlideData) {
  const Component = renderers[slide.kind] as ComponentType<{ data: SlideData }>;
  return <Component data={slide} />;
}

/** Lee "#3" → índice 2. Cualquier valor inválido (#99, #abc, vacío) cae en la slide 1. */
function indexFromHash(hash: string): number {
  const raw = hash.replace(/^#/, '');
  if (!/^\d+$/.test(raw)) return 0;
  const n = Number(raw);
  return n >= 1 && n <= TOTAL ? n - 1 : 0;
}

const pad = (n: number) => String(n).padStart(2, '0');

function isNavLockedTarget(target: EventTarget | null) {
  const active = document.activeElement;
  const lock = (el: Element | null) => Boolean(el?.closest('video, [data-nav-lock]'));
  return lock(target instanceof Element ? target : null) || lock(active);
}

export function Deck() {
  const reduce = useReduced();
  const deckRef = useRef<HTMLDivElement>(null);
  const [[index, direction], setState] = useState<[number, number]>(() => [indexFromHash(window.location.hash), 1]);
  const lockedUntil = useRef(0);
  const { supported: fsSupported, isFullscreen, toggle: toggleFullscreen } = useFullscreen(deckRef);

  const goTo = useCallback((target: number, opts: { force?: boolean } = {}) => {
    const now = performance.now();
    if (!opts.force && now < lockedUntil.current) return;
    setState(([current]) => {
      const next = Math.min(TOTAL - 1, Math.max(0, target));
      if (next === current) return [current, 1];
      lockedUntil.current = now + NAV_LOCK_MS;
      return [next, next > current ? 1 : -1];
    });
  }, []);

  const indexRef = useRef(index);
  indexRef.current = index;
  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  // URL ⇄ slide actual
  useEffect(() => {
    const hash = `#${index + 1}`;
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [index]);

  useEffect(() => {
    const onHash = () => goTo(indexFromHash(window.location.hash), { force: true });
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [goTo]);

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isNavLockedTarget(e.target)) return;
      const key = e.key;

      if (key === 'f' || key === 'F') {
        if (e.repeat) return;
        e.preventDefault();
        void toggleFullscreen();
        return;
      }

      const forward = key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ' || key === 'Spacebar';
      const backward = key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp';
      if (!forward && !backward && key !== 'Home' && key !== 'End') return;

      // Siempre evitamos el comportamiento nativo (scroll, o "clic" del botón enfocado con Espacio).
      e.preventDefault();
      if (e.repeat) return;
      if (key === 'Home') goTo(0);
      else if (key === 'End') goTo(TOTAL - 1);
      else if (forward) next();
      else prev();
    };
    // Espacio sobre un botón enfocado dispara "click" en keyup: lo cancelamos para no duplicar el avance.
    const onKeyUp = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Spacebar') && !isNavLockedTarget(e.target)) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [goTo, next, prev, toggleFullscreen]);

  // Swipe horizontal (mobile)
  const touch = useRef<{ x: number; y: number; ignore: boolean } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touch.current = null;
      return;
    }
    const t = e.touches[0];
    const target = e.target as Element;
    touch.current = { x: t.clientX, y: t.clientY, ignore: Boolean(target.closest('video, [data-nav-lock], button')) };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || start.ignore) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next();
    else prev();
  };

  const slide = slides[index];
  const dark = slide.tone === 'dark';
  const fade = slide.kind === 'cover' ? null : (FADE_COLORS[slide.kind] ?? '#F3F4F6');

  const variants: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 80 }),
    center: { opacity: 1, x: 0, transition: { duration: reduce ? 0.2 : TRANSITION_MS / 1000, ease: easeOut } },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : dir * -80,
      transition: { duration: reduce ? 0.15 : TRANSITION_MS / 1000, ease: easeOut },
    }),
  };

  const chromeBtn = dark
    ? 'bg-black/35 text-white border-white/20 hover:bg-black/55'
    : 'bg-white/85 text-ink border-line hover:bg-white';
  const btnBase =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors disabled:cursor-not-allowed disabled:opacity-35';

  return (
    <div
      ref={deckRef}
      className="deck"
      role="region"
      aria-roledescription="presentación"
      aria-label={ui.deckLabel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.section
          key={index}
          className="absolute inset-0"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          aria-roledescription="slide"
          aria-label={ui.announce(index + 1, TOTAL, slide.announce)}
        >
          {renderSlide(slide)}
        </motion.section>
      </AnimatePresence>

      {/* Barra de progreso */}
      <div
        className={`absolute inset-x-0 top-0 z-30 h-1 ${dark ? 'bg-white/15' : 'bg-line'}`}
        role="progressbar"
        aria-label={ui.progressLabel}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-valuenow={index + 1}
      >
        <motion.div
          className="h-full origin-left"
          style={{ background: 'linear-gradient(90deg, var(--cyan), var(--aqua), var(--violet))' }}
          initial={false}
          animate={{ scaleX: (index + 1) / TOTAL }}
          transition={{ duration: reduce ? 0 : 0.5, ease: easeOut }}
        />
      </div>

      {/* Pantalla completa */}
      {fsSupported && (
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className={`${btnBase} ${chromeBtn} absolute right-[max(1rem,env(safe-area-inset-right))] top-4 z-30`}
          aria-label={isFullscreen ? ui.fullscreenExit : ui.fullscreenEnter}
          title={`${isFullscreen ? ui.fullscreenExit : ui.fullscreenEnter} (F)`}
        >
          {isFullscreen ? <Minimize2 size={18} aria-hidden="true" /> : <Maximize2 size={18} aria-hidden="true" />}
        </button>
      )}

      {/* En mobile, un degradado bajo los controles evita que se encimen con el texto al hacer scroll. */}
      {fade && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 md:hidden"
          style={{ background: `linear-gradient(to bottom, ${fade}00, ${fade}f2 55%)` }}
          aria-hidden="true"
        />
      )}

      {/* Puntos: salto directo a cualquier slide */}
      <nav
        className="absolute inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-30 flex justify-center md:bottom-[max(1.4rem,env(safe-area-inset-bottom))] md:left-1/2 md:right-auto md:-translate-x-1/2"
        aria-label={ui.dotsLabel}
      >
        <ol className={`flex items-center rounded-full border px-1.5 backdrop-blur-md ${chromeBtn}`}>
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="group flex h-8 min-w-[1.6rem] items-center justify-center rounded-full px-[3px]"
                  aria-label={ui.goTo(i + 1, s.announce)}
                  aria-current={active ? 'step' : undefined}
                  title={ui.goTo(i + 1, s.announce)}
                  data-testid="dot"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      active
                        ? 'w-5 bg-cyan'
                        : `w-2 ${dark ? 'bg-white/45 group-hover:bg-white/80' : 'bg-slate/35 group-hover:bg-slate/70'}`
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Controles inferiores */}
      <nav
        className="absolute bottom-[calc(max(0.5rem,env(safe-area-inset-bottom))+2.75rem)] right-[max(1rem,env(safe-area-inset-right))] z-30 flex items-center gap-2 md:bottom-[max(1rem,env(safe-area-inset-bottom))]"
        aria-label={ui.deckLabel}
      >
        <button type="button" className={`${btnBase} ${chromeBtn}`} onClick={prev} disabled={index === 0} aria-label={ui.prev}>
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <span
          className={`min-w-[4.75rem] rounded-full border px-3 py-2.5 text-center text-sm font-bold tabular-nums backdrop-blur-md ${chromeBtn}`}
          data-testid="counter"
          aria-hidden="true"
        >
          {pad(index + 1)} / {pad(TOTAL)}
        </span>
        <button type="button" className={`${btnBase} ${chromeBtn}`} onClick={next} disabled={index === TOTAL - 1} aria-label={ui.next}>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </nav>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {ui.announce(index + 1, TOTAL, slide.announce)}
      </div>
    </div>
  );
}
