"use client";
import { useEffect, useRef } from "react";
import ScrollReveal from "@/components/effects/ScrollReveal";

interface SecretProps {
  visible: boolean;
}

export default function Secret({ visible }: SecretProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (visible && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <section ref={ref} id="secret" className="text-center py-20 px-6 md:px-16">
      <ScrollReveal>
        <div className="max-w-[580px] mx-auto border border-border-2 p-12 relative">
          <span className="absolute -top-2 left-6 text-[0.53rem] text-green bg-bg px-2 tracking-[3px]">
            // ROOT ACCESS
          </span>
          <h3 className="font-sans text-[1.3rem] font-extrabold text-green tracking-[3px] mb-4">
            ROOT ACCESS ACHIEVED
          </h3>
          <p className="text-[0.73rem] text-text-muted leading-[2.3]">
            Five flags. Cleared.
            <br />
            <br />
            You didn&apos;t skip. You actually solved them.
            <br />
            <strong className="text-text">kirmada respects that.</strong>
            <br />
            <br />
            Let&apos;s build something together.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
