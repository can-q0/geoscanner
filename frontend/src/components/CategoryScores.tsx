"use client";

import { useEffect, useState } from "react";

interface CategoryScoresProps {
  scores: {
    citability: number;
    brand: number;
    content_eeat: number;
    technical: number;
    schema: number;
    platform: number;
  };
}

const categories = [
  { key: "citability", label: "AI Citability", weight: "25%" },
  { key: "brand", label: "Brand Authority", weight: "20%" },
  { key: "content_eeat", label: "Content E-E-A-T", weight: "20%" },
  { key: "technical", label: "Technical SEO", weight: "15%" },
  { key: "schema", label: "Schema & Data", weight: "10%" },
  { key: "platform", label: "Platform Opt.", weight: "10%" },
] as const;

function getBarColor(score: number): string {
  if (score >= 80) return "var(--accent)";
  if (score >= 60) return "var(--score-blue, #3b82f6)";
  if (score >= 40) return "var(--warning)";
  return "var(--danger)";
}

export default function CategoryScores({ scores }: CategoryScoresProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      {categories.map(({ key, label, weight }, i) => {
        const score = scores[key] ?? 0;
        const color = getBarColor(score);
        return (
          <div key={key} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {label}
              </span>
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color }}>
                  {score}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  {weight}
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${score}%` : '0%',
                  background: color,
                  boxShadow: `0 0 12px ${color}60`,
                  transitionDelay: `${i * 0.1}s`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
