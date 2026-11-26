import { aboutTags } from "../data/site";
import BlurText from "./reactbits/BlurText";
import ScrollReveal from "./reactbits/ScrollReveal";
import SplitText from "./reactbits/SplitText";

const HEADING_FIRST_LINE = "Developer with a";
const HEADING_SECOND_LINE = "builder's mindset.";

const ABOUT_LEDE =
  "I'm a Full-Stack Developer who enjoys turning ideas into practical, user-focused web applications. I work across the frontend and backend, building responsive React interfaces, REST APIs and database-driven applications.";

const ABOUT_DETAILS =
  "I have hands-on experience with React, Node.js, Express.js and MongoDB through personal and full-stack projects. I'm currently looking for an internship or entry-level Full-Stack / MERN opportunity where I can contribute, learn from experienced developers and grow as a software engineer.";

// One shared, cinematic entrance for both heading lines (the drop-caps stay in
// the markup so the serif italic and the explicit line break are untouched).
const headingAnimation = {
  splitType: "words",
  textAlign: "left",
  delay: 90,
  duration: 0.9,
  from: { opacity: 0, y: 12 },
  to: { opacity: 1, y: 0 },
  trigger: "view",
  threshold: 0.1,
  rootMargin: "-100px",
  staggerFrom: "start",
};

export default function About() {
  return (
    <section id="about" className="section wrap about">
      <p className="sectionlabel reveal">01 / ABOUT</p>

      <div className="two">
        <div className="reveal">
          <h2>
            <SplitText
              {...headingAnimation}
              text={HEADING_FIRST_LINE}
              tag="span"
            />
            <br />
            <SplitText
              {...headingAnimation}
              text={HEADING_SECOND_LINE}
              tag="em"
            />
          </h2>
        </div>

        <div className="reveal" style={{ "--reveal-delay": "110ms" }}>
          <BlurText
            text={ABOUT_LEDE}
            className="aboutBlurText"
            animateBy="words"
            direction="top"
            effect="blur"
            delay={55}
            stepDuration={0.5}
            blur={8}
            distance={14}
            threshold={0.1}
            rootMargin="0px"
            trigger="view"
            staggerFrom="start"
          />

          <ScrollReveal
            tag="p"
            mode="enter"
            effect="fade"
            enableBlur
            blurStrength={4}
            baseOpacity={0.08}
            baseOffset={6}
            baseRotation={0}
            stagger={0.06}
            duration={1.1}
            splitBy="words"
          >
            {ABOUT_DETAILS}
          </ScrollReveal>
        </div>

        <ul className="mini reveal" style={{ "--reveal-delay": "180ms" }}>
          {aboutTags.map((tag, index) => (
            <li
              key={tag}
              className="miniItem"
              style={{ "--skill-index": index }}
            >
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
