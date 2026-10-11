import { useCountUp } from "../hooks/useCountUp";
import { stats } from "../data/site";

export default function Stats() {
  return (
    <section className="stats wrap" aria-label="At a glance">
      {stats.map((stat) => (
        <Stat key={stat.label} stat={stat} />
      ))}
    </section>
  );
}

function Stat({ stat }) {
  const { ref, value } = useCountUp(stat.value, 1400);

  return (
    <div ref={ref}>
      <strong>
        {value}
        {stat.suffix}
      </strong>
      <span>{stat.label}</span>
    </div>
  );
}