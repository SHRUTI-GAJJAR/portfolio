import { certificates } from "../data/certificates";

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
        {certificates.map((certificate) => (
          <article
            className="certificate spotlight reveal"
            key={certificate.title}
            style={{
              "--reveal-delay": `${certificates.indexOf(certificate) * 90}ms`,
            }}
          >
            <div className="certificateicon" aria-hidden="true">
              📜
            </div>

            <div className="certificateinfo">
              <h3>{certificate.title}</h3>
              <p>{certificate.issuer}</p>
            </div>

            <a
              className="secondary"
              href={certificate.file}
              target="_blank"
              rel="noreferrer"
            >
              View Certificate →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}