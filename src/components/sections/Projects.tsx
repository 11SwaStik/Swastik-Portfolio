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
          <div className="flex flex-col gap-px bg-border">
            {projects.map((project) => (
              <div
                key={project.id}
                className="prow bg-bg grid grid-cols-1 md:grid-cols-[70px_1fr_auto] items-center gap-4 md:gap-8 p-6 md:p-8 transition-colors duration-200 cursor-default relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0 before:bg-green before:transition-[width] before:duration-300 hover:bg-surface hover:before:w-0.5"
                data-hover
              >
                <div className="text-[0.58rem] text-text-dim tracking-[2px]">
                  {project.number} —
                </div>
                <div>
                  <div className="font-sans text-[1.05rem] font-bold text-white mb-1">
                    {project.name}
                    {project.badge && (
                      <span className="text-[0.6rem] text-green tracking-[2px] ml-2.5">
                        {project.badge === "LIVE" ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green no-underline"
                          >
                            LIVE \u2197
                          </a>
                        ) : (
                          `\uD83C\uDFC6 ${project.badge}`
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-[0.7rem] text-text-muted leading-[1.7]">
                    {project.description}
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2.5">
                    {project.chips.map((chip) => (
                      <span
                        key={chip}
                        className="text-[0.56rem] py-0.5 px-2 border border-border-2 text-text-dim"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:text-right shrink-0">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline"
                    >
                      <span className="text-[0.56rem] text-green tracking-[2px] block mb-1">
                        {project.type}
                      </span>
                      <span className="text-[0.85rem] text-text-dim transition-colors duration-200 hover:text-green">
                        \u2197
                      </span>
                    </a>
                  ) : (
                    <>
                      <span className="text-[0.56rem] text-green tracking-[2px] block mb-1">
                        {project.type}
                      </span>
                      <span className="text-[0.85rem] text-text-dim">\u2197</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
