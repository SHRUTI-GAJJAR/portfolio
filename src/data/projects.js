/**
 * Featured projects.
 *
 * The first entry is rendered full-width as the featured card, so put the
 * strongest project first.
 */
export const projects = [
  {
    title: "ArchFlow AI",
    tag: "AI-Powered Full-Stack Platform",
    desc: "An AI-powered platform designed to help teams organize project information, communication, and insights in one place through a modern full-stack interface.",
    tech: ["React", "Node.js", "Express", "MongoDB", "AI"],
    icon: "✦",
    live: "https://arch-flow-ai-eosin.vercel.app/",
    code: "https://github.com/SHRUTI-GAJJAR/ArchFlow-AI",
  },
  {
    title: "Socially",
    tag: "Full-Stack Social Platform",
    desc: "A social media web application where users can authenticate, create and interact with posts through a responsive full-stack interface.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    icon: "◉",
    live: "https://3-w-social-post-app-alpha.vercel.app",
    code: "https://github.com/SHRUTI-GAJJAR/3W-Social-Post-App",
  },
  {
    title: "DIGITAL HEROES",
    tag: "Full-Stack Web App",
    desc: "Built a full-stack web application for managing charity donations, monthly draws, entries, winners, and user accounts with a responsive, professional interface.",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Supabase"],
    icon: "❤",
    live: "https://digital-heroes-ashy-five.vercel.app/",
    code: "https://github.com/SHRUTI-GAJJAR/digital-heroes",
  },
  {
    title: "Order Processing",
    tag: "Backend Order Management",
    desc: "A Backend order processing application designed to manage products, customer orders and order-related workflows through a structured web interface.",
    tech: ["Node.js", "Express", "MongoDB"],
    icon: "▣",
    live: "https://order-processing-app-nedk.onrender.com/api-docs/",
    code: "https://github.com/SHRUTI-GAJJAR/Order-processing-app",
  },
  {
    title: "Resolve AI",
    tag: "Backend AI Processing",
    desc: "An AI-powered application focused on processing user input and providing intelligent responses through a modern full-stack interface.",
    tech: ["Node.js", "Express", "AI"],
    icon: "✦",
    live: "https://resolve-ai-backend.onrender.com/api-docs/",
    code: "https://github.com/SHRUTI-GAJJAR/resolve-ai-backend",
  },
];

/**
 * Technology groups rendered in the Toolkit section.
 * Icons are attached in the Skills component to keep this file data-only.
 */
export const skillGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React.js", "Vite", "Bootstrap"],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "JWT Authentication",
      "Multer",
    ],
  },
  {
    title: "Database",
    items: ["MongoDB", "Mongoose", "MongoDB Atlas", "MySQL"],
  },
  {
    title: "Tools & Deployment",
    items: ["Git", "GitHub", "Postman", "Vercel", "Render", "VS Code"],
  },
];