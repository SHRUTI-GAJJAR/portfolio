import { Download, Mail } from "lucide-react";
import { profile } from "../data/site";

export default function Contact() {
  return (
    <section className="cta wrap reveal" id="contact">
      <div>
        <p className="sectionlabel">05 / CONTACT</p>
        <h2>
          Let&apos;s build something
          <br />
          <em>meaningful.</em>
        </h2>
        <p>
          I&apos;m open to Full-Stack, MERN and Software Development internship
          opportunities.
        </p>
      </div>

      <div className="ctabtns">
        <a className="primary" href={`mailto:${profile.email}`}>
          Email me
          <Mail />
        </a>

        <a className="secondary" href={profile.resume} download>
          Download resume
          <Download />
        </a>
      </div>
    </section>
  );
}