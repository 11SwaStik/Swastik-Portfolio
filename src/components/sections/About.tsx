"use client";
import SectionHeader from "@/components/ui/SectionHeader";
import TerminalBox from "@/components/ui/TerminalBox";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { TerminalLine } from "@/data/types";

interface AboutProps {
  paragraphs: string[];
  terminalLines: TerminalLine[];
}

export default function About({ paragraphs, terminalLines }: AboutProps) {
  return (
    <section id="about" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="01" title="ABOUT" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`font-sans text-base text-text-muted leading-[1.9] mb-4 font-normal ${
                    i === paragraphs.length - 1
                      ? "text-text-muted text-[0.82rem] leading-[1.8]"
                      : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </div>
            <div>
              <TerminalBox lines={terminalLines} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
