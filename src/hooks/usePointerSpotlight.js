import { useEffect } from "react";

/**
 * Drives the cursor-follow spotlight on cards.
 *
 * A single delegated pointermove listener tracks the hovered `.spotlight`
 * element and writes the pointer position as local CSS custom properties.
 * Because it writes straight to the DOM, scrolling and hovering never trigger
 * a React re-render.
 *
 * Falls back to a centred glow for devices without a fine pointer, since
 * hover states do not exist there.
 */
export function usePointerSpotlight() {
  useEffect(() => {
    let frame = 0;
    let event = null;
    let active = null;

    const paint = () => {
      frame = 0;

      const element = active;
      if (!element || !event) return;

      const rect = element.getBoundingClientRect();

      element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      element.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    const onMove = (pointerEvent) => {
      const element = pointerEvent.target?.closest?.(".spotlight") ?? null;

      // Cheap early-out: same card as last time still needs a repaint, but a
      // different card (or none) resets state.
      if (element !== active) active = element;

      if (!element) return;

      event = pointerEvent;
      if (frame) return;

      frame = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
}