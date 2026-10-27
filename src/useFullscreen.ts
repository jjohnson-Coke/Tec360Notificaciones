import { useCallback, useEffect, useState, type RefObject } from 'react';

type WebkitDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

const doc = () => document as WebkitDocument;
const currentFullscreenElement = () => doc().fullscreenElement ?? doc().webkitFullscreenElement ?? null;

/** Fullscreen API sobre un elemento (con prefijo webkit para Safari). */
export function useFullscreen(ref: RefObject<HTMLElement>) {
  // iPhone/Safari iOS no permite fullscreen sobre elementos: ahí `supported` es false.
  const [supported] = useState(() => {
    if (typeof document === 'undefined') return false;
    const el = document.documentElement as WebkitElement;
    const enabled = document.fullscreenEnabled || doc().webkitFullscreenEnabled;
    return Boolean(enabled && (el.requestFullscreen || el.webkitRequestFullscreen));
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(currentFullscreenElement()));
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, []);

  const toggle = useCallback(async () => {
    if (!supported) return;
    try {
      if (currentFullscreenElement()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else await doc().webkitExitFullscreen?.();
      } else {
        const el = ref.current as WebkitElement | null;
        if (!el) return;
        if (el.requestFullscreen) await el.requestFullscreen();
        else await el.webkitRequestFullscreen?.();
      }
    } catch {
      // El navegador puede rechazar la petición (p. ej. sin gesto del usuario); no es crítico.
    }
  }, [ref, supported]);

  return { supported, isFullscreen, toggle };
}
