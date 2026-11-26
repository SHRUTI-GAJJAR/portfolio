import { Mail } from "lucide-react";
import ResumeDownloadButton from "./ResumeDownloadButton";
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

        <a className="ctaemail" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </div>

      <div className="ctabtns">
        <a className="primary" href={`mailto:${profile.email}`}>
          Email me
          <Mail />
        </a>

        <ResumeDownloadButton
          href={profile.resume}
          fileName="Shruti_Ujeniya_Resume-2026.pdf"
          meta="PDF · 75 KB"
          label="Download resume"
        />
      </div>
    </section>
  );
}