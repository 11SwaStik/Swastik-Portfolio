import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { DevSecOpsGroup } from "@/data/types";

interface DevSecOpsProps {
  intro: string;
  groups: DevSecOpsGroup[];
}

export default function DevSecOps({ intro, groups }: DevSecOpsProps) {
  return (
    <section id="devsecops" className="py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="04" title="DEVSECOPS" />
        </ScrollReveal>

        <ScrollReveal>
          <p className="font-sans text-base text-text-muted leading-[1.9] max-w-[760px] mb-14">
            {intro}
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {groups.map((group) => (
              <div
                key={group.title}
                className="bg-bg p-8 transition-colors duration-200 hover:bg-surface"
              >
                <div className="text-[0.58rem] text-green tracking-[4px] mb-5">
                  {group.title}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[0.78rem] text-text-muted leading-[1.7]"
                    >
                      <span className="text-green/70 shrink-0 leading-[1.55]">
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
