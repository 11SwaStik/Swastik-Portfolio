interface LogoProps {
  size?: number;
  className?: string;
  /** Unique gradient id — required if rendering more than one Logo on the same page */
  gradientId?: string;
}

export default function Logo({
  size = 32,
  className,
  gradientId = "logo-grad",
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff87" />
          <stop offset="55%" stopColor="#5df2ff" />
          <stop offset="100%" stopColor="#c38bff" />
        </linearGradient>
      </defs>

      {/* Outer hexagonal frame */}
      <polygon
        points="50,8 86,29 86,71 50,92 14,71 14,29"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        opacity="0.55"
      />

      {/* Inner echo hexagon */}
      <polygon
        points="50,24 70,36 70,64 50,76 30,64 30,36"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.7"
        opacity="0.25"
      />

      {/* Cardinal triangle markers pointing inward toward the bindu */}
      <path d="M50,30 L46.5,38 L53.5,38 Z" fill={`url(#${gradientId})`} opacity="0.85" />
      <path d="M70,50 L62,46.5 L62,53.5 Z" fill={`url(#${gradientId})`} opacity="0.85" />
      <path d="M50,70 L46.5,62 L53.5,62 Z" fill={`url(#${gradientId})`} opacity="0.85" />
      <path d="M30,50 L38,46.5 L38,53.5 Z" fill={`url(#${gradientId})`} opacity="0.85" />

      {/* Subtle ring around the central bindu */}
      <circle
        cx="50"
        cy="50"
        r="6.5"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.7"
        opacity="0.45"
      />

      {/* Bindu — the still point */}
      <circle cx="50" cy="50" r="3" fill={`url(#${gradientId})`} />
    </svg>
  );
}
