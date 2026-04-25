"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import InteractiveGlobe from "@/components/effects/InteractiveGlobe";

export default function Hero() {
  const nameRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.7, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        actionsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        globeRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=0.8"
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.5"
      );
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center px-6 md:px-16 relative overflow-hidden"
    >
      <div className="relative z-[1] w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        {/* Left: Text content */}
        <div className="max-w-[600px] flex-shrink-0">
          <h1>
            <span
              ref={nameRef}
              className="block font-sans text-[clamp(3rem,7vw,6.5rem)] font-extrabold tracking-tight leading-none text-white opacity-0"
            >
              SWASTIK SHARMA
            </span>
            <span
              ref={taglineRef}
              className="block text-[clamp(0.85rem,1.6vw,1rem)] font-normal tracking-[0.4em] text-green font-mono mt-4 italic opacity-0"
            >
              &ldquo;Root access to my sanity.&rdquo;
            </span>
          </h1>
          <div
            ref={actionsRef}
            className="flex items-center gap-6 mt-10 flex-wrap opacity-0"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="text-[0.66rem] tracking-[3px] py-3 px-8 cursor-pointer transition-all duration-200 font-mono border-none bg-green text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,255,135,0.2)]"
              data-hover
            >
              SEE THE WORK
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="text-[0.66rem] tracking-[3px] py-3 px-8 cursor-pointer transition-all duration-200 font-mono bg-transparent border border-border-2 text-text-muted hover:border-green hover:text-green"
              data-hover
            >
              WHO IS THIS
            </button>
          </div>
        </div>

        {/* Right: Interactive Globe */}
        <div
          ref={globeRef}
          className="w-full max-w-[360px] lg:max-w-[440px] opacity-0"
        >
          <InteractiveGlobe />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-10 left-6 md:left-16 flex items-center gap-3 text-[0.58rem] text-text-dim tracking-[3px] z-[1] opacity-0"
      >
        <div className="w-10 h-px bg-gradient-to-r from-green to-transparent" />
        SCROLL
      </div>
    </section>
  );
}
