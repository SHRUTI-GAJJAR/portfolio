import { SparkleText } from "./ui/sparkle-text";
import { ProjectRevealList } from "./ui/project-reveal-list";
import { certificates } from "../data/certificates";
import "./ui/project-reveal-list.css";

/* Map the real certificates onto the Framekit list's item shape. */
const items = certificates.map((certificate) => ({
  id: certificate.title,
  title: certificate.title,
  category: `${certificate.title} · ${certificate.issuer}`,
  year: certificate.year,
  blurb: certificate.issuer,
  src: certificate.preview,
  alt: `${certificate.title} certificate issued by ${certificate.issuer}`,
  href: certificate.file,
}));

export default function Certifications() {
  return (
    <section id="certifications" className="section wrap">
      <p className="sectionlabel">04 / CERTIFICATIONS</p>

      <div className="sectionhead">
        <h2>
          <span className="sk-root">
            <SparkleText
              as="span"
              text={
                <>
                  Learning that supports my <em>growth.</em>
                </>
              }
              count={6}
              restAfter={5000}
            />
          </span>
        </h2>
        <p>
          Certifications and professional training that complement my hands-on
          development experience.
        </p>
      </div>

      {/* The component renders real PDF links; open them in a new tab. */}
      <div
        className="prl-root"
        onClick={(event) => {
          const link = event.target.closest?.("a[href]");
          if (!link) return;
          event.preventDefault();
          window.open(link.href, "_blank", "noopener,noreferrer");
        }}
      >
        <ProjectRevealList items={items} titleAs="h3" />
      </div>
    </section>
  );
}
