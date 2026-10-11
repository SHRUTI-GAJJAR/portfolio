import { ArrowUpRight, Mail } from "lucide-react";
import CodeCard from "./CodeCard";
import { profile, socials } from "../data/site";

/**
 * Above-the-fold hero.
 *
 * Each block carries `reveal` with an increasing delay so the content cascades
 * in on first paint rather than appearing all at once.
 */
export default function Hero({ onNavigate }) {
  return (
    <section className="hero wrap">
      <div className="heroText">
        <p className="eyebrow reveal" style={{ "--reveal-delay": "0ms" }}>
          <i aria-hidden="true" />
          {profile.availability}
        </p>

        <h1 className="reveal" style={{ "--reveal-delay": "80ms" }}>
          Full-Stack
          <br />
          <em>Developer</em> building
          <br />
          practical web solutions.
        </h1>

        <p className="lead reveal" style={{ "--reveal-delay": "180ms" }}>
          Hi, I&apos;m <b>{profile.name}</b> — a Full-Stack Developer with
          hands-on experience in React, Node.js, Express.js and MongoDB. I build
          responsive web applications, REST APIs and real-world full-stack
          projects with a focus on clean, practical solutions.
        </p>

        <div className="buttons reveal" style={{ "--reveal-delay": "260ms" }}>
          <button
            className="primary"
            onClick={() => onNavigate("projects")}
          >
            View my work
            <ArrowUpRight aria-hidden="true" />
          </button>

          <a className="secondary" href={`mailto:${profile.email}`}>
            Let&apos;s connect
            <Mail aria-hidden="true" />
          </a>
        </div>

        <ul className="socials reveal" style={{ "--reveal-delay": "330ms" }}>
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                <Icon aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="heroVisual reveal" style={{ "--reveal-delay": "220ms" }}>
        <div className="orb" aria-hidden="true" />
        <CodeCard />
      </div>
    </section>
  );
}