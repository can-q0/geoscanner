"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

function getColor(score: number): string {
  if (score >= 80) return "var(--accent)";
  if (score >= 60) return "var(--score-blue, #3b82f6)";
  if (score >= 40) return "var(--warning)";
  return "var(--danger)";
}

function getLabel(score: number): string {
  if (score >= 90) return "EXCELLENT";
  if (score >= 75) return "GOOD";
  if (score >= 60) return "FAIR";
  if (score >= 40) return "POOR";
  return "CRITICAL";
}

export default function ScoreGauge({ score, label, size = 200 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getColor(score);
  const displayLabel = label || getLabel(score);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer glow ring */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background rings */}
        <svg width={size} height={size} className="absolute inset-0 -rotate-90">
          {/* Faint tick marks */}
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = (i / 40) * 360;
            const rad = (angle * Math.PI) / 180;
            const inner = radius - 4;
            const outer = radius + 4;
            return (
              <line
                key={i}
                x1={size/2 + inner * Math.cos(rad)}
                y1={size/2 + inner * Math.sin(rad)}
                x2={size/2 + outer * Math.cos(rad)}
                y2={size/2 + outer * Math.sin(rad)}
                stroke="var(--border)"
                strokeWidth={i % 10 === 0 ? 1.5 : 0.5}
              />
            );
          })}
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--bg-elevated)" strokeWidth="6"
          />
          {/* Score arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)', filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: `${size * 0.22}px`, lineHeight: 1, color: 'var(--text-primary)',
          }}>
            {animatedScore}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '2px',
          }}>
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 px-4 py-1 rounded-full" style={{
        background: `${color}15`, border: `1px solid ${color}30`,
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        letterSpacing: '0.12em', color,
      }}>
        {displayLabel}
      </div>
    </div>
  );
}
