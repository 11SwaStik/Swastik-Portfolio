"use client";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import HighlightModule from "@/components/ui/HighlightModule";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { SkillCategory, PipelineStage } from "@/data/types";

interface SkillsProps {
  categories: SkillCategory[];
  pipeline: PipelineStage[];
}

export default function Skills({ categories, pipeline }: SkillsProps) {
  const [pipelineTip, setPipelineTip] = useState("");

  return (
    <section id="skills" className="py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="02" title="ARSENAL" />
        </ScrollReveal>

        {/* Featured emerging-capability module above the regular grid */}
        <ScrollReveal>
          <div className="mb-px">
            <HighlightModule />
          </div>
        </ScrollReveal>

        {/* Skills grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-bg p-8 transition-colors duration-200 hover:bg-surface"
              >
                <div className="text-[0.58rem] text-green tracking-[4px] mb-4">
                  {cat.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag text-[0.63rem] py-1 px-3 border border-border-2 text-text-dim tracking-[0.5px] transition-all duration-200 cursor-default hover:border-green hover:text-green"
                      data-hover
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* DevSecOps Pipeline */}
        <ScrollReveal>
          <div className="mt-px bg-bg p-8">
            <div className="text-[0.58rem] text-green tracking-[4px] mb-5">
              DEVSECOPS PIPELINE — HOVER EACH STAGE
            </div>
            <div className="flex items-center flex-nowrap overflow-x-auto pb-2 gap-0 scrollbar-thin">
              {pipeline.map((stage, i) => (
                <div key={stage.id} className="contents">
                  <div
                    className={`pstage shrink-0 bg-surface border border-border-2 py-2.5 px-4 text-[0.6rem] tracking-[1px] text-text-muted transition-all duration-200 cursor-default relative hover:bg-green/[0.06] hover:border-green hover:text-green ${
                      stage.active
                        ? "bg-green/[0.06] border-green text-green before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-green"
                        : ""
                    }`}
                    data-hover
                    onMouseEnter={() => setPipelineTip("\u2192  " + stage.info)}
                    onMouseLeave={() => setPipelineTip("")}
                  >
                    {stage.label}
                  </div>
                  {i < pipeline.length - 1 && (
                    <span className="shrink-0 text-[0.65rem] text-text-dim px-1">
                      \u2192
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-[0.63rem] text-text-muted mt-3 min-h-[1.1rem] tracking-[0.5px]">
              {pipelineTip}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
