interface CarretaWheelProps {
  className?: string;
  size?: number;
  animated?: boolean;
  variant?: "full" | "outline" | "pattern";
}

export default function CarretaWheel({
  className = "",
  size = 120,
  animated = false,
  variant = "full",
}: CarretaWheelProps) {
  const center = size / 2;
  const radius = size * 0.42;
  const hubRadius = size * 0.08;
  const spokeCount = 12;
  const angleStep = (2 * Math.PI) / spokeCount;

  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x1 = center + hubRadius * Math.cos(angle);
    const y1 = center + hubRadius * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    return { x1, y1, x2, y2, angle: i * (360 / spokeCount) };
  });

  // Decorative inner ring pattern (mandala-like)
  const innerDots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 8;
    const r = radius * 0.55;
    const cx = center + r * Math.cos(angle);
    const cy = center + r * Math.sin(angle);
    return { cx, cy };
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`${className}${animated ? " animate-spin-slow" : ""}`}
      width={size}
      height={size}
      aria-label="Carreta wheel"
      role="img"
    >
      <defs>
        <style>
          {animated
            ? `
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .wheel-spin { animation: spin-slow 20s linear infinite; transform-origin: center; }
            .wheel-spin-reverse { animation: spin-slow 25s linear infinite reverse; transform-origin: center; }
          `
            : ""}
        </style>
      </defs>

      <g className={animated ? "wheel-spin" : ""}>
        {/* Outer rim */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#CC2936"
          strokeWidth={size * 0.03}
        />

        {/* Inner rim */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.85}
          fill="none"
          stroke="#FFD700"
          strokeWidth={size * 0.015}
          strokeDasharray={`${size * 0.02} ${size * 0.015}`}
        />

        {/* Outer decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.72}
          fill="none"
          stroke="#005ABB"
          strokeWidth={size * 0.012}
        />

        {/* Spokes */}
        {spokes.map((spoke, i) => (
          <line
            key={`spoke-${i}`}
            x1={spoke.x1}
            y1={spoke.y1}
            x2={spoke.x2}
            y2={spoke.y2}
            stroke={i % 3 === 0 ? "#CC2936" : i % 3 === 1 ? "#005ABB" : "#FF7F00"}
            strokeWidth={size * 0.022}
            strokeLinecap="round"
          />
        ))}

        {/* Hub */}
        <circle
          cx={center}
          cy={center}
          r={hubRadius}
          fill="#FFD700"
          stroke="#CC2936"
          strokeWidth={size * 0.02}
        />

        {/* Hub center dot */}
        <circle cx={center} cy={center} r={hubRadius * 0.35} fill="#CC2936" />
      </g>

      {/* Inner mandala dots */}
      <g className={animated ? "wheel-spin-reverse" : ""}>
        {innerDots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.cx}
            cy={dot.cy}
            r={size * 0.028}
            fill={i % 2 === 0 ? "#FFD700" : "#00CED1"}
            opacity={variant === "outline" ? 0.4 : 0.7}
          />
        ))}
      </g>
    </svg>
  );
}

export function CarretaWheelPattern({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Repeating carreta wheel pattern as a decorative background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='%23CC2936' stroke-width='3'/%3E%3Cline x1='60' y1='12' x2='60' y2='108' stroke='%23005ABB' stroke-width='2'/%3E%3Cline x1='12' y1='60' x2='108' y2='60' stroke='%23005ABB' stroke-width='2'/%3E%3Cline x1='26' y1='26' x2='94' y2='94' stroke='%23FF7F00' stroke-width='2'/%3E%3Cline x1='26' y1='94' x2='94' y2='26' stroke='%23FF7F00' stroke-width='2'/%3E%3Ccircle cx='60' cy='60' r='8' fill='%23FFD700' stroke='%23CC2936' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>
    </div>
  );
}
