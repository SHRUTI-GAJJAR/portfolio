import { Mail } from "lucide-react";
import ResumeDownloadButton from "./ResumeDownloadButton";
import { SparkleText } from "./ui/sparkle-text";
import { profile, socials } from "../data/site";

export default function Contact() {
  return (
    <section className="cta wrap reveal" id="contact">
      <div>
        <p className="sectionlabel">05 / CONTACT</p>
        <h2>
          <span className="sk-root">
            <SparkleText
              as="span"
              text={
                <>
                  Let&apos;s build something
                  <br />
                  <em>meaningful.</em>
                </>
              }
              count={6}
              restAfter={5000}
            />
          </span>
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

        {socials.map(({ label, href, Icon }) => (
          <a
            className="secondary"
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {label}
            <Icon />
          </a>
        ))}

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