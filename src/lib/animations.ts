
import { useEffect, useState } from 'react';

export const useDelayedRender = (active: boolean, delay: number) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (active && !isRendered) {
      timeout = setTimeout(() => {
        setIsRendered(true);
      }, delay);
    }

    if (!active && isRendered) {
      setIsRendered(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [active, isRendered, delay]);

  return isRendered;
};

export const staggeredChildren = (delay = 50) => {
  return {
    animate: (index: number) => ({
      transition: { delay: index * delay / 1000 }
    })
  };
};

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
};
