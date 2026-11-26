import { skillGroups } from "../data/projects";
import "./skills.css";

/**
 * Toolkit section.
 *
 * Four category cards only: one combined 3D landscape scene, one category
 * heading and one compact plain-text technology line per card. The section
 * heading, grouping and all technology names are preserved.
 */

const categoryArt = {
  Frontend: {
    heading: "Frontend",
    scene: "Web Development Studio",
    src: "/toolkit-previews/frontend.svg",
    alt: "Isometric miniature web development studio with a browser workspace",
  },
  Backend: {
    heading: "Backend",
    scene: "Server Engineering Lab",
    src: "/toolkit-previews/backend.svg",
    alt: "Isometric miniature server engineering lab with connected server infrastructure",
  },
  Database: {
    heading: "Database",
    scene: "Data Management Lab",
    src: "/toolkit-previews/database.svg",
    alt: "Isometric miniature data management lab with organized storage",
  },
  "Tools & Deployment": {
    heading: "Tools",
    scene: "Developer Workspace",
    src: "/toolkit-previews/tools.svg",
    alt: "Isometric miniature developer workspace with a unified workstation",
  },
};

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

      <div className="toolkitcards">
        {skillGroups.map((group) => {
          const art = categoryArt[group.title];
          return (
            <article className="toolkitcard" key={group.title}>
              <div className="toolkitcard__art">
                <img src={art.src} alt={`${art.scene} — ${art.alt}`} loading="lazy" />
              </div>
              <div className="toolkitcard__body">
                <h3>{art.heading}</h3>
                <p className="toolkitcard__tech">{group.items.join(" · ")}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
