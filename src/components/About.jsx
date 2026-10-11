import { aboutTags } from "../data/site";

export default function About() {
  return (
    <section id="about" className="section wrap about">
      <p className="sectionlabel reveal">01 / ABOUT</p>

      <div className="two">
        <div className="reveal">
          <h2>
            Developer with a
            <br />
            <em>builder&apos;s mindset.</em>
          </h2>
        </div>

        <div className="reveal" style={{ "--reveal-delay": "110ms" }}>
          <p>
            I&apos;m a Full-Stack Developer who enjoys turning ideas into
            practical, user-focused web applications. I work across the frontend
            and backend, building responsive React interfaces, REST APIs and
            database-driven applications.
          </p>

          <p>
            I have hands-on experience with React, Node.js, Express.js and
            MongoDB through personal and full-stack projects. I&apos;m currently
            looking for an internship or entry-level Full-Stack / MERN
            opportunity where I can contribute, learn from experienced developers
            and grow as a software engineer.
          </p>

          <ul className="mini">
            {aboutTags.map((tag) => (
              <li key={tag}>
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}