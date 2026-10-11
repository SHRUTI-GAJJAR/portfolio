import { useEffect } from "react";

/**
 * One-shot reveal-on-scroll for the whole page.
 *
 * Any element carrying the `reveal` class is animated in the first time it
 * enters the viewport, then unobserved so it only ever plays once.
 *
 * Elements are staggered with an inline `--reveal-delay` custom property, set
 * on the element itself, so no wrapper elements are needed and grid layouts
 * stay untouched.
 *
 * @param {Function} deps  changing this re-scans the DOM
 */
export function useRevealOnScroll(deps = []) {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(".reveal"));
    if (!targets.length) return;

    // No IO support, or the user prefers reduced motion: show everything.
    if (!("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}