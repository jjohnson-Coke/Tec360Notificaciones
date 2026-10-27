import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';
import { useReduced } from '../motion';

interface CountUpProps {
  to: number;
  duration?: number;
  delay?: number;
}

/** Contador de 0 a `to`; con movimiento reducido muestra el valor final directamente. */
export function CountUp({ to, duration = 1.2, delay = 0.3 }: CountUpProps) {
  const reduce = useReduced();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, duration, delay, reduce]);

  return (
    <>
      <span aria-hidden="true" className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{to}</span>
    </>
  );
}
