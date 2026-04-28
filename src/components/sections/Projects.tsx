import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { Project } from "@/data/types";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="03" title="PROJECTS" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex flex-col">
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const isLink = Boolean(project.url);
  const sharedClass =
    "group block border-t border-border last:border-b py-7 md:py-8 transition-colors";

  const content = (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3 flex-wrap mb-2">
          <span className="text-[0.6rem] text-text-dim font-mono tracking-[2px]">
            {project.number}
          </span>
          <h3 className="font-sans text-[1.25rem] md:text-[1.45rem] font-bold text-white group-hover:text-green transition-colors leading-tight">
            {project.name}
          </h3>
          {project.metric && (
            <span className="text-[0.58rem] text-green tracking-[2px] font-mono">
              {project.metric.value}
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
      {isLink && (
        <span className="text-text-dim group-hover:text-green transition-colors text-base shrink-0 mt-1">
          ↗
        </span>
      )}
    </div>
  );

  if (isLink) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className={sharedClass}
        data-hover
      >
        {content}
      </a>
    );
  }
  return <div className={sharedClass}>{content}</div>;
}
