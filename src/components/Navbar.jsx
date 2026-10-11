import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { navLinks, profile } from "../data/site";

/**
 * Fixed glassmorphic navbar.
 *
 * @param {object}   props
 * @param {boolean}  props.dark           current theme
 * @param {Function} props.onToggleTheme
 * @param {string}   props.active         id of the section currently in view
 * @param {Function} props.onNavigate     called with a section id
 */
export default function Navbar({ dark, onToggleTheme, active, onNavigate }) {
  const [open, setOpen] = useState(false);

  // Reset the mobile menu if the viewport grows back to desktop, otherwise it
  // stays open behind the desktop nav.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 801px)");
    const onChange = () => setOpen(false);

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Escape closes the menu for keyboard users.
  useEffect(() => {
    if (!open) return;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navigate = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <nav className="nav" aria-label="Primary">
      <div className="wrap navin">
        <button
          className="logo"
          onClick={() => navigate("home")}
          aria-label={`${profile.name} — back to top`}
        >
          {profile.shortName}
          <span>.</span>
        </button>

        <div
          id="primary-menu"
          className={`links ${open ? "show" : ""}`}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(event) => {
                event.preventDefault();
                navigate(link.id);
              }}
              className={active === link.id ? "active" : undefined}
              aria-current={active === link.id ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="navactions">
          <button
            className="iconbtn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
            title={`Switch to ${dark ? "light" : "dark"} theme`}
          >
            {dark ? <Sun /> : <Moon />}
          </button>

          <button
            className="menu"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="primary-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
}