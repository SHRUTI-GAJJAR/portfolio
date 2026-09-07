import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {Github,Linkedin,Mail,ArrowUpRight,Download,Menu,X,Code2,Server,Database,ExternalLink,Sun,Moon} from "lucide-react";
import "./styles.css";

const projects = [

  {
    title: "Task Tracker",
    tag: "Full-Stack Web App",
    desc: "A responsive task management application with CRUD operations, task status management, form validation and a REST API backed by MongoDB.",
    tech: ["React", "Vite", "Node.js", "Express", "MongoDB"],
    icon: "✓",
    live: "https://task-tracker-orpin-six-64.vercel.app",
    code: "https://github.com/SHRUTI-GAJJAR/Task_Tracker"
  },

  {
    title: "Socially",
    tag: "Full-Stack Social Platform",
    desc: "A social media web application where users can authenticate, create and interact with posts through a responsive full-stack interface.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    icon: "◉",
    live: "https://3-w-social-post-app-alpha.vercel.app",
    code: "https://github.com/SHRUTI-GAJJAR/3W-Social-Post-App"
  },

  {
    title: "Order Processing",
    tag: "Backend Order Management",
    desc: "A full-stack order processing application designed to manage products, customer orders and order-related workflows through a structured web interface.",
    tech: ["Node.js", "Express", "MongoDB"],
    icon: "▣",
    live: "https://order-processing-app-nedk.onrender.com/api-docs/",
    code: "https://github.com/SHRUTI-GAJJAR/Order-processing-app"
  },

  {
    title: "Resolve AI",
    tag: "Backend AI Processing",
    desc: "An AI-powered application focused on processing user input and providing intelligent responses through a modern full-stack interface.",
    tech: ["Node.js", "Express", "AI"],
    icon: "✦",
    live: "https://resolve-ai-backend.onrender.com/api-docs/",
    code: "https://github.com/SHRUTI-GAJJAR/resolve-ai-backend"
  }

];

function App(){
 const [dark,setDark]=useState(true),[open,setOpen]=useState(false);
useEffect(() => {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}, [dark]);
 const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setOpen(false)};
 return <div>
  <nav className="nav"><div className="wrap navin"><button className="logo" onClick={()=>go("home")}>Shruti<span>.</span></button>
   <div className={"links "+(open?"show":"")}><button onClick={()=>go("home")}>Home</button><button onClick={()=>go("about")}>About</button><button onClick={()=>go("projects")}>Projects</button><button onClick={()=>go("skills")}>Skills</button><button onClick={()=>go("contact")}>Contact</button></div>
   <div className="navactions"><button className="iconbtn" onClick={()=>setDark(!dark)} aria-label="theme">{dark?<Sun/>:<Moon/>}</button><button className="menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
  </div></nav>

  <main id="home">
   <section className="hero wrap">
    <div className="heroText">

  <div className="eyebrow">
    <i></i> Open to Full-Stack / MERN Opportunities
  </div>

  <h1>
    Full-Stack<br />
    <em>Developer</em> building<br />
    practical web solutions.
  </h1>

  <p className="lead">
    Hi, I'm <b>Shruti Ujeniya</b> — a Full-Stack Developer with hands-on
    experience in React, Node.js, Express.js and MongoDB. I build
    responsive web applications, REST APIs and real-world full-stack
    projects with a focus on clean, practical solutions.
  </p>

  <div className="buttons">
    <button
      className="primary"
      onClick={() => go("projects")}
    >
      View my work <ArrowUpRight />
    </button>

    <a
      className="secondary"
      href="mailto:shrutiujeniya6@gmail.com"
    >
      Let's connect <Mail />
    </a>
  </div>

  <div className="socials">
    <a
      href="https://github.com/SHRUTI-GAJJAR"
      target="_blank"
      rel="noreferrer"
    >
      <Github /> GitHub
    </a>

    <a
      href="https://www.linkedin.com/in/shruti-ujeniya-4620b132b/"
      target="_blank"
      rel="noreferrer"
    >
      <Linkedin /> LinkedIn
    </a>
  </div>

