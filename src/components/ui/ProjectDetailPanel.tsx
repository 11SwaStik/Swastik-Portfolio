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

/**
 * Slide-over detail panel for a single project. Mounts when a project
 * is selected, slides in from the right with a dimmed backdrop.
 * Closing animates out before unmount via an internal `exiting` state.
 *
 * Closes on: backdrop click, X button, Escape key.
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
    // Trigger enter transition after first paint.
    const raf = requestAnimationFrame(() => setEntered(true));
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);

    // Prevent the page from scrolling under the panel.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose]);

  const visible = entered && !exiting;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        aria-hidden
        className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px] transition-opacity ease-out"
        style={{
          transitionDuration: `${ANIM_MS}ms`,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
        className="fixed top-0 right-0 bottom-0 w-full md:w-[560px] bg-bg border-l border-border-2 z-[101] transition-transform ease-out overflow-y-auto"
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

        {/* Body */}
        <div className="p-6 md:p-8 pb-12">
          <div className="text-[0.6rem] text-text-dim font-mono tracking-[2px] mb-2">
            {project.number}
          </div>
          <h2 className="font-sans text-[1.6rem] md:text-[1.9rem] font-extrabold text-white tracking-tight leading-tight mb-3">
            {project.name}
          </h2>
          <p className="text-[0.85rem] text-text-muted leading-[1.7] mb-7">
            {project.impact}
          </p>

          {project.metric && (
            <div className="border-t border-b border-border-2 py-4 mb-8 flex items-baseline justify-between gap-4">
              <span className="text-[0.55rem] text-text-dim font-mono tracking-[2.5px]">
                {project.metric.label}
              </span>
              <span className="font-sans text-[1.2rem] md:text-[1.4rem] font-bold text-green tabular-nums text-right">
                {project.metric.value}
              </span>
            </div>
          )}

          <Section title="TECH STACK">
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

          <Section title="DETAILS">
            <p className="text-[0.78rem] text-text-muted leading-[1.85]">
              {project.description}
            </p>
          </Section>

          {(project.url || project.repoUrl) && (
            <div className="flex gap-2 flex-wrap mt-8 pt-6 border-t border-border-2">
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
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <h3 className="text-[0.55rem] text-green font-mono tracking-[3px] mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
