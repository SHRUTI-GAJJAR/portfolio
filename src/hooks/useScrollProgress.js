import { useEffect, useRef } from "react";

/**
 * Tracks how far the page has been scrolled (0 → 1) and whether it has moved
 * past a small threshold.
 *
 * Both values are written straight to CSS custom properties on the document
 * rather than held in React state, so the scroll handler never triggers a
 * re-render.
 */
export function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(Math.max(value, 0), 1);

      progress.current = clamped;

      document.documentElement.style.setProperty(
        "--scroll-progress",
        clamped.toFixed(4)
      );

      document.documentElement.classList.toggle("scrolled", window.scrollY > 24);
    };

    // rAF-throttled so we do at most one measurement per frame.
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}