import React, { useEffect, useRef, useState } from 'react';

const DURATION = 1050;
const EASE_OUT_CUBIC = (t) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const StatNumber = ({ value, target = null, render = (n) => n }) => {
  const nodeRef = useRef(null);
  const [count, setCount] = useState(prefersReducedMotion() ? target : 0);
  const startedRef = useRef(false);

  const finalText = target == null ? value : render(target);

  useEffect(() => {
    if (target == null || prefersReducedMotion()) return undefined;

    const node = nodeRef.current;
    if (!node) return undefined;

    let raf = 0;
    let timeout = 0;

    const begin = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        setCount(Math.round(EASE_OUT_CUBIC(t) * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();
        // When the figures are on screen at load, wait for the masthead
        // entrance to finish so the count reads as one moment.
        timeout = window.setTimeout(begin, entry.time < 300 ? 900 : 0);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <span ref={nodeRef}>
      {target == null ? (
        value
      ) : (
        <>
          <span className="sr-only">{finalText}</span>
          <span aria-hidden="true">{render(count)}</span>
        </>
      )}
    </span>
  );
};

export default StatNumber;