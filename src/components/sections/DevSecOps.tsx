"use client";
import { useEffect, useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { DevSecOpsSkill } from "@/data/types";

interface DevSecOpsProps {
  skills: DevSecOpsSkill[];
  description: string[];
}

function SkillBar({ skill }: { skill: DevSecOpsSkill }) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el?.parentElement) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.style.width = `${skill.percentage}%`;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [skill.percentage]);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border text-[0.7rem]">
      <span className="text-text-muted w-[180px] shrink-0">{skill.name}</span>
      <div className="flex-1 h-0.5 bg-border-2 mx-4 overflow-hidden">
        <div
          ref={fillRef}
          className="h-full bg-green transition-[width] duration-[1.2s] ease-out"
          style={{ width: 0 }}
        />
      </div>
      <span className="text-[0.6rem] text-green min-w-[36px] text-right">
        {skill.percentage}%
      </span>
    </div>
  );
}

export default function DevSecOps({ skills, description }: DevSecOpsProps) {
  return (
    <section id="devsecops" className="py-32 px-6 md:px-16">
      <div className="max-w-[820px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="04" title="DEVSECOPS" />
        </ScrollReveal>
        <ScrollReveal>
          <div>
            {description.map((p, i) => (
              <p
                key={i}
                className="font-sans text-base text-text-muted leading-[1.9] mb-4 font-normal"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
            <div className="mt-10">
              {skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
