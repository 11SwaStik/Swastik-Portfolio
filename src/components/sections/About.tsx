"use client";
import SectionHeader from "@/components/ui/SectionHeader";
import TerminalBox from "@/components/ui/TerminalBox";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { KeyValue, TerminalLine } from "@/data/types";

interface AboutProps {
  paragraphs: string[];
  keyValues: KeyValue[];
  terminalLines: TerminalLine[];
}

export default function About({ paragraphs, keyValues, terminalLines }: AboutProps) {
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
              <div className="mt-8">
                {keyValues.map((kv) => (
                  <div
                    key={kv.key}
                    className="flex border-b border-border py-2.5 text-[0.7rem]"
                  >
                    <span className="text-green w-[110px] shrink-0 tracking-[1px]">
                      {kv.key}
                    </span>
                    <span className={kv.highlight ? "text-green" : "text-text"}>
                      {kv.value}
                    </span>
                  </div>
                ))}
              </div>
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
