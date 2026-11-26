/*
 * Résumé Download Button — adapted from Framekit UI
 * https://www.framekitui.live/docs/resume-download-button
 * MIT licensed. Animation phases, timings and motion are preserved; Tailwind
 * utilities are replaced with the portfolio's CSS tokens and theme.
 */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Download } from "lucide-react";
import "../styles/resume-download-button.css";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * The document glyph prints itself line by line, then drops into a tray as
 * the real file downloads and the label settles on "Saved to downloads".
 * Includes a live status announcement for screen readers.
 */
export function ResumeDownloadButton({
  href,
  fileName = "resume.pdf",
  meta = "PDF · 75 KB",
  label = "Download resume",
  onDownload,
  duration = 1500,
  className = "",
}) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = React.useState("idle");
  const timers = React.useRef([]);

  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const start = () => {
    if (phase !== "idle") return;
    setPhase("printing");

    const dur = reduced ? 300 : duration;

    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        // Real download, using the same anchor technique as Framekit UI.
        if (href) {
          const anchor = document.createElement("a");
          anchor.href = href;
          anchor.download = fileName;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        }
        onDownload?.();
      }, dur)
    );

    timers.current.push(
      window.setTimeout(() => setPhase("idle"), dur + 2600)
    );
  };

  const lines = [0, 1, 2, 3];
  const sparks = [0, 1, 2, 3, 4];

  return (
    <span className={`resumeDownload${className ? ` ${className}` : ""}`}>
      <motion.button
        type="button"
        onClick={start}
        aria-disabled={phase !== "idle"}
        whileHover={reduced || phase !== "idle" ? undefined : { y: -2 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 460, damping: 26 }}
        className="resumeDownloadButton"
        data-phase={phase}
      >
        <span className="resumeDownloadGlyph" aria-hidden="true">
          <span className="resumeDownloadTray" />
          <motion.span
            className="resumeDownloadSheet"
            initial={false}
            animate={
              phase === "done"
                ? { y: 5, scaleY: 0.35, opacity: 0.9 }
                : phase === "printing" && !reduced
                  ? { y: [0, -0.6, 0.5, -0.3, 0], scaleY: 1, opacity: 1 }
                  : { y: 0, scaleY: 1, opacity: 1 }
            }
            style={{ originY: 1 }}
            transition={
              phase === "printing" && !reduced
                ? { duration: 0.45, ease: "easeInOut" }
                : { type: "spring", stiffness: 360, damping: 20 }
            }
          >
            <span className="resumeDownloadScan" aria-hidden="true" />
            {lines.map((k) => (
              <motion.span
                key={k}
                className="resumeDownloadLine"
                style={{ width: k === 3 ? "55%" : "100%" }}
                initial={false}
                animate={{
                  scaleX:
                    phase === "idle" && k > 0
                      ? k === 1
                        ? 0.7
                        : 0.45
                      : 1,
                  opacity: phase === "printing" ? [0.2, 1] : 1,
                }}
                transition={
                  phase === "printing" && !reduced
                    ? {
                        duration: duration / 4000,
                        delay: (k * duration) / 4000,
                        ease: "easeOut",
                      }
                    : { duration: 0.2 }
                }
              />
            ))}
          </motion.span>

          {/* Completion flourish: a light ring leaves the tray and a few
              warm sparks scatter, so "saved" reads as a real event. */}
          {phase === "done" && (
            <>
              <motion.span
                className="resumeDownloadRipple"
                initial={{ scale: 0.35, opacity: 0.85 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
              />
              {sparks.map((index) => {
                const angle = (index * Math.PI * 2) / sparks.length;
                return (
                  <motion.span
                    key={index}
                    className="resumeDownloadSpark"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * 19,
                      y: Math.sin(angle) * 19,
                      opacity: 0,
                      scale: 0.2,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: "easeOut",
                      delay: index * 0.025,
                    }}
                  />
                );
              })}
            </>
          )}
        </span>

        <span className="resumeDownloadText">
          <span className="resumeDownloadLabel">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={phase}
                className="resumeDownloadLabelInner"
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { y: 18, opacity: 0, filter: "blur(6px)" }
                }
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { y: -18, opacity: 0, filter: "blur(4px)" }
                }
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {phase === "idle"
                  ? label
                  : phase === "printing"
                    ? "Preparing…"
                    : "Saved to downloads"}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="resumeDownloadMeta">
            {phase === "done" ? fileName : meta}
          </span>
        </span>

        <span className="resumeDownloadAction" aria-hidden="true">
          {phase === "done" ? (
            <motion.span
              initial={reduced ? false : { scale: 0, rotate: -55 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 17 }}
            >
              <Check className="resumeDownloadIcon" strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span
              className="resumeDownloadDownloadMotion"
              animate={
                phase === "printing" && !reduced
                  ? { y: [0, 3, 0], rotate: [0, -10, 10, 0] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                repeat: phase === "printing" ? Infinity : 0,
                duration: 0.7,
              }}
            >
              <Download className="resumeDownloadIcon" />
            </motion.span>
          )}
        </span>
      </motion.button>

      <span role="status" aria-live="polite" className="sr-only">
        {phase === "printing"
          ? "Preparing résumé"
          : phase === "done"
            ? `Résumé downloaded as ${fileName}`
            : ""}
      </span>
    </span>
  );
}

export default ResumeDownloadButton;
