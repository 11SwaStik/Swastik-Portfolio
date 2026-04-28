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
  const featured = projects.find((p) => p.type === "FLAGSHIP") ?? projects[0];
  const rest = projects.filter((p) => p.id !== featured.id);

  const toggle = (id: string) =>
    setExpandedId((curr) => (curr === id ? null : id));

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

        {/* Featured (flagship) module — full width with side-by-side layout */}
        <ScrollReveal>
          <FeaturedModule
            project={featured}
            expanded={expandedId === featured.id}
            onToggle={() => toggle(featured.id)}
          />
        </ScrollReveal>

        {/* 2-column grid of remaining modules */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mt-px">
            {rest.map((project) => (
              <ProjectModule
                key={project.id}
                project={project}
                expanded={expandedId === project.id}
                onToggle={() => toggle(project.id)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface ModuleProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}

function FeaturedModule({ project, expanded, onToggle }: ModuleProps) {
  return (
    <article className="group bg-bg border border-border-2 hover:border-green/60 transition-colors relative">
      {/* Corner marker — small touch that says "this is the featured one" */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 p-7 md:p-9">
        {/* Left — status + name + impact + chips + expand */}
        <div className="flex flex-col">
          <ModuleHeader project={project} flagshipTag />
          <h3 className="font-sans text-[1.4rem] md:text-[1.7rem] font-extrabold text-white tracking-wide uppercase mt-4 mb-3">
            {project.name}
          </h3>
          <p className="text-[0.85rem] text-text-muted leading-[1.7] mb-5 max-w-[460px]">
            {project.impact}
          </p>
          <Chips chips={project.chips} />
          <ExpandToggle
            id={project.id}
            expanded={expanded}
            onToggle={onToggle}
          />
        </div>

        {/* Right — featured metric display */}
        {project.metric && (
          <div className="flex lg:flex-col justify-between lg:justify-center items-center lg:items-start gap-4 lg:gap-2 lg:border-l lg:border-border-2 lg:pl-8 py-2">
            <div className="text-[0.55rem] font-mono text-text-dim tracking-[3px]">
              {project.metric.label}
            </div>
            <div
              className="font-sans text-[2rem] md:text-[2.6rem] font-extrabold text-green leading-none tabular-nums"
              style={{ textShadow: "0 0 24px rgba(0, 255, 135, 0.35)" }}
            >
              {project.metric.value}
            </div>
            <div className="text-[0.55rem] font-mono text-text-dim tracking-[2px]">
              ↳ College Project Showcase
            </div>
          </div>
        )}
      </div>

      <div className={`px-7 md:px-9 ${expanded ? "pb-6" : ""}`}>
        <ExpandedPanel id={project.id} project={project} expanded={expanded} />
      </div>
    </article>
  );
}

function ProjectModule({ project, expanded, onToggle }: ModuleProps) {
  return (
    <article className="bg-bg p-6 md:p-7 transition-colors hover:bg-surface/60 flex flex-col relative group">
      <ModuleHeader project={project} />
      <h3 className="font-sans text-[1.05rem] md:text-[1.15rem] font-extrabold text-white tracking-wide uppercase mt-3 mb-2">
        {project.name}
      </h3>
      <p className="text-[0.72rem] text-text-muted leading-[1.7] mb-5">
        {project.impact}
      </p>

      {project.metric && (
        <div className="py-4 border-t border-b border-border-2 mb-5">
          <div className="text-[0.55rem] font-mono text-text-dim tracking-[2.5px] mb-1">
            {project.metric.label}
          </div>
          <div
            className="font-sans text-[1.45rem] font-extrabold text-green leading-none tabular-nums"
            style={{ textShadow: "0 0 16px rgba(0, 255, 135, 0.3)" }}
          >
            {project.metric.value}
          </div>
        </div>
      )}

      <Chips chips={project.chips} />
      <ExpandToggle id={project.id} expanded={expanded} onToggle={onToggle} />
      <ExpandedPanel id={project.id} project={project} expanded={expanded} />
    </article>
  );
}

function ModuleHeader({
  project,
  flagshipTag = false,
}: {
  project: Project;
  flagshipTag?: boolean;
}) {
  return (
    <div className="flex items-center justify-between font-mono text-[0.55rem] tracking-[2px]">
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
        {flagshipTag && (
          <>
            <span className="text-text-dim">·</span>
            <span className="text-green border border-green/50 px-1.5 py-0.5 leading-none">
              FLAGSHIP
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-text-dim">MOD-{project.number}</span>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="text-text-muted hover:text-green transition-colors"
            aria-label={`Open ${project.name} demo`}
            data-hover
          >
            ↗
          </a>
        )}
      </div>
    </div>
  );
}

function Chips({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-5">
      {chips.map((chip) => (
        <span
          key={chip}
          className="text-[0.55rem] py-0.5 px-2 border border-border-2 text-text-dim tracking-[0.5px] font-mono"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

function ExpandToggle({
  id,
  expanded,
  onToggle,
}: {
  id: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="self-start text-[0.55rem] text-green tracking-[2.5px] font-mono cursor-pointer hover:text-white transition-colors mt-auto"
      aria-expanded={expanded}
      aria-controls={`details-${id}`}
      data-hover
    >
      {expanded ? "▴ COLLAPSE" : "▾ READ MORE"}
    </button>
  );
}

function ExpandedPanel({
  id,
  project,
  expanded,
}: {
  id: string;
  project: Project;
  expanded: boolean;
}) {
  // Padding is the parent's responsibility — this only manages the
  // smooth height transition via grid-template-rows.
  return (
    <div
      id={`details-${id}`}
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        expanded ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className="border-t border-border-2 pt-4">
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
    </div>
  );
}
