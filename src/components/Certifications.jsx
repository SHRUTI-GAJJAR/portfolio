import { ArrowUpRight } from "lucide-react";
import { certificates } from "../data/certificates";

/**
 * Certifications rendered as an editorial index: title, issuer, action.
 * Hairline rows instead of cards keeps this section visually distinct from
 * the project grid above it.
 */
export default function Certifications() {
  return (
    <section id="certifications" className="section wrap">
      <p className="sectionlabel">04 / CERTIFICATIONS</p>

      <div className="sectionhead">
        <h2>
          Learning that supports my <em>growth.</em>
        </h2>
        <p>
          Certifications and professional training that complement my hands-on
          development experience.
        </p>
      </div>

      <div className="certificategrid">
        {certificates.map((certificate, index) => (
          <article
            className="certificate reveal"
            key={certificate.title}
            style={{ "--reveal-delay": `${index * 90}ms` }}
          >
            <h3>{certificate.title}</h3>
            <p>{certificate.issuer}</p>

            <a
              className="textlink"
              href={certificate.file}
              target="_blank"
              rel="noreferrer"
            >
              View certificate
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> — {certificate.title}</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
