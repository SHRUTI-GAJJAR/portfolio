import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import Folder from "./reactbits/Folder";
import { projects } from "../data/projects";
import "./reactbits/folder-tailwind.css";
import "./reactbits/folder-projects.css";

/* Charcoal tones with one warm burnt-orange folder; warm paper complements both. */
const FOLDER_COLORS = ["#7a3f22", "#2c2a31", "#332b27", "#292b32", "#31292b"];

function useFolderScale() {
  const scaleFor = (width) =>
    width < 420 ? 0.68 : width < 560 ? 0.82 : width < 900 ? 1.05 : 1.3;
  const [scale, setScale] = useState(() => scaleFor(window.innerWidth));

  useEffect(() => {
    const update = () => setScale(scaleFor(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

function stopPointer(event) {
  event.stopPropagation();
}

function buildItems(project) {
  const { title, tag, desc, tech, icon, live, code } = project;

  return [
    {
      title,
      content: (
        <div className="rb-doc">
          <div className="rb-doc-head">
            <span className="rb-doc-icon" aria-hidden="true">
              {icon}
            </span>
            <span className="rb-doc-title">{title}</span>
          </div>
          <span className="rb-doc-tag">{tag}</span>
          <p className="rb-doc-desc">{desc}</p>
          <span className="rb-doc-foot">Overview</span>
        </div>
      ),
    },
    {
      title: "Tech stack",
      content: (
        <div className="rb-doc">
          <div className="rb-doc-head">
            <span className="rb-doc-title">Tech stack</span>
          </div>
          <ul className="rb-doc-tech-list">
            {tech.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="rb-doc-foot">{title}</span>
        </div>
      ),
    },
    {
      title: "Links",
      content: (
        <div className="rb-doc">
          <div className="rb-doc-head">
            <span className="rb-doc-title">Links</span>
          </div>
          <div className="rb-doc-link-list">
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              onPointerDown={stopPointer}
              onClick={stopPointer}
            >
              Live demo
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a
              href={code}
              target="_blank"
              rel="noreferrer"
              onPointerDown={stopPointer}
              onClick={stopPointer}
            >
              Source
              <Github aria-hidden="true" />
            </a>
          </div>
          <span className="rb-doc-foot">{title}</span>
        </div>
      ),
    },
  ];
}

export default function Projects() {
  const scale = useFolderScale();
  const folders = useMemo(() => projects.map((project) => buildItems(project)), []);

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

      <div className="folder-grid">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className={`rb-folder-root folder-cell reveal ${index === 0 ? "featured" : ""}`}
            style={{
              "--folder-scale": scale,
              "--reveal-delay": `${index === 0 ? 0 : 80}ms`,
            }}
          >
            <Folder
              items={folders[index]}
              label={project.title}
              color={FOLDER_COLORS[index % FOLDER_COLORS.length]}
              paperColor="#fff6ec"
              size={scale}
            />
            <p className="folder-caption">
              <strong>{project.title}</strong>
              {project.tag}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
