import { useEffect, useRef } from "react";

const clamp = (value) => Math.max(-0.5, Math.min(0.5, value));

/**
 * Pointer-driven 3D tilt for a single card.
 *
 * The hook only writes CSS custom properties (--tx, --ty, --lx, --ly); all of
 * the actual rendering lives in CSS, so there is no per-frame React render.
 * Pointer work is throttled to one write per animation frame and is skipped
 * entirely for coarse pointers and for users who prefer reduced motion.
 * Every listener and pending frame is released on unmount / remount.
 */
export function useCardTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    let frame = 0;
    let target = null;

    const paint = () => {
      frame = 0;
      if (!target) return;

      const { x, y } = target;
      node.style.setProperty("--tx", `${(-y * 6).toFixed(2)}deg`);
      node.style.setProperty("--ty", `${(x * 8).toFixed(2)}deg`);
      node.style.setProperty("--lx", `${((x + 0.5) * 100).toFixed(1)}%`);
      node.style.setProperty("--ly", `${((y + 0.5) * 100).toFixed(1)}%`);
    };

    const onMove = (event) => {
      if (reduced.matches || !fine.matches) return;

      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      target = {
        x: clamp((event.clientX - rect.left) / rect.width - 0.5),
        y: clamp((event.clientY - rect.top) / rect.height - 0.5),
      };

      if (!frame) frame = requestAnimationFrame(paint);
    };

    const reset = () => {
      target = null;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      node.style.setProperty("--tx", "0deg");
      node.style.setProperty("--ty", "0deg");
      node.style.setProperty("--lx", "50%");
      node.style.setProperty("--ly", "45%");
    };

    const sync = () => {
      if (reduced.matches || !fine.matches) reset();
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", reset);
    node.addEventListener("pointercancel", reset);
    reduced.addEventListener?.("change", sync);
    fine.addEventListener?.("change", sync);

    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
      node.removeEventListener("pointercancel", reset);
      reduced.removeEventListener?.("change", sync);
      fine.removeEventListener?.("change", sync);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
