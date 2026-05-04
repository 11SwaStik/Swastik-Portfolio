"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project, ProjectStatus } from "@/data/types";

const STATUS_COLOR: Record<ProjectStatus, string> = {
  ACTIVE: "text-green",
  LIVE: "text-green",
  STABLE: "text-cyan",
  TESTING: "text-yellow",
  ARCHIVED: "text-text-dim",
};

const STATUS_DOT: Record<ProjectStatus, string> = {
  ACTIVE: "bg-green animate-[pulse-dot_2s_infinite]",
  LIVE: "bg-green",
  STABLE: "bg-cyan",
  TESTING: "bg-yellow",
  ARCHIVED: "bg-text-dim",
};

interface ProjectDetailPanelProps {
  project: Project;
  onClose: () => void;
}

const ANIM_MS = 300;
const STAGGER_MS = 55;

/**
 * Slide-over detail panel for a project module. Slides in from the
 * right with a dimmed/blurred backdrop, content reveals in staggered
 * waves so the eye lands on each section in sequence. Closes on
 * backdrop click, X button, or Escape.
 */
export default function ProjectDetailPanel({
  project,
  onClose,
}: ProjectDetailPanelProps) {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setExiting((curr) => {
      if (curr) return curr;
      setTimeout(onClose, ANIM_MS);
      return true;
    });
  }, [onClose]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose]);

  const visible = entered && !exiting;

  // Stagger helper — index of the content block determines its delay.
  const staggerStyle = (i: number): React.CSSProperties => ({
    animation: `boot-fade-up 350ms ${ANIM_MS + i * STAGGER_MS}ms ease-out both`,
  });

  return (
    <>
      <div
        onClick={handleClose}
        aria-hidden
        className="fixed inset-0 z-[1010] bg-black/55 backdrop-blur-[2px] transition-opacity ease-out"
        style={{
          transitionDuration: `${ANIM_MS}ms`,
          opacity: visible ? 1 : 0,
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
        className="fixed top-0 right-0 bottom-0 w-full md:w-[580px] bg-bg border-l border-border-2 z-[1020] transition-transform ease-out overflow-y-auto"
        style={{
          transitionDuration: `${ANIM_MS}ms`,
          transform: visible ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Sticky status bar */}
        <div className="sticky top-0 bg-bg/95 backdrop-blur-sm border-b border-border-2 px-6 py-4 flex items-center justify-between font-mono text-[0.55rem] tracking-[2px] z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`flex items-center gap-1.5 ${STATUS_COLOR[project.status]}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`}
              />
              {project.status}
            </span>
            <span className="text-text-dim">·</span>
            <span className="text-text-dim truncate">{project.type}</span>
          </div>
          <button
            ref={closeBtnRef}
            onClick={handleClose}
            aria-label="Close project details"
            className="text-text-dim hover:text-green transition-colors text-base leading-none w-7 h-7 flex items-center justify-center"
            data-hover
          >
            ✕
          </button>
        </div>

        {/* Body — each block staggers in after the panel slide */}
        <div className="p-6 md:p-8 pb-12">
          <div style={staggerStyle(0)}>
            <div className="text-[0.6rem] text-text-dim font-mono tracking-[2px] mb-2">
              {project.number}
            </div>
            <h2 className="font-sans text-[1.6rem] md:text-[1.9rem] font-extrabold text-white tracking-tight leading-tight mb-3">
              {project.name}
            </h2>
          </div>

          <p
            style={staggerStyle(1)}
            className="text-[0.85rem] text-text-muted leading-[1.7] mb-7"
          >
            {project.impact}
          </p>

          {project.metrics.length > 0 && (
            <div
              style={staggerStyle(2)}
              className={`grid gap-px bg-border-2 mb-8 ${
                project.metrics.length > 1 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-bg p-4">
                  <div className="text-[0.5rem] text-text-dim font-mono tracking-[2.5px] mb-1.5">
                    {m.label}
                  </div>
                  <div className="font-sans text-[1.05rem] md:text-[1.15rem] font-bold text-green tabular-nums">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Section title="DESCRIPTION" style={staggerStyle(3)}>
            <p className="text-[0.78rem] text-text-muted leading-[1.85]">
              {project.description}
            </p>
          </Section>

          <Section title="TECH STACK" style={staggerStyle(4)}>
            <div className="flex flex-wrap gap-2">
              {project.chips.map((chip) => (
                <span
                  key={chip}
                  className="text-[0.6rem] py-1 px-3 border border-border-2 text-text-dim tracking-[0.5px] font-mono"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Section>

          {project.details.length > 0 && (
            <Section title="DETAILS" style={staggerStyle(5)}>
              <ul className="flex flex-col gap-2.5">
                {project.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2.5 text-[0.78rem] text-text-muted leading-[1.7]"
                  >
                    <span className="text-green/70 shrink-0 mt-1.5 leading-none">▸</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {(project.url || project.repoUrl) && (
            <div
              style={staggerStyle(6)}
              className="flex gap-2 flex-wrap mt-8 pt-6 border-t border-border-2"
            >
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.6rem] py-2 px-4 border border-green text-green tracking-[2px] font-mono hover:bg-green hover:text-black transition-colors"
                  data-hover
                >
                  DEMO ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.6rem] py-2 px-4 border border-border-2 text-text-muted tracking-[2px] font-mono hover:border-green hover:text-green transition-colors"
                  data-hover
                >
                  REPO ↗
                </a>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function Section({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="mb-7" style={style}>
      <h3 className="text-[0.55rem] text-green font-mono tracking-[3px] mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
