"use client";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { Certification } from "@/data/types";

interface CertificationsProps {
  items: Certification[];
}

export default function Certifications({ items }: CertificationsProps) {
  return (
    <section id="certifications" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="05" title="CERTIFICATIONS" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {items.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

interface CertCardProps {
  cert: Certification;
}

const TILT_MAX_DEG = 5; // Subtle — anything bigger feels gimmicky.

function CertCard({ cert }: CertCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  // Mouse-tracked tilt + lift. Refs + direct style writes so this
  // doesn't trigger React re-renders during pointer movement.
  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${
      -py * TILT_MAX_DEG
    }deg) rotateY(${px * TILT_MAX_DEG}deg) translateY(-2px)`;
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  const cardClass =
    "group cert-card relative bg-bg p-7 md:p-8 cursor-pointer block will-change-transform";

  const inner = (
    <>
      <div className="flex items-center justify-between mb-6 font-mono text-[0.55rem] tracking-[2.5px]">
        <span className="flex items-center gap-1.5 text-green">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_infinite]" />
          VERIFIED
        </span>
        <span className="text-cyan">{cert.category}</span>
      </div>

      <h3 className="font-sans text-[1.05rem] md:text-[1.15rem] font-extrabold text-white tracking-tight leading-snug mb-4 group-hover:text-green transition-colors">
        {cert.name}
      </h3>

      <div className="flex items-baseline justify-between text-[0.7rem] mb-3">
        <span className="text-text-muted">{cert.issuer}</span>
        <span className="text-text-dim font-mono tabular-nums">{cert.year}</span>
      </div>

      {cert.credentialId && (
        <div className="pt-3 border-t border-border-2 text-[0.55rem] text-text-dim font-mono tracking-[2px]">
          ID · {cert.credentialId}
        </div>
      )}
    </>
  );

  if (cert.url) {
    return (
      <a
        ref={cardRef as React.RefObject<HTMLAnchorElement>}
        href={cert.url}
        target="_blank"
        rel="noreferrer"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={cardClass}
        data-hover
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cardClass}
    >
      {inner}
    </div>
  );
}
