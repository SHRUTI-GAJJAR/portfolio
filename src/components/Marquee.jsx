import { Network, Upload } from "lucide-react";
import {
  SiBootstrap,
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiMongoose,
  SiMysql,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiRender,
  SiSupabase,
  SiTailwindcss,
  SiVercel,
  SiVite,
} from "react-icons/si";
import LogoLoop from "./logoloop/LogoLoop";
import "./Marquee.css";

/*
 * Technology strip data. Icons come from react-icons/si (Simple Icons) and
 * use each brand's official colour, with a silver/lavender tint where the
 * official mark is black and would disappear on the charcoal background.
 * The array is module-level so LogoLoop never re-measures on re-render.
 */
const brand = (Icon, color) => <Icon style={{ color }} aria-hidden="true" />;

const techLogos = [
  // Frontend
  { title: "HTML5", ariaLabel: "HTML5", hoverColor: "#e34f26", node: brand(SiHtml5, "#e34f26") },
  { title: "CSS3", ariaLabel: "CSS3", hoverColor: "#a78bfa", node: brand(SiCss, "#a78bfa") },
  { title: "JavaScript", ariaLabel: "JavaScript", hoverColor: "#f7df1e", node: brand(SiJavascript, "#f7df1e") },
  { title: "React", ariaLabel: "React", hoverColor: "#61dafb", node: brand(SiReact, "#61dafb") },
  { title: "Vite", ariaLabel: "Vite", hoverColor: "#9135ff", node: brand(SiVite, "#a78bfa") },
  { title: "Tailwind CSS", ariaLabel: "Tailwind CSS", hoverColor: "#06b6d4", node: brand(SiTailwindcss, "#06b6d4") },
  { title: "Bootstrap", ariaLabel: "Bootstrap", hoverColor: "#a78bfa", node: brand(SiBootstrap, "#a78bfa") },

  // Backend
  { title: "Node.js", ariaLabel: "Node.js", hoverColor: "#5fa04e", node: brand(SiNodedotjs, "#5fa04e") },
  { title: "Express.js", ariaLabel: "Express.js", hoverColor: "#e5e7eb", node: brand(SiExpress, "#e5e7eb") },
  { title: "MongoDB", ariaLabel: "MongoDB", hoverColor: "#47a248", node: brand(SiMongodb, "#47a248") },
  { title: "Mongoose", ariaLabel: "Mongoose", hoverColor: "#a1a1aa", node: brand(SiMongoose, "#a1a1aa") },
  { title: "MySQL", ariaLabel: "MySQL", hoverColor: "#4479a1", node: brand(SiMysql, "#4479a1") },
  { title: "PostgreSQL", ariaLabel: "PostgreSQL", hoverColor: "#6f9bff", node: brand(SiPostgresql, "#6f9bff") },
  { title: "Supabase", ariaLabel: "Supabase", hoverColor: "#3fcf8e", node: brand(SiSupabase, "#3fcf8e") },
  { title: "REST APIs", ariaLabel: "REST APIs", hoverColor: "#a78bfa", node: <Network style={{ color: "#a78bfa" }} aria-hidden="true" /> },
  { title: "JWT Authentication", ariaLabel: "JWT Authentication", hoverColor: "#d8b4fe", node: brand(SiJsonwebtokens, "#d8b4fe") },
  { title: "Multer", ariaLabel: "Multer", hoverColor: "#d8b4fe", node: <Upload style={{ color: "#d8b4fe" }} aria-hidden="true" /> },

  // Development tools & deployment
  { title: "Postman", ariaLabel: "Postman", hoverColor: "#ff6c37", node: brand(SiPostman, "#ff6c37") },
  { title: "Git", ariaLabel: "Git", hoverColor: "#f03c2e", node: brand(SiGit, "#f03c2e") },
  { title: "GitHub", ariaLabel: "GitHub", hoverColor: "#e5e7eb", node: brand(SiGithub, "#e5e7eb") },
  { title: "Vercel", ariaLabel: "Vercel", hoverColor: "#e5e7eb", node: brand(SiVercel, "#e5e7eb") },
  { title: "Render", ariaLabel: "Render", hoverColor: "#a1a1aa", node: brand(SiRender, "#a1a1aa") },
];

/**
 * Tech stack marquee. Only the strip's content changed — the section wrapper,
 * its position in the page and its responsive behaviour are preserved.
 */
export default function Marquee() {
  return (
    <section className="marquee marquee--logos" aria-label="Technologies I work with">
      <LogoLoop
        logos={techLogos}
        ariaLabel="Technologies I work with"
        direction="left"
        layout="line"
        speed={72}
        logoHeight={32}
        gap={46}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutWidth={0.12}
        labels="inline"
        intro
        draggable
        scrollBoost={0}
      />
    </section>
  );
}
