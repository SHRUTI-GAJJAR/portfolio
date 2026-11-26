import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Award,
  Grid2x2,
  House,
  Layers,
  Mail,
  UserRound,
} from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";
import { navLinks } from "../data/site";

/**
 * Floating dock / native — recreated for this React app.
 *
 * The original Framer component relies on the Framer runtime and remote icon
 * modules, so the behaviour is reproduced with local state + CSS transitions:
 * compact icon dock, one item expands on hover/focus, and a shared highlight
 * slides behind the hovered item (or the active section when idle).
 */
const SECTION_ICONS = {
  home: House,
  about: UserRound,
  projects: Grid2x2,
  skills: Layers,
  certifications: Award,
  contact: Mail,
};

export default function Navbar({ dark, onToggleTheme, active, onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const [labelWidths, setLabelWidths] = useState({});
  const [highlight, setHighlight] = useState({ left: 7, width: 36 });

  const dockRef = useRef(null);
  const measureRefs = useRef({});

  // Hover/focus owns the dock while it is happening; otherwise the current
  // section keeps the highlight so scrolling always has clear feedback.
  const highlightId = hovered ?? active;

  const measure = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const styles = window.getComputedStyle(dock);
    const read = (name, fallback) => {
      const value = parseFloat(styles.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };

    const itemSize = read("--dock-item", 36);
    const gap = read("--dock-gap", 4);
    const padding = read("--dock-pad", 7);
    const labelGap = read("--dock-label-gap", 9);
    const labelsEnabled = read("--dock-labels", 1) !== 0;

    const widths = {};
    navLinks.forEach((link) => {
      const node = measureRefs.current[link.id];
      widths[link.id] = node ? node.getBoundingClientRect().width : 0;
    });

    setLabelWidths((previous) => {
      const changed = navLinks.some(
        (link) => Math.abs((previous[link.id] ?? 0) - widths[link.id]) > 0.5
      );
      return changed ? widths : previous;
    });

    let left = padding;
    let next = { left: padding, width: itemSize };

    for (const link of navLinks) {
      // Only the hovered item actually grows; the active item merely carries
      // the highlight while the dock is idle.
      const isExpanded = link.id === hovered && labelsEnabled;
      const width = isExpanded ? itemSize + labelGap + widths[link.id] : itemSize;

      if (link.id === highlightId) {
        next = { left, width };
        break;
      }

      left += width + gap;
    }

    setHighlight(next);
  }, [highlightId, hovered]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <nav
      ref={dockRef}
      className="dock"
      aria-label="Section navigation"
      onMouseLeave={() => setHovered(null)}
    >
      <span
        className="dockhighlight"
        aria-hidden="true"
        style={{
          transform: `translateX(${highlight.left}px)`,
          width: `${highlight.width}px`,
        }}
      />

      {navLinks.map((link) => {
        const Icon = SECTION_ICONS[link.id];
        const isExpanded = hovered === link.id;
        const isActive = active === link.id;

        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`dockitem${isExpanded ? " is-expanded" : ""}${
              isActive ? " is-active" : ""
            }`}
            style={{ "--dock-label-w": `${labelWidths[link.id] ?? 0}px` }}
            aria-label={link.label}
            aria-current={isActive ? "location" : undefined}
            onMouseEnter={() => setHovered(link.id)}
            onFocus={() => setHovered(link.id)}
            onBlur={() => setHovered(null)}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(link.id);
            }}
          >
            <span className="dockicon">
              <Icon size={15} strokeWidth={2.6} aria-hidden="true" />
            </span>

            <span className="docklabel" aria-hidden="true">
              <span className="docklabelinner">
                {[...link.label].map((character, index) => (
                  <span
                    className="dockchar"
                    key={index}
                    style={{ "--char-index": index }}
                  >
                    {character === " " ? "\u00a0" : character}
                  </span>
                ))}
              </span>
            </span>
          </a>
        );
      })}

      <span className="dockdivider" aria-hidden="true" />

      <ThemeSwitch dark={dark} onToggle={onToggleTheme} />

      {/*
        Off-screen copies of the labels let the dock measure their natural
        width, so an expanding item (and its moving highlight) lands exactly
        on the text instead of an estimate.
      */}
      <span className="dockmeasure" aria-hidden="true">
        {navLinks.map((link) => (
          <span
            key={link.id}
            ref={(node) => {
              measureRefs.current[link.id] = node;
            }}
          >
            {link.label}
          </span>
        ))}
      </span>
    </nav>
  );
}
