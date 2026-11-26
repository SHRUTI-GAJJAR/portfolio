import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import HeroVisual from "./HeroVisual";
import { profile } from "../data/site";
import "../styles/hero.css";

const ROLES = [profile.role, "MERN Stack Developer", "React Developer"];

/**
 * Small typewriter used for the animated role line. Falls back to the static
 * primary role for visitors who prefer reduced motion.
 */
function useTypewriter(phrases) {
  const [text, setText] = useState("");
  const current = useRef("");

  useEffect(() => {
    const update = (value) => {
      current.current = value;
      setText(value);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update(phrases[0]);
      return;
    }

    let phraseIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      const value = current.current;

      if (!deleting) {
        if (value.length < phrase.length) {
          update(phrase.slice(0, value.length + 1));
          timer = window.setTimeout(tick, 58);
        } else {
          deleting = true;
          timer = window.setTimeout(tick, 1900);
        }
      } else if (value.length > 0) {
        update(phrase.slice(0, value.length - 1));
        timer = window.setTimeout(tick, 26);
      } else {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        deleting = false;
        timer = window.setTimeout(tick, 340);
      }
    };

    timer = window.setTimeout(tick, 420);
    return () => window.clearTimeout(timer);
  }, [phrases]);

  return text;
}

/**
 * Above-the-fold hero.
 *
 * Text content is preserved from the site data: the name, availability, role,
 * tagline, introduction, CTA targets and social URLs all come from `site.js`.
 *
 * The portfolio's existing SmokeyCursor is mounted once in App and is left
 * completely untouched: this component adds no cursor, spotlight or pointer
 * element of its own, and its decorative scene never captures pointer events.
 */
export default function Hero({ onNavigate }) {
  const heroRef = useRef(null);
  const typedRole = useTypewriter(ROLES);

  const [firstName, ...familyName] = profile.name.split(" ");

  /* Depth parallax is applied only to the 3D scene layers through CSS custom
     properties. It adds no visible pointer and does not intercept, replace or
     reconfigure the existing cursor canvas. Disabled on touch and for reduced
     motion. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const clamp = (value) => Math.max(-1, Math.min(1, value));

    const reset = () => {
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };

    const onMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      hero.style.setProperty("--mx", clamp(x).toFixed(3));
      hero.style.setProperty("--my", clamp(y).toFixed(3));
    };

    const bind = () => {
      const enabled = !reduced.matches && finePointer.matches;
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", reset);
      if (enabled) {
        hero.addEventListener("pointermove", onMove, { passive: true });
        hero.addEventListener("pointerleave", reset);
      } else {
        reset();
      }
    };

    bind();
    reduced.addEventListener?.("change", bind);
    finePointer.addEventListener?.("change", bind);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", reset);
      reduced.removeEventListener?.("change", bind);
      finePointer.removeEventListener?.("change", bind);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero wrap hero--redesign"
      aria-labelledby="hero-title"
    >
      <div className="heroCopy">
        <div className="heroBadge reveal" style={{ "--reveal-delay": "0ms" }}>
          <span className="heroBadgeDot" aria-hidden="true" />
          Welcome to my portfolio
        </div>

        <h1
          id="hero-title"
          className="heroTitle reveal"
          style={{ "--reveal-delay": "80ms" }}
        >
          <span className="heroTitleFirst">{firstName}</span>{" "}
          <span className="heroTitleAccent">{familyName.join(" ")}</span>
        </h1>

        <p
          className="heroRoleRow reveal"
          style={{ "--reveal-delay": "160ms" }}
        >
          <span className="heroRolePrefix">I&apos;m a</span>
          <span className="heroTypeLine">
            <span className="heroType" aria-hidden="true">
              {typedRole}
            </span>
            <span className="heroCaret" aria-hidden="true" />
            <span className="srOnly">{profile.role}</span>
          </span>
        </p>

        <p
          className="heroTagline reveal"
          style={{ "--reveal-delay": "220ms" }}
        >
          {profile.tagline}
        </p>

        <p className="heroLead reveal" style={{ "--reveal-delay": "280ms" }}>
          I have hands-on experience in React, Node.js, Express.js and MongoDB,
          and I build responsive web applications, REST APIs and real-world
          full-stack projects with a focus on clean, practical solutions.
        </p>

        <div className="heroCtaRow reveal" style={{ "--reveal-delay": "350ms" }}>
          <button
            type="button"
            className="heroBtn heroBtn--primary"
            onClick={() => onNavigate?.("projects")}
          >
            View My Work
            <ArrowUpRight aria-hidden="true" />
          </button>

          <a
            className="heroBtn heroBtn--secondary"
            href={`mailto:${profile.email}`}
          >
            Let&apos;s Connect
            <Mail aria-hidden="true" />
          </a>
        </div>

        <div className="heroLinks reveal" style={{ "--reveal-delay": "420ms" }}>
          <span className="heroAvailability">
            <i aria-hidden="true" />
            {profile.availability}
          </span>
        </div>
      </div>

      <div className="heroVisual reveal" style={{ "--reveal-delay": "260ms" }}>
        <HeroVisual />
      </div>

      <button
        type="button"
        className="heroScroll"
        onClick={() => onNavigate?.("about")}
        aria-label="Scroll to About section"
      >
        <span className="heroScrollLabel">Scroll to explore</span>
        <span className="heroScrollTrack" aria-hidden="true">
          <span className="heroScrollDot" />
        </span>
      </button>
    </section>
  );
}
