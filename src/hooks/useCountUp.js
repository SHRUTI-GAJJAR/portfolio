import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `target` the first time the element scrolls into view.
 *
 * Non-numeric targets are returned as-is so a stat can be a word ("MERN")
 * rather than a number. Users who prefer reduced motion get the final value
 * immediately with no animation.
 *
 * @param {number|string} target
 * @param {number} duration milliseconds
 */
export function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isNumber = typeof target === "number";

  useEffect(() => {
    if (!isNumber) return;

    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frame = 0;

    const run = () => {
      const started = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - started) / duration, 1);

        // easeOutCubic — fast start, gentle settle.
        const eased = 1 - Math.pow(1 - progress, 3);

        setValue(Math.round(target * eased));

        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        run();
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, isNumber]);

  return { ref, value: isNumber ? value : target };
}