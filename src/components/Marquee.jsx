import { Asterisk } from "lucide-react";

/**
 * Infinite scrolling technology strip.
 *
 * The list is rendered twice and the track is translated by exactly -50%, so
 * the seam is invisible and the loop never shows a gap.
 *
 * Pauses on hover and when the tab is hidden so it is never a distraction.
 */
export default function Marquee({ items }) {
  return (
    <section className="marquee" aria-label="Technologies I work with">
      <div className="marqueetrack">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1}>
            {items.map((item) => (
              <li key={item}>
                <Asterisk aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}