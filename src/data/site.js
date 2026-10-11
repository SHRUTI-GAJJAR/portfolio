import { Github, Linkedin, Mail } from "lucide-react";

/**
 * Global site metadata, used for both the UI and the document head.
 */
export const profile = {
  name: "Shruti Ujeniya",
  shortName: "Shruti",
  role: "Full-Stack Developer",
  tagline: "Full-Stack Developer building practical web solutions.",
  email: "shrutiujeniya6@gmail.com",
  resume: "/Shruti_Ujeniya_Resume-2026.pdf",
  availability: "Open to Full-Stack / MERN Opportunities",
  statusLine: "Open to internship opportunities",
};

/**
 * Single source of truth for the primary navigation.
 * `id` must match a section id rendered in the page.
 */
export const navLinks = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Certificates", id: "certifications" },
  { label: "Contact", id: "contact" },
];

/**
 * External profile links, rendered in the hero and the footer.
 */
export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/SHRUTI-GAJJAR",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shruti-ujeniya-4620b132b/",
    Icon: Linkedin,
  },
];

/**
 * Trust strip under the hero. `value` is intentionally short so it stays
 * readable at every breakpoint. Numeric values animate up on scroll — see
 * useCountUp.
 */
export const stats = [
  { value: 5, suffix: "+", label: "Featured projects" },
  { value: "MERN", label: "Primary stack" },
  { value: "REST", label: "API development" },
  { value: 2, suffix: "+", label: "Years self-learning" },
];

/**
 * Scrolling strip below the hero. Rendered twice for a seamless loop.
 */
export const marqueeItems = [
  "React",
  "Vite",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "MySQL",
  "PostgreSQL",
  "Supabase",
  "JavaScript",
  "HTML",
  "CSS",
  "Git",
  "GitHub",
  "Postman",
  "Vercel",
  "Render",
  "JWT Auth",
  "REST APIs",
  "Multer",
];

/**
 * Short stack pills shown in the About section.
 */
export const aboutTags = [
  "React & Vite",
  "Node & Express",
  "MongoDB",
  "REST APIs",
  "Git & GitHub",
];

/**
 * Decorative "code card" content lives in src/components/CodeCard.jsx so it
 * can be syntax highlighted rather than rendered as a flat string.
 */