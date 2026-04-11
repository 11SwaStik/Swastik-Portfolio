"use client";
import { useBootSequence } from "@/lib/hooks/useBootSequence";
import { sound } from "@/lib/sound";
import MatrixRain from "./MatrixRain";

export default function BootScreen() {
  const { state, progress, logs, startBoot, shouldSkip } = useBootSequence();

  if (shouldSkip || state === "hidden") return null;

  const handleLoad = () => {
    sound.enable();
    sound.playBoot();
    startBoot();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono overflow-hidden transition-opacity duration-[650ms] ease-in-out ${
        state === "complete" ? "opacity-0 pointer-events-none" : ""
      }`}
    >
      <MatrixRain running={state === "loading" || state === "complete"} />

      {/* Scanlines */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
        }}
      />

      {/* Corner logo */}
      <div className="absolute top-5 left-5 z-[4] opacity-55">
        <svg
          width="36"
          height="36"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="SWK logo"
        >
          <defs>
            <filter id="ig">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="igg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff87" />
              <stop offset="55%" stopColor="#5df2ff" />
              <stop offset="100%" stopColor="#c38bff" />
            </linearGradient>
          </defs>
          <polygon
            points="50,4 90,27 90,73 50,96 10,73 10,27"
            fill="none"
            stroke="url(#igg)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            opacity="0.5"
          />
          <g
            filter="url(#ig)"
            stroke="url(#igg)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <polygon points="22,30 38,22 50,30 38,38" opacity="0.8" />
            <path d="M50,30 L78,22 L64,50 L78,78 L50,70 L22,78 L36,50 L22,30" />
            <circle cx="50" cy="50" r="5" fill="url(#igg)" stroke="none" opacity="0.9" />
            <line x1="50" y1="40" x2="50" y2="44" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="56" x2="50" y2="60" strokeWidth="2" opacity="0.6" />
            <line x1="40" y1="50" x2="44" y2="50" strokeWidth="2" opacity="0.6" />
            <line x1="56" y1="50" x2="60" y2="50" strokeWidth="2" opacity="0.6" />
          </g>
          <g stroke="#00ff87" strokeWidth="1.5" fill="none" opacity="0.35">
            <polyline points="14,20 14,14 20,14" />
            <polyline points="80,14 86,14 86,20" />
            <polyline points="86,80 86,86 80,86" />
            <polyline points="20,86 14,86 14,80" />
          </g>
        </svg>
      </div>

      {/* System ID */}
      <div className="absolute top-4 right-5 z-[4] text-[0.6rem] text-cyan opacity-45 tracking-[0.12em]">
        NODE://KIRMADA-01 <span className="text-green">&#9679;</span>
      </div>

      {/* Main content */}
      <div className="relative z-[3] text-center px-6">
        {state === "idle" && (
          <>
            <div className="text-[clamp(3rem,10vw,7rem)] font-black tracking-[0.35em] text-white [text-shadow:0_0_20px_#00ff87,0_0_60px_rgba(0,255,135,0.2),0_0_2px_#fff] mb-1 animate-[intro-flicker_5s_ease-in-out_infinite]">
              WELCOME
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.85rem)] text-green tracking-[0.5em] opacity-70 mb-12 uppercase">
              // SECURE TERMINAL DETECTED //
            </div>
            <button
              onClick={handleLoad}
              className="bg-transparent border border-green text-green font-mono text-[clamp(0.8rem,2.5vw,0.95rem)] tracking-[0.35em] py-3.5 px-10 cursor-pointer uppercase shadow-[0_0_18px_rgba(0,255,135,0.2),inset_0_0_18px_rgba(0,255,135,0.04)] transition-all duration-200 hover:bg-green/10 hover:shadow-[0_0_30px_rgba(0,255,135,0.45),inset_0_0_20px_rgba(0,255,135,0.12)] hover:text-white"
              data-hover
            >
              &#9654; LOAD SYSTEM
            </button>
          </>
        )}

        {(state === "loading" || state === "complete") && (
          <div className="w-[min(420px,80vw)] mx-auto">
            <div className="text-[clamp(0.65rem,2vw,0.85rem)] text-green tracking-[0.5em] opacity-70 mb-8 uppercase">
              // INITIALISING SYSTEM //
            </div>
            <div className="flex justify-between text-[0.67rem] text-green opacity-70 mb-1.5 tracking-[0.1em]">
              <span>LOADING PORTFOLIO...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-green/10 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green via-cyan to-violet shadow-[0_0_12px_rgba(0,255,135,0.8)] rounded-sm transition-[width] duration-[50ms] linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-5 text-left text-[clamp(0.6rem,1.5vw,0.7rem)] text-green opacity-80 min-h-[8rem]">
              {logs.map((log, i) => (
                <span
                  key={i}
                  className={`block mb-0.5 animate-[log-in_0.2s_ease] ${
                    log.includes("READY")
                      ? "text-cyan [text-shadow:0_0_6px_#5df2ff]"
                      : ""
                  }`}
                >
                  {log}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 z-[4] text-[0.56rem] text-green opacity-30 tracking-[0.1em]">
        <span>SYS::SWASTIK_PORTFOLIO_v2</span>
        <span>ENC::AES-256 &#9679; AUTH::VERIFIED</span>
        <span>PWR::NOMINAL</span>
      </div>
    </div>
  );
}
