import { Code2, Database, ExternalLink, Server } from "lucide-react";
import { skillGroups } from "../data/projects";

const ICONS = [Code2, Server, Database, ExternalLink];

export default function Skills() {
  return (
    <section id="skills" className="section wrap">
      <p className="sectionlabel">03 / TOOLKIT</p>

      <div className="skillgrid">
        {skillGroups.map((group, index) => {
          const Icon = ICONS[index];

          return (
            <div
              className="skill spotlight reveal"
              key={group.title}
              style={{ "--reveal-delay": `${index * 80}ms` }}
            >
              <Icon aria-hidden="true" />
              <h3>{group.title}</h3>
              <p>{group.items.join(" · ")}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}