import { useCountUp } from "../hooks/useCountUp";
import { useCardTilt } from "../hooks/useCardTilt";
import { stats } from "../data/site";

export default function Stats() {
  return (
    <section className="stats wrap" aria-label="At a glance">
      <div className="stats-atmosphere" aria-hidden="true">
        <span className="stats-atmosphere__wash" />
        <span className="stats-atmosphere__orb stats-atmosphere__orb--one" />
        <span className="stats-atmosphere__orb stats-atmosphere__orb--two" />
      </div>

      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </section>
  );
}

function StatCard({ stat, index }) {
  const tiltRef = useCardTilt();
  const { ref: countRef, value } = useCountUp(stat.value, 1400);

  const isNumber = typeof stat.value === "number";
  const finalValue = `${stat.value}${stat.suffix ?? ""}`;

  return (
    <div
      className="stat-shell reveal"
      style={{ "--reveal-delay": `${index * 110}ms` }}
    >
      <article className="stat-card" ref={tiltRef}>
        <span className="stat-card__halo" aria-hidden="true" />
        <span className="stat-card__plate" aria-hidden="true" />
        <span className="stat-card__bevel" aria-hidden="true" />
        <span className="stat-card__edge" aria-hidden="true" />
        <span className="stat-card__sheen" aria-hidden="true" />
        <span className="stat-card__sweep" aria-hidden="true">
          <i />
        </span>

        <div className="stat-card__content">
          <div className="stat-card__top" aria-hidden="true">
            <span className="stat-card__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="stat-card__node" />
          </div>

          <strong className="stat-card__value">
            <span
              className={`stat-card__digits${isNumber ? "" : " stat-card__digits--text"}`}
              ref={countRef}
              aria-hidden="true"
            >
              {isNumber ? (
                <>
                  {value}
                  {stat.suffix}
                </>
              ) : (
                stat.value.split("").map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="stat-card__char"
                    style={{ "--char-index": charIndex }}
                  >
                    {char}
                  </span>
                ))
              )}
            </span>
            <span className="sr-only">{finalValue}</span>
          </strong>

          <span className="stat-card__label">{stat.label}</span>
        </div>
      </article>
    </div>
  );
}
