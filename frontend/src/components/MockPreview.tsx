"use client";

import { useEffect, useRef, useState } from "react";

const categories = [
  { name: "AI Citability", score: 81 },
  { name: "Brand Authority", score: 45 },
  { name: "Content E-E-A-T", score: 78 },
  { name: "Technical", score: 92 },
  { name: "Schema & Data", score: 64 },
  { name: "Platform Opt.", score: 58 },
];

export default function MockPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const target = 73;
    const duration = 1800;
    const start = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  const circumference = 2 * Math.PI * 52;
  const dasharray = visible
    ? `${(73 / 100) * circumference} ${circumference}`
    : `0 ${circumference}`;

  return (
    <div ref={ref} className="relative">
      {/* Glow behind card */}
      <div className="absolute -inset-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, var(--accent-dim), transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative glass-card rounded-2xl p-6 sm:p-8 overflow-hidden">
        {/* Scan sweep effect */}
        <div className="absolute h-[1px] w-[40%] pointer-events-none"
          style={{ top: '25%', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'sweep-x 4s ease-in-out infinite 1s' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SCAN RESULT</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>techstartup.io</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>COMPLETE</span>
          </div>
        </div>

        {/* Score + Bars */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Circular gauge */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="5" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#previewGradient)" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={dasharray}
                style={{ transition: 'stroke-dasharray 2s cubic-bezier(0.16, 1, 0.3, 1)', filter: 'drop-shadow(0 0 8px var(--accent-dim))' }}
              />
              <defs>
                <linearGradient id="previewGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-bright)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', color: 'var(--accent)', lineHeight: 1 }}>
                {displayScore}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '2px' }}>/100</span>
            </div>
          </div>

          {/* Category bars */}
          <div className="flex-1 w-full space-y-3">
            {categories.map((cat, i) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>{cat.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: cat.score >= 70 ? 'var(--accent)' : 'var(--warning)', fontWeight: 600 }}>
                    {visible ? cat.score : 0}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="h-full rounded-full"
                    style={{
                      width: visible ? `${cat.score}%` : '0%',
                      background: cat.score >= 70
                        ? 'linear-gradient(90deg, var(--accent), var(--accent-bright))'
                        : 'linear-gradient(90deg, var(--warning), var(--warning-light, #ffbe76))',
                      transition: `width 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.12}s`,
                      boxShadow: cat.score >= 70 ? '0 0 8px var(--accent-dim)' : '0 0 8px var(--warning-glow, rgba(255, 165, 2, 0.25))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom teaser */}
        <div className="relative text-center mt-8 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            + AI REWRITE SUGGESTIONS &middot; SCHEMA CODE &middot; 30-DAY ACTION PLAN &middot; PDF REPORT
          </span>
        </div>
      </div>
    </div>
  );
}
