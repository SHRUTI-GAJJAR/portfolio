import { Github, Linkedin } from "lucide-react";
import { profile } from "../data/site";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Designed &amp; built with React</span>

        <div>
          <a
            href="https://github.com/SHRUTI-GAJJAR"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
          >
            <Github />
          </a>

          <a
            href="https://www.linkedin.com/in/shruti-ujeniya-4620b132b/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
          >
            <Linkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}