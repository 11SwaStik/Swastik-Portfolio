"use client";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import ProjectDetailPanel from "@/components/ui/ProjectDetailPanel";
import SystemLoader from "@/components/ui/SystemLoader";
import type { Project } from "@/data/types";

interface ProjectsProps {
  projects: Project[];
}

const LOADER_MS = 240;

export default function Projects({ projects }: ProjectsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  const handleOpen = (id: string) => {
    if (selectedId || loadingId) return;
    setLoadingId(id);
    setTimeout(() => {
      setSelectedId(id);
      setLoadingId(null);
    }, LOADER_MS);
  };

  return (
    <section id="projects" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="03" title="PROJECTS" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex flex-col">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onClick={() => handleOpen(project.id)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {loadingId && <SystemLoader />}
      {selected && (
        <ProjectDetailPanel
          project={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}

function ProjectRow({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const firstMetric = project.metrics[0];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left border-t border-border last:border-b py-7 md:py-8 cursor-pointer transition-colors hover:bg-bg/40"
      data-hover
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="text-[0.6rem] text-text-dim font-mono tracking-[2px]">
              {project.number}
            </span>
            <h3 className="font-sans text-[1.25rem] md:text-[1.45rem] font-bold text-white group-hover:text-green transition-colors leading-tight">
              {project.name}
            </h3>
            {firstMetric && (
              <span className="text-[0.58rem] text-green tracking-[2px] font-mono">
                {firstMetric.value}
              </span>
            )}
          </div>
          <p className="text-[0.8rem] md:text-[0.86rem] text-text-muted leading-[1.7] mb-3 max-w-[680px]">
            {project.impact}
          </p>
          <div className="text-[0.6rem] text-text-dim font-mono tracking-[1px]">
            {project.chips.join("  ·  ")}
          </div>
        </div>
        <span className="text-text-dim group-hover:text-green transition-colors text-base shrink-0 mt-1">
          →
        </span>
      </div>
    </button>
  );
}
