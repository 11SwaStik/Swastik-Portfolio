"use client";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { Project, ProjectStatus } from "@/data/types";

interface ProjectsProps {
  projects: Project[];
}

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

export default function Projects({ projects }: ProjectsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="projects" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="03" title="PROJECTS" />
        </ScrollReveal>

        {/* Dashboard status bar */}
        <ScrollReveal>
          <div className="flex items-center justify-between px-5 py-3 bg-bg border border-border-2 mb-px font-mono text-[0.58rem] tracking-[2px]">
            <div className="flex items-center gap-5">
              <span className="text-text-dim">{"// SYSTEM MODULES"}</span>
              <span className="text-text-dim hidden sm:inline">UPTIME 99.97%</span>
            </div>
            <div className="flex items-center gap-2 text-green">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_infinite]" />
              {projects.length}/{projects.length} ONLINE
            </div>
          </div>
        </ScrollReveal>

        {/* Module grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {projects.map((project) => (
              <ProjectModule
                key={project.id}
                project={project}
                expanded={expandedId === project.id}
                onToggle={() =>
                  setExpandedId((curr) => (curr === project.id ? null : project.id))
                }
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface ProjectModuleProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}

function ProjectModule({ project, expanded, onToggle }: ProjectModuleProps) {
  const stopAndOpen = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <article className="bg-bg p-6 md:p-7 transition-colors hover:bg-surface/40 flex flex-col">
      {/* Top row: status + type + number + external link */}
      <div className="flex items-center justify-between font-mono text-[0.55rem] tracking-[2px] mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex items-center gap-1.5 ${STATUS_COLOR[project.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
            {project.status}
          </span>
          <span className="text-text-dim">·</span>
          <span className="text-text-dim truncate">{project.type}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-text-dim">{project.number}</span>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={stopAndOpen}
              className="text-text-muted hover:text-green transition-colors"
              aria-label={`Open ${project.name} demo`}
              data-hover
            >
              ↗
            </a>
          )}
        </div>
      </div>

      {/* Module name + impact */}
      <h3 className="font-sans text-[1.05rem] md:text-[1.15rem] font-extrabold text-white tracking-wide uppercase mb-2">
        {project.name}
      </h3>
      <p className="text-[0.72rem] text-text-muted leading-[1.7] mb-5">
        {project.impact}
      </p>

      {/* Metric row */}
      {project.metric && (
        <div className="flex items-baseline justify-between py-3 border-t border-b border-border-2 mb-5 font-mono">
          <span className="text-[0.55rem] text-text-dim tracking-[2.5px]">
            {project.metric.label}
          </span>
          <span className="text-[0.85rem] text-green font-bold tabular-nums">
            {project.metric.value}
          </span>
        </div>
      )}

      {/* Tech stack chips */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.chips.map((chip) => (
          <span
            key={chip}
            className="text-[0.55rem] py-0.5 px-2 border border-border-2 text-text-dim tracking-[0.5px] font-mono"
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Expand toggle */}
      <button
        onClick={onToggle}
        className="self-start text-[0.55rem] text-green tracking-[2.5px] font-mono cursor-pointer hover:text-white transition-colors mt-auto"
        aria-expanded={expanded}
        aria-controls={`details-${project.id}`}
        data-hover
      >
        {expanded ? "▴ COLLAPSE" : "▾ DETAILS"}
      </button>

      {/* Expanded panel — grid-rows trick gives smooth height transition. */}
      <div
        id={`details-${project.id}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[0.72rem] text-text-muted leading-[1.85] pb-4">
            {project.description}
          </p>
          {(project.repoUrl || project.url) && (
            <div className="flex gap-2 flex-wrap">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={stopAndOpen}
                  className="text-[0.55rem] py-1.5 px-3 border border-green text-green tracking-[2px] font-mono hover:bg-green hover:text-black transition-colors"
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
                  onClick={stopAndOpen}
                  className="text-[0.55rem] py-1.5 px-3 border border-border-2 text-text-muted tracking-[2px] font-mono hover:border-green hover:text-green transition-colors"
                  data-hover
                >
                  REPO ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
