import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Stats from "./components/Stats";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useActiveSection } from "./hooks/useActiveSection";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useTheme } from "./hooks/useTheme";
import { marqueeItems, navLinks } from "./data/site";
import SmokeyCursor from "./components/lightswind/smokey-cursor";

const SECTION_IDS = navLinks.map((link) => link.id);

export default function App() {
  const { dark, toggleTheme } = useTheme();
  const active = useActiveSection(SECTION_IDS);

  useRevealOnScroll();
  useScrollProgress();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SmokeyCursor
        simulationResolution={128}
        dyeResolution={1024}
        densityDissipation={3.5}
        velocityDissipation={2}
        pressure={0.1}
        pressureIterations={20}
        curl={3}
        splatRadius={0.2}
        splatForce={4000}
        enableShading={true}
        colorUpdateSpeed={5}
        transparent={true}
        intensity={0.85}
      />

      <a className="skip-link" href="#home">
        Skip to content
      </a>

      <ScrollProgress />

      <Navbar
        dark={dark}
        onToggleTheme={toggleTheme}
        active={active}
        onNavigate={scrollTo}
      />

      <main id="home">
        <Hero onNavigate={scrollTo} />
        <Marquee items={marqueeItems} />
        <Stats />

        <About />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  );
}