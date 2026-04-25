"use client";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { useState } from "react";

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
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="SWK logo"
        >
          <defs>
            <filter id="swk-glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="swk-g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff87" />
              <stop offset="55%" stopColor="#5df2ff" />
              <stop offset="100%" stopColor="#c38bff" />
            </linearGradient>
          </defs>
          <polygon
            points="50,4 90,27 90,73 50,96 10,73 10,27"
            fill="none"
            stroke="url(#swk-g)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            opacity="0.45"
          />
          <g
            filter="url(#swk-glow)"
            stroke="url(#swk-g)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <polygon points="22,30 38,22 50,30 38,38" opacity="0.8" />
            <path d="M50,30 L78,22 L64,50 L78,78 L50,70 L22,78 L36,50 L22,30" />
            <circle cx="50" cy="50" r="5" fill="url(#swk-g)" stroke="none" opacity="0.9" />
            <line x1="50" y1="40" x2="50" y2="44" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="56" x2="50" y2="60" strokeWidth="2" opacity="0.6" />
            <line x1="40" y1="50" x2="44" y2="50" strokeWidth="2" opacity="0.6" />
            <line x1="56" y1="50" x2="60" y2="50" strokeWidth="2" opacity="0.6" />
          </g>
          <g stroke="#00ff87" strokeWidth="1.5" fill="none" opacity="0.35">
            <polyline points="14,20 14,14 20,14" />
            <polyline points="80,14 86,14 86,20" />
            <polyline points="86,80 86,86 80,86" />
            <polyline points="20,86 14,86 14,80" />
          </g>
        </svg>
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
