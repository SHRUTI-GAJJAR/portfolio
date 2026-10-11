import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <section id="projects" className="section wrap">
      <p className="sectionlabel">02 / SELECTED WORK</p>

      <div className="sectionhead">
        <h2>
          Things I&apos;ve <em>built.</em>
        </h2>
        <p>
          Real projects, practical features and hands-on full-stack development.
        </p>
      </div>

      <div className="grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            featured={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, featured }) {
  const { title, tag, desc, tech, icon, live, code } = project;

  return (
    <article
      className={`project spotlight reveal ${featured ? "featured" : ""}`}
      style={{ "--reveal-delay": `${featured ? 0 : 80}ms` }}
    >
      <div className="projecttop">
        <span className="projecticon" aria-hidden="true">
          {icon}
        </span>
        <span>{tag}</span>
      </div>

      <h3>{title}</h3>
      <p>{desc}</p>

      <ul className="chips">
        {tech.map((item) => (
          <li key={item}>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="projectlinks">
        <a href={live} target="_blank" rel="noreferrer">
          Live demo
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> for {title}</span>
        </a>

        <a href={code} target="_blank" rel="noreferrer">
          Source
          <Github aria-hidden="true" />
          <span className="sr-only"> for {title}</span>
        </a>
      </div>
    </article>
  );
}