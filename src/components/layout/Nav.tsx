"use client";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { useState } from "react";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "devsecops", label: "devsecops" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const active = useScrollSpy();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-[1000] flex justify-between items-center px-6 md:px-16 py-3.5 bg-bg/[0.93] backdrop-blur-2xl border-b border-border">
      {/* Logo */}
      <a
        href="#hero"
        className="flex items-center gap-2 no-underline group"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("hero");
        }}
      >
        <Logo size={28} gradientId="nav-logo-grad" />
        <span className="font-sans text-[0.82rem] font-extrabold tracking-[0.45em] text-white transition-colors duration-200 group-hover:text-green">
          KIRMADA
        </span>
      </a>

      {/* Desktop nav links */}
      <ul className="hidden md:flex gap-10 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => scrollTo(link.id)}
              className={`text-[0.66rem] tracking-[3px] transition-colors duration-200 bg-transparent border-none cursor-pointer font-mono ${
                active === link.id ? "text-green" : "text-text-muted hover:text-green"
              }`}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Status indicator */}
      <div className="hidden md:flex items-center gap-2.5 text-[0.58rem] text-text-dim">
        <div className="w-[5px] h-[5px] bg-green rounded-full animate-[pulse-dot_2s_infinite]" />
        ONLINE
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden bg-transparent border-none text-green text-xl cursor-pointer p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "\u2715" : "\u2630"}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-bg/95 backdrop-blur-2xl border-b border-border md:hidden">
          <ul className="list-none p-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className={`text-[0.75rem] tracking-[3px] bg-transparent border-none cursor-pointer font-mono w-full text-left ${
                    active === link.id ? "text-green" : "text-text-muted"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
