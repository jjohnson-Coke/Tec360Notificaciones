import { createContext, useContext, type ReactNode } from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/** true cuando el usuario pidió reducir el movimiento. */
export const ReducedMotionContext = createContext(false);
export const useReduced = () => useContext(ReducedMotionContext);

export function staggerVariants(reduce: boolean, stagger = 0.09, delay = 0.25): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : delay } },
  };
}

export function itemVariants(reduce: boolean, distance = 22): Variants {
  return reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
      };
}

type StaggerProps = HTMLMotionProps<'div'> & { stagger?: number; delay?: number; children: ReactNode };

/** Contenedor que escalona la aparición de sus <Item> al montarse. */
export function Stagger({ stagger, delay, children, ...rest }: StaggerProps) {
  const reduce = useReduced();
  return (
    <motion.div variants={staggerVariants(reduce, stagger, delay)} initial="hidden" animate="show" {...rest}>
      {children}
    </motion.div>
  );
}

type ItemProps = HTMLMotionProps<'div'> & { distance?: number; children: ReactNode };

export function Item({ distance, children, ...rest }: ItemProps) {
  const reduce = useReduced();
  return (
    <motion.div variants={itemVariants(reduce, distance)} {...rest}>
      {children}
    </motion.div>
  );
}
