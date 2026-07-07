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

  // Radii — evenly stepped for perfect visual balance
  const R = {
    outerRim: size * 0.44,
    ring1: size * 0.37,
    ring2: size * 0.30,
    ring3: size * 0.23,
    dots: size * 0.19,
    hubOuter: size * 0.15,
    hubInner: size * 0.09,
    hubPin: size * 0.04,
  };

  const spokeCount = 12;
  const angleStep = (2 * Math.PI) / spokeCount;

  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x1 = center + R.hubOuter * Math.cos(angle);
    const y1 = center + R.hubOuter * Math.sin(angle);
    const x2 = center + R.outerRim * Math.cos(angle);
    const y2 = center + R.outerRim * Math.sin(angle);
    return { x1, y1, x2, y2 };
  });

  const innerDots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 8;
    const cx = center + R.dots * Math.cos(angle);
    const cy = center + R.dots * Math.sin(angle);
    return { cx, cy };
  });

  const spokeColor = (i: number) =>
    i % 3 === 0 ? "#CC2936" : i % 3 === 1 ? "#005ABB" : "#FF7F00";

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      width={size}
      height={size}
      aria-label={className.includes("no-label") ? undefined : "Carreta wheel"}
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
            .wheel-spin {
              animation: spin-slow 20s linear infinite;
              transform-box: fill-box;
              transform-origin: center;
            }
            .wheel-spin-reverse {
              animation: spin-slow 25s linear infinite reverse;
              transform-box: fill-box;
              transform-origin: center;
            }
          `
            : ""}
        </style>
      </defs>

      <g className={animated ? "wheel-spin" : ""}>
        {/* Outer rim — thick red ring */}
        <circle
          cx={center}
          cy={center}
          r={R.outerRim}
          fill="none"
          stroke="#CC2936"
          strokeWidth={size * 0.028}
        />

        {/* Ring 1 — dashed gold inner rim */}
        <circle
          cx={center}
          cy={center}
          r={R.ring1}
          fill="none"
          stroke="#FFD700"
          strokeWidth={size * 0.014}
          strokeDasharray={`${size * 0.025} ${size * 0.012}`}
        />

        {/* Ring 2 — blue decorative band */}
        <circle
          cx={center}
          cy={center}
          r={R.ring2}
          fill="none"
          stroke="#005ABB"
          strokeWidth={size * 0.012}
          opacity={variant === "outline" ? 0.5 : 1}
        />

        {/* Ring 3 — orange inner decorative band */}
        <circle
          cx={center}
          cy={center}
          r={R.ring3}
          fill="none"
          stroke="#FF7F00"
          strokeWidth={size * 0.010}
          opacity={variant === "outline" ? 0.4 : 0.85}
        />

        {/* Spokes — radiating from hub outer edge to outer rim */}
        {spokes.map((spoke, i) => (
          <line
            key={`spoke-${i}`}
            x1={spoke.x1}
            y1={spoke.y1}
            x2={spoke.x2}
            y2={spoke.y2}
            stroke={spokeColor(i)}
            strokeWidth={size * 0.020}
            strokeLinecap="round"
            opacity={variant === "outline" ? 0.6 : 1}
          />
        ))}

        {/* Hub outer ring — gold filled with red stroke */}
        <circle
          cx={center}
          cy={center}
          r={R.hubOuter}
          fill="#FFD700"
          stroke="#CC2936"
          strokeWidth={size * 0.018}
        />

        {/* Hub inner — red center */}
        <circle
          cx={center}
          cy={center}
          r={R.hubInner}
          fill="#CC2936"
          stroke="#FFD700"
          strokeWidth={size * 0.015}
        />

        {/* Hub pin — tiny gold dot */}
        <circle cx={center} cy={center} r={R.hubPin} fill="#FFD700" />
      </g>

      {/* Inner mandala dots */}
      <g className={animated ? "wheel-spin-reverse" : ""}>
        {innerDots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.cx}
            cy={dot.cy}
            r={size * 0.024}
            fill={i % 2 === 0 ? "#FFD700" : "#00CED1"}
            opacity={variant === "outline" ? 0.35 : 0.75}
          />
        ))}
      </g>
    </svg>
  );
}

export function CarretaWheelPattern({ className = "" }: { className?: string }) {
  // 6 lines through center at 30° intervals = 12 spokes, matching the main wheel
  // Lines at 0°, 30°, 60°, 90°, 120°, 150° with r=53 from center (60,60)
  // Colors cycle: red, blue, orange
  const svg = `<svg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='60' cy='60' r='53' fill='none' stroke='#CC2936' stroke-width='3.5'/>
    <circle cx='60' cy='60' r='44' fill='none' stroke='#FFD700' stroke-width='2' stroke-dasharray='3 1.5'/>
    <circle cx='60' cy='60' r='36' fill='none' stroke='#005ABB' stroke-width='1.5'/>
    <circle cx='60' cy='60' r='28' fill='none' stroke='#FF7F00' stroke-width='1.2'/>
    <line x1='7' y1='60' x2='113' y2='60' stroke='#CC2936' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='60' y1='7' x2='60' y2='113' stroke='#CC2936' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='14' y1='34' x2='106' y2='86' stroke='#005ABB' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='86' y1='14' x2='34' y2='106' stroke='#005ABB' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='34' y1='14' x2='86' y2='106' stroke='#FF7F00' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='106' y1='34' x2='14' y2='86' stroke='#FF7F00' stroke-width='2.5' stroke-linecap='round'/>
    <circle cx='60' cy='60' r='18' fill='#FFD700' stroke='#CC2936' stroke-width='2'/>
    <circle cx='60' cy='60' r='11' fill='#CC2936' stroke='#FFD700' stroke-width='1.5'/>
    <circle cx='60' cy='60' r='5' fill='#FFD700'/>
  </svg>`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>
    </div>
  );
}