</div>
    <div className="heroVisual"><div className="orb"></div><div className="codecard"><div className="dots"><i></i><i></i><i></i></div><pre>{`const developer = {
  name: "Shruti Ujeniya",
  role: "Full-Stack Developer",
  stack: ["React", "Node", "MongoDB","PHP","MySQL"],
  strengths: ["REST APIs", "CRUD", "Authentication"],
  focus: "Building real-world apps",
  mindset: "Build • Learn • Improve"
};`}</pre><div className="status">● Open to internship opportunities</div></div></div>
   </section>

<section className="stats wrap">
  <div>
    <strong>03+</strong>
    <span>Featured projects</span>
  </div>

  <div>
    <strong>MERN</strong>
    <span>Primary stack</span>
  </div>

  <div>
    <strong>REST</strong>
    <span>API development</span>
  </div>

  <div>
    <strong>2+</strong>
    <span>Years self-learning</span>
  </div>
</section>

<section id="about" className="section wrap about">

  <div className="sectionlabel">01 / ABOUT</div>

  <div className="two">

    <div>
      <h2>
        Developer with a<br />
        <em>builder's mindset.</em>
      </h2>
    </div>

    <div>

      <p>
        I'm a Full-Stack Developer who enjoys turning ideas into
        practical, user-focused web applications. I work across
        the frontend and backend, building responsive React
        interfaces, REST APIs and database-driven applications.
      </p>

      <p>
        I have hands-on experience with React, Node.js, Express.js
        and MongoDB through personal and full-stack projects. I'm
        currently looking for an internship or entry-level
        Full-Stack / MERN opportunity where I can contribute,
        learn from experienced developers and grow as a software
        engineer.
      </p>

      <div className="mini">
        <span>React & Vite</span>
        <span>Node & Express</span>
        <span>MongoDB</span>
        <span>REST APIs</span>
        <span>Git & GitHub</span>
      </div>

    </div>

  </div>

</section>
   <section id="projects" className="section wrap"><div className="sectionlabel">04 / SELECTED WORK</div><div className="sectionhead"><h2>Things I've <em>built.</em></h2><p>Real projects, practical features and hands-on full-stack development.</p></div>
    <div className="grid">{projects.map((p,i)=><article className={"project "+(i===0?"featured":"")} key={p.title}><div className="projecttop"><span className="projecticon">{p.icon}</span><span>{p.tag}</span></div><h3>{p.title}</h3><p>{p.desc}</p><div className="chips">{p.tech.map(x=><span key={x}>{x}</span>)}</div><div className="projectlinks">

  <a
    href={p.live}
    target="_blank"
    rel="noreferrer"
  >
    Live demo <ArrowUpRight />
  </a>

  <a
    href={p.code}
    target="_blank"
    rel="noreferrer"
  >
    Source <Github />
  </a>

</div></article>)}</div>
   </section>

   <section id="skills" className="section wrap">

  <div className="sectionlabel">03 / TOOLKIT</div>

  <div className="skillgrid">

    <div className="skill">
      <Code2 />
      <h3>Frontend</h3>
      <p>
        HTML · CSS · JavaScript · React.js · Vite · Bootstrap
      </p>
    </div>

    <div className="skill">
      <Server />
      <h3>Backend</h3>
      <p>
        Node.js · Express.js · REST APIs · JWT Authentication · Multer
      </p>
    </div>

    <div className="skill">
      <Database />
      <h3>Database</h3>
      <p>
        MongoDB · Mongoose · MongoDB Atlas · MySQL
      </p>
    </div>

    <div className="skill">
      <ExternalLink />
      <h3>Tools & Deployment</h3>
      <p>
        Git · GitHub · Postman · Vercel · Render · VS Code
      </p>
    </div>

  </div>

</section>

   <section className="cta wrap" id="contact"><div><div className="sectionlabel">04 / CONTACT</div><h2>Let's build something<br/><em>meaningful.</em></h2><p>I'm open to Full-Stack, MERN and Software Development internship opportunities.</p></div><div className="ctabtns"><a className="primary" href="mailto:shrutiujeniya6@gmail.com">Email me <Mail/></a><a className="secondary" href="/Shruti_Ujeniya_Resume-2026.pdf" download>Download resume <Download/></a></div></section>
  </main>
  <footer><div className="wrap foot"><span>© 2026 Shruti Ujeniya</span><span>Designed & built with React</span><div><a href="https://github.com/SHRUTI-GAJJAR"><Github/></a><a href="https://www.linkedin.com/in/shruti-ujeniya-4620b132b/"><Linkedin/></a></div></div></footer>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);