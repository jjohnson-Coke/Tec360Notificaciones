import { Fragment, type ReactNode } from 'react';
import type { Rich as RichText } from '../content/slides';

type Token = { type: 'text' | 'em' | 'key'; value: string };

export function parseRich(text: RichText): Token[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part): Token => {
      if (part.startsWith('**')) return { type: 'key', value: part.slice(2, -2) };
      if (part.startsWith('*')) return { type: 'em', value: part.slice(1, -1) };
      return { type: 'text', value: part };
    });
}

/** Texto plano (para aria-label y anuncios). */
export const plainRich = (text: RichText) => parseRich(text).map((t) => t.value).join('');

interface RichProps {
  text: RichText;
  /** Render personalizado de las palabras clave; recibe su índice entre las palabras clave. */
  renderKey?: (value: string, index: number) => ReactNode;
}

export function Rich({ text, renderKey }: RichProps) {
  let keyIndex = 0;
  return (
    <>
      {parseRich(text).map((token, i) => {
        if (token.type === 'em') return <em key={i}>{token.value}</em>;
        if (token.type === 'key') {
          const k = keyIndex++;
          return (
            <Fragment key={i}>
              {renderKey ? renderKey(token.value, k) : <strong className="font-bold text-cyan-text">{token.value}</strong>}
            </Fragment>
          );
        }
        return <Fragment key={i}>{token.value}</Fragment>;
      })}
    </>
  );
}
