import { skillGroups } from "../data/projects";

/**
 * Toolkit section.
 *
 * Rendered as grouped rows rather than four equal cards: a small-caps group
 * label on the left, the technologies flowing on the right. Reads like a
 * résumé skills block and stays scannable at any width.
 */
export default function Skills() {
  return (
    <section id="skills" className="section wrap">
      <p className="sectionlabel">03 / TOOLKIT</p>

      <div className="sectionhead">
        <h2>
          The <em>toolkit.</em>
        </h2>
        <p>Grouped by where each technology sits in the stack.</p>
      </div>

      <div className="skillgroups">
        {skillGroups.map((group, index) => (
          <div
            className="skillgroup reveal"
            key={group.title}
            style={{ "--reveal-delay": `${index * 70}ms` }}
          >
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
