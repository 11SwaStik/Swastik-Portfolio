"use client";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { DevSecOpsGroup } from "@/data/types";

interface DevSecOpsProps {
  groups: DevSecOpsGroup[];
}

export default function DevSecOps({ groups }: DevSecOpsProps) {
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);

  const toggle = (title: string) =>
    setExpandedTitle((curr) => (curr === title ? null : title));

  return (
    <section id="devsecops" className="py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="04" title="DEVSECOPS" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {groups.map((group) => (
              <PracticeBlock
                key={group.title}
                group={group}
                expanded={expandedTitle === group.title}
                anyExpanded={expandedTitle !== null}
                onToggle={() => toggle(group.title)}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface PracticeBlockProps {
  group: DevSecOpsGroup;
  expanded: boolean;
  anyExpanded: boolean;
  onToggle: () => void;
}

function PracticeBlock({
  group,
  expanded,
  anyExpanded,
  onToggle,
}: PracticeBlockProps) {
  const dimmed = anyExpanded && !expanded;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={`bg-bg p-8 text-left w-full transition-colors duration-200 hover:bg-surface cursor-pointer ${
        dimmed ? "opacity-55" : "opacity-100"
      }`}
      data-hover
    >
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="text-[0.58rem] text-green tracking-[4px]">
          {group.title}
        </div>
        <span
          aria-hidden
          className={`text-[0.7rem] font-mono leading-none transition-colors ${
            expanded ? "text-green" : "text-text-dim"
          }`}
        >
          {expanded ? "−" : "+"}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {group.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[0.78rem] text-text-muted leading-[1.7]"
          >
            <span className="text-green/70 shrink-0 leading-[1.55]">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Smooth expand via grid-template-rows trick — no max-height guess. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] mt-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border-2 pt-4">
            <div className="text-[0.55rem] text-green font-mono tracking-[3px] mb-2.5">
              WHY
            </div>
            <p className="text-[0.74rem] text-text-muted leading-[1.75]">
              {group.why}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
