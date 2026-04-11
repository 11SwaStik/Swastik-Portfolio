"use client";
import { useEffect, useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ThreatMonitor from "@/components/ui/ThreatMonitor";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { DevSecOpsSkill, Threat } from "@/data/types";

interface DevSecOpsProps {
  skills: DevSecOpsSkill[];
  description: string[];
  threats: Threat[];
}

function SkillBar({ skill }: { skill: DevSecOpsSkill }) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && fillRef.current) {
          fillRef.current.style.width = `${skill.percentage}%`;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (fillRef.current?.parentElement) {
      observer.observe(fillRef.current.parentElement);
    }

    return () => observer.disconnect();
  }, [skill.percentage]);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border text-[0.66rem]">
      <span className="text-text-muted">{skill.name}</span>
      <div className="flex-1 h-0.5 bg-border-2 mx-4 overflow-hidden">
        <div
          ref={fillRef}
          className="h-full bg-green transition-[width] duration-[1.2s] ease-out"
          style={{ width: 0 }}
        />
      </div>
      <span className="text-[0.58rem] text-green min-w-[28px] text-right">
        {skill.percentage}%
      </span>
    </div>
  );
}

export default function DevSecOps({ skills, description, threats }: DevSecOpsProps) {
  return (
    <section id="devsecops" className="py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="04" title="DEVSECOPS" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              {description.map((p, i) => (
                <p
                  key={i}
                  className="font-sans text-base text-text-muted leading-[1.9] mb-4 font-normal"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
              <div className="mt-6">
                {skills.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
            <div>
              <ThreatMonitor threats={threats} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
