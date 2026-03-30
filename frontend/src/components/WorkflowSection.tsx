"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — SCAN VISUALIZATION
   A URL bar that auto-types, then a radar-like scan effect
   with data nodes appearing as signals are detected.
   ═══════════════════════════════════════════════════════════════ */

function ScanVisualization({ active }: { active: boolean }) {
  const [typedChars, setTypedChars] = useState(0);
  const [scanPhase, setScanPhase] = useState<"typing" | "scanning" | "done">("typing");
  const [signals, setSignals] = useState<{ x: number; y: number; label: string; delay: number }[]>([]);
  const url = "stripe.com";

  useEffect(() => {
    if (!active) {
      setTypedChars(0);
      setScanPhase("typing");
      setSignals([]);
      return;
    }

    // Phase 1: Type the URL
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTypedChars(i);
      if (i >= url.length) {
        clearInterval(typeInterval);
        setTimeout(() => setScanPhase("scanning"), 400);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [active]);

  useEffect(() => {
    if (scanPhase !== "scanning") return;

    const signalData = [
      { x: 25, y: 20, label: "robots.txt", delay: 0 },
      { x: 72, y: 15, label: "sitemap.xml", delay: 200 },
      { x: 15, y: 55, label: "JSON-LD", delay: 400 },
      { x: 80, y: 45, label: "meta tags", delay: 600 },
      { x: 45, y: 75, label: "headings", delay: 800 },
      { x: 60, y: 60, label: "SSR check", delay: 1000 },
      { x: 30, y: 40, label: "security", delay: 1200 },
      { x: 70, y: 78, label: "llms.txt", delay: 1400 },
    ];

    const timers: NodeJS.Timeout[] = [];
    signalData.forEach((s) => {
      const t = setTimeout(() => {
        setSignals((prev) => [...prev, s]);
      }, s.delay);
      timers.push(t);
    });

    const doneTimer = setTimeout(() => setScanPhase("done"), 2000);
    timers.push(doneTimer);

    return () => timers.forEach(clearTimeout);
  }, [scanPhase]);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#080c16', border: '1px solid rgba(255,255,255,0.04)', height: '440px' }}>
      {/* URL Bar */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <svg className="w-3 h-3 shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>https://</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-primary)' }}>
            {url.slice(0, typedChars)}
          </span>
          {scanPhase === "typing" && (
            <span className="inline-block w-0.5 h-3.5" style={{ background: 'var(--accent)', animation: 'pulse-glow 0.8s ease-in-out infinite' }} />
          )}
        </div>
        {scanPhase !== "typing" && (
          <div className="px-2.5 py-1 rounded-md" style={{
            background: scanPhase === "done" ? 'rgba(14,244,197,0.1)' : 'rgba(14,244,197,0.05)',
            border: `1px solid ${scanPhase === "done" ? 'rgba(14,244,197,0.2)' : 'rgba(14,244,197,0.1)'}`,
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--accent)',
            letterSpacing: '0.06em', transition: 'all 0.3s ease',
          }}>
            {scanPhase === "done" ? "DONE" : "SCANNING"}
          </div>
        )}
      </div>

      {/* Radar visualization */}
      <div className="relative flex-1" style={{ overflow: 'hidden' }}>
        {/* Radar rings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {[15, 25, 35].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(14,244,197,0.04)" strokeWidth="0.3" />
          ))}
          {/* Crosshairs */}
          <line x1="50" y1="15" x2="50" y2="85" stroke="rgba(14,244,197,0.03)" strokeWidth="0.2" />
          <line x1="15" y1="50" x2="85" y2="50" stroke="rgba(14,244,197,0.03)" strokeWidth="0.2" />

          {/* Sweep line */}
          {scanPhase === "scanning" && (
            <line x1="50" y1="50" x2="50" y2="15" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3"
              style={{ transformOrigin: '50px 50px', animation: 'radar-sweep 2s linear infinite' }} />
          )}

          {/* Center dot */}
          <circle cx="50" cy="50" r="1.5" fill="var(--accent)" opacity={scanPhase === "typing" ? 0.3 : 0.8} style={{ transition: 'opacity 0.5s' }} />
        </svg>

        {/* Signal nodes */}
        {signals.map((s, i) => (
          <div key={i} className="absolute flex items-center gap-1.5" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'fade-up 0.4s ease-out both',
          }}>
            {/* Ping ring */}
            <span className="absolute w-4 h-4 rounded-full" style={{
              background: 'var(--accent)',
              opacity: 0,
              animation: 'signal-ping 1s ease-out',
              left: '-2px', top: '-2px',
            }} />
            {/* Dot */}
            <span className="relative w-2 h-2 rounded-full" style={{
              background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent-dim)',
            }} />
            {/* Label */}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
              color: 'rgba(14,244,197,0.6)', letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            }}>
              {s.label}
            </span>
          </div>
        ))}

        {/* Signal count */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3" style={{
          opacity: signals.length > 0 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <div className="flex items-baseline gap-1">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)' }}>
              {signals.length}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
              / 8 SIGNALS
            </span>
          </div>
        </div>

        {/* Pages found */}
        {scanPhase === "done" && (
          <div className="absolute bottom-4 right-4" style={{ animation: 'fade-up 0.4s ease-out both' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
              47 pages indexed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — SCORE DASHBOARD
   Full dashboard mockup: gauge, category bars, platform matrix,
   and crawler status — feels like a real product screen.
   ═══════════════════════════════════════════════════════════════ */

function ScoreDashboard({ active }: { active: boolean }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [phase, setPhase] = useState(0);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<number | null>(null);
  const targetScore = 61;

  const categories = [
    { label: "AI Citability", value: 72, weight: "25%", color: "var(--accent)", tip: "How easily AI models can extract and quote your content blocks" },
    { label: "Brand Authority", value: 45, weight: "20%", color: "#f59e0b", tip: "Your presence on YouTube, Reddit, Wikipedia — 3x stronger than backlinks" },
    { label: "Content E-E-A-T", value: 68, weight: "20%", color: "#3b82f6", tip: "Experience, Expertise, Authoritativeness, Trustworthiness signals" },
    { label: "Technical", value: 81, weight: "15%", color: "var(--accent)", tip: "Server-side rendering, security headers, speed, crawler access" },
    { label: "Schema", value: 35, weight: "10%", color: "#ef4444", tip: "JSON-LD structured data — Organization, sameAs, speakable" },
    { label: "Platform Opt.", value: 52, weight: "10%", color: "#3b82f6", tip: "Per-engine optimization for ChatGPT, Gemini, Perplexity, AIO, Copilot" },
  ];

  const platforms = [
    { name: "Google AIO", score: 14, max: 20, tip: "Schema markup and topic authority boost needed" },
    { name: "ChatGPT", score: 8, max: 20, tip: "GPTBot blocked in robots.txt — completely invisible" },
    { name: "Perplexity", score: 12, max: 20, tip: "Content lacks self-contained 134–167 word passages" },
    { name: "Gemini", score: 13, max: 20, tip: "Missing sameAs links — Knowledge Graph can't verify entity" },
    { name: "Copilot", score: 5, max: 20, tip: "3.8s LCP, poor Core Web Vitals, no IndexNow" },
  ];

  const crawlers = [
    { name: "GPTBot", status: "blocked" },
    { name: "ClaudeBot", status: "allowed" },
    { name: "PerplexityBot", status: "allowed" },
    { name: "Google-Ext", status: "blocked" },
    { name: "Applebot", status: "allowed" },
    { name: "Bytespider", status: "blocked" },
    { name: "CCBot", status: "allowed" },
  ];

  useEffect(() => {
    if (!active) { setAnimatedScore(0); setPhase(0); return; }
    setPhase(1);
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setAnimatedScore(Math.round(targetScore * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => setPhase(4), 2400);
    return () => { cancelAnimationFrame(frame); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [active]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;
  const scoreColor = animatedScore >= 80 ? 'var(--accent)' : animatedScore >= 60 ? '#3b82f6' : animatedScore >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: '#080c16', border: '1px solid rgba(255,255,255,0.04)', height: '440px' }}>
      <div className="flex items-center justify-between px-5 py-2.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>ANALYSIS RESULTS</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.15)' }}>FAIR</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>stripe.com</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Row 1: Gauge + Categories */}
        <div className="flex gap-8 mb-6 flex-1">
          {/* Gauge — bigger */}
          <div className="shrink-0 relative flex flex-col items-center" style={{ width: '150px' }}>
            <div className="relative" style={{ width: '140px', height: '140px' }}>
              <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                {Array.from({ length: 40 }).map((_, i) => {
                  const a = (i / 40) * 360 * Math.PI / 180;
                  return <line key={i} x1={60 + 46 * Math.cos(a)} y1={60 + 46 * Math.sin(a)} x2={60 + 49 * Math.cos(a)} y2={60 + 49 * Math.sin(a)} stroke="rgba(255,255,255,0.05)" strokeWidth={i % 5 === 0 ? 1.2 : 0.4} />;
                })}
                <circle cx="60" cy="60" r={radius} fill="none" stroke={scoreColor} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s', filter: `drop-shadow(0 0 8px ${scoreColor}40)` }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: 'var(--text-primary)', lineHeight: 1 }}>{animatedScore}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginTop: '4px' }}>GEO SCORE</span>
              </div>
            </div>
            {/* Quick verdict */}
            <p className="text-center mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.4 }}>
              Needs improvement in<br /><span style={{ color: '#f59e0b' }}>Brand</span> and <span style={{ color: '#ef4444' }}>Schema</span>
            </p>
          </div>

          {/* Category bars */}
          <div className="flex-1 space-y-1">
            {categories.map((cat, i) => (
              <div key={cat.label}
                className="cursor-default rounded-lg px-3 py-2 transition-all duration-200"
                style={{
                  opacity: phase >= 2 ? 1 : 0,
                  transform: phase >= 2 ? 'translateX(0)' : 'translateX(8px)',
                  transition: `all 0.35s ease ${i * 0.06}s`,
                  background: hoveredCat === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredCat(i)}
                onMouseLeave={() => setHoveredCat(null)}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.75rem', color: hoveredCat === i ? 'var(--text-primary)' : 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}>{cat.label}</span>
                    <span style={{ fontSize: '0.55rem', color: hoveredCat === i ? cat.color : 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}>{cat.weight}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: phase >= 2 ? cat.color : 'rgba(255,255,255,0.1)' }}>{phase >= 2 ? cat.value : "—"}</span>
                </div>
                <div className="h-[5px] rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: phase >= 2 ? `${cat.value}%` : '0%',
                    background: cat.color,
                    boxShadow: hoveredCat === i ? `0 0 12px ${cat.color}50` : `0 0 4px ${cat.color}20`,
                    transition: `width 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 * i}s, box-shadow 0.2s`,
                  }} />
                </div>
                {hoveredCat === i && (
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{cat.tip}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Platforms */}
        <div className="mb-4" style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.4s ease' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1 h-3 rounded-full" style={{ background: '#3b82f6' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>PLATFORM READINESS</span>
          </div>
          <div className="flex gap-2">
            {platforms.map((p, i) => {
              const color = p.score >= 15 ? 'var(--accent)' : p.score >= 10 ? '#f59e0b' : '#ef4444';
              const isHovered = hoveredPlatform === i;
              return (
                <div key={p.name}
                  className="flex-1 p-3 rounded-lg text-center cursor-default transition-all duration-200"
                  style={{
                    background: isHovered ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.015)',
                    border: isHovered ? `1px solid ${color}30` : '1px solid rgba(255,255,255,0.03)',
                    transform: isHovered ? 'translateY(-2px)' : phase >= 3 ? 'scale(1)' : 'scale(0.9)',
                    opacity: phase >= 3 ? 1 : 0,
                    transition: `all 0.25s ease ${i * 0.06}s`,
                    boxShadow: isHovered ? `0 4px 20px -6px ${color}30` : 'none',
                  }}
                  onMouseEnter={() => setHoveredPlatform(i)}
                  onMouseLeave={() => setHoveredPlatform(null)}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '4px', transition: 'color 0.2s' }}>{p.name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color }}>{p.score}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)' }}>/{p.max}</span>
                  {isHovered && (
                    <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px', lineHeight: 1.3, fontFamily: 'var(--font-mono)' }}>{p.tip}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Crawlers */}
        <div style={{ opacity: phase >= 4 ? 1 : 0, transform: phase >= 4 ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.4s ease' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>AI CRAWLER ACCESS</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {crawlers.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 cursor-default group/crawler" style={{
                opacity: phase >= 4 ? 1 : 0, transition: `opacity 0.25s ease ${i * 0.05}s`,
              }}>
                <div className="w-2.5 h-2.5 rounded-full transition-transform duration-200 group-hover/crawler:scale-125" style={{ background: c.status === "allowed" ? 'var(--accent)' : '#ef4444' }} />
                <span className="transition-colors duration-200 group-hover/crawler:text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{c.name}</span>
                <span className="opacity-0 group-hover/crawler:opacity-100 transition-opacity duration-200" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: c.status === "allowed" ? 'var(--accent)' : '#ef4444' }}>
                  {c.status === "allowed" ? "OK" : "BLOCKED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 3 — REPORT PREVIEW
   Stacked document cards that fan open progressively,
   revealing report layers: findings → rewrites → schema → plan.
   ═══════════════════════════════════════════════════════════════ */

function ReportPreview({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [hoveredFinding, setHoveredFinding] = useState<number | null>(null);

  useEffect(() => {
    if (!active) { setPhase(0); setActiveTab(0); setCheckedItems(new Set()); return; }
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  const tabs = [
    { label: "Findings", color: "#ef4444", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
    { label: "Rewrites", color: "#6c63ff", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { label: "Schema", color: "var(--accent)", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
    { label: "Plan", color: "#3b82f6", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  ];

  const findings = [
    { sev: "CRITICAL", col: "#ef4444", txt: "GPTBot blocked — invisible to ChatGPT", fix: "Update robots.txt", impact: "Entire ChatGPT audience can't see you" },
    { sev: "HIGH", col: "#f59e0b", txt: "No Organization schema with sameAs", fix: "Add JSON-LD", impact: "AI can't verify your entity identity" },
    { sev: "HIGH", col: "#f59e0b", txt: "Zero definition patterns in content", fix: "Rewrite openings", impact: "Content not structured for AI citation" },
    { sev: "MEDIUM", col: "#3b82f6", txt: "llms.txt file not found", fix: "Create llms.txt", impact: "Missing AI-specific site guide" },
  ];

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item); else next.add(item);
      return next;
    });
  };

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: '#080c16', border: '1px solid rgba(255,255,255,0.04)', height: '440px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-5" viewBox="0 0 14 16" fill="none">
            <rect x="0.5" y="0.5" width="13" height="15" rx="1.5" stroke="rgba(14,244,197,0.3)" strokeWidth="1" />
            <path d="M4 5h6M4 8h6M4 11h3" stroke="rgba(14,244,197,0.2)" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>GEO-REPORT-stripe.com.pdf</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.15)', marginLeft: '4px' }}>12 pages</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[rgba(14,244,197,0.1)]"
          style={{ background: phase >= 2 ? 'rgba(14,244,197,0.06)' : 'transparent', border: `1px solid ${phase >= 2 ? 'rgba(14,244,197,0.12)' : 'rgba(255,255,255,0.04)'}` }}>
          <svg className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)' }}>DOWNLOAD PDF</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-3 gap-1 shrink-0" style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {tabs.map((tab, i) => (
          <button key={tab.label} onClick={() => setActiveTab(i)}
            className="flex items-center gap-1.5 px-4 py-2.5 cursor-pointer transition-all duration-200"
            style={{
              background: activeTab === i ? 'rgba(255,255,255,0.03)' : 'transparent',
              borderBottom: activeTab === i ? `2px solid ${tab.color}` : '2px solid transparent',
              border: 'none',
              borderRadius: '8px 8px 0 0',
            }}>
            <svg className="w-3.5 h-3.5" style={{ color: activeTab === i ? tab.color : 'rgba(255,255,255,0.15)', transition: 'color 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.03em',
              color: activeTab === i ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)',
              transition: 'color 0.2s',
            }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 flex-1 overflow-auto" style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }}>
        {/* Findings tab */}
        {activeTab === 0 && (
          <div className="space-y-2">
            <p className="mb-3" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
              Found <span style={{ color: '#ef4444', fontWeight: 700 }}>1 critical</span>, <span style={{ color: '#f59e0b', fontWeight: 700 }}>2 high</span>, <span style={{ color: '#3b82f6', fontWeight: 700 }}>3 medium</span> issues across 47 pages
            </p>
            {findings.map((f, i) => (
              <div key={i}
                className="cursor-default rounded-lg transition-all duration-200"
                style={{
                  background: hoveredFinding === i ? `${f.col}08` : `${f.col}03`,
                  borderLeft: `3px solid ${hoveredFinding === i ? f.col : `${f.col}40`}`,
                  padding: '12px 16px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setHoveredFinding(i)}
                onMouseLeave={() => setHoveredFinding(null)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 700, color: f.col, padding: '2px 6px', borderRadius: '4px', background: `${f.col}15`, border: `1px solid ${f.col}25` }}>{f.sev}</span>
                    <span style={{ fontSize: '0.8rem', color: hoveredFinding === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}>{f.txt}</span>
                  </div>
                  <span className="shrink-0 ml-3 transition-all duration-200" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '3px 8px', borderRadius: '4px',
                    color: hoveredFinding === i ? f.col : `${f.col}60`,
                    background: hoveredFinding === i ? `${f.col}15` : `${f.col}08`,
                    border: `1px solid ${hoveredFinding === i ? `${f.col}30` : 'transparent'}`,
                  }}>{f.fix}</span>
                </div>
                {hoveredFinding === i && (
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '8px', fontFamily: 'var(--font-mono)', paddingLeft: '2px' }}>
                    Impact: {f.impact}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rewrites tab */}
        {activeTab === 1 && (
          <div>
            <p className="mb-4" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
              AI citability rewrite for <span style={{ color: 'var(--text-primary)' }}>/blog/website-performance</span> — passage 3 of 12
            </p>
            <div className="flex gap-4">
              <div className="flex-1 p-4 rounded-lg cursor-default transition-all duration-200 hover:bg-[rgba(239,68,71,0.05)]" style={{ background: 'rgba(239,68,71,0.02)', border: '1px solid rgba(239,68,71,0.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#ef4444', letterSpacing: '0.06em' }}>BEFORE</span>
                  </div>
                  <span className="px-2 py-1 rounded" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', background: 'rgba(239,68,71,0.1)', color: '#ef4444', fontWeight: 700 }}>Score: 31</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;If you&apos;ve ever wondered about website speed, there&apos;s a lot to consider. It&apos;s really important for many reasons and can affect your business in ways you might not expect...&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Vague opening", "No data", "Pronoun-heavy", "No source"].map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(239,68,71,0.5)', padding: '2px 6px', borderRadius: '3px', background: 'rgba(239,68,71,0.06)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center shrink-0">
                <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </div>
              <div className="flex-1 p-4 rounded-lg cursor-default transition-all duration-200 hover:bg-[rgba(14,244,197,0.04)]" style={{ background: 'rgba(14,244,197,0.015)', border: '1px solid rgba(14,244,197,0.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.06em' }}>AFTER</span>
                  </div>
                  <span className="px-2 py-1 rounded" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', background: 'rgba(14,244,197,0.1)', color: 'var(--accent)', fontWeight: 700 }}>Score: 87</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                  &ldquo;Website load speed directly impacts conversion rates. According to Google&apos;s Core Web Vitals research, pages loading in over 3 seconds lose 40% of visitors (Web.dev, 2024). For e-commerce sites, each 100ms of latency costs 1% in revenue.&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Fact-first", "Named source", "Stat-dense", "Self-contained"].map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(14,244,197,0.5)', padding: '2px 6px', borderRadius: '3px', background: 'rgba(14,244,197,0.06)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schema tab */}
        {activeTab === 2 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>GENERATED JSON-LD — READY TO PASTE</span>
              <button className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-all duration-200 hover:bg-[rgba(14,244,197,0.1)]"
                style={{ background: 'rgba(14,244,197,0.05)', border: '1px solid rgba(14,244,197,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--accent)' }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                COPY
              </button>
            </div>
            <pre className="p-4 rounded-lg overflow-x-auto" style={{
              background: 'rgba(14,244,197,0.015)', border: '1px solid rgba(14,244,197,0.06)',
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', lineHeight: 1.8,
            }}>
<span style={{ color: 'rgba(255,255,255,0.2)' }}>{'{'}</span>{'\n'}
<span style={{ color: 'rgba(14,244,197,0.6)' }}>  &quot;@context&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>: </span><span style={{ color: 'rgba(245,158,11,0.6)' }}>&quot;https://schema.org&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>,</span>{'\n'}
<span style={{ color: 'rgba(14,244,197,0.6)' }}>  &quot;@type&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>: </span><span style={{ color: 'rgba(245,158,11,0.6)' }}>&quot;Organization&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>,</span>{'\n'}
<span style={{ color: 'rgba(14,244,197,0.6)' }}>  &quot;name&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>: </span><span style={{ color: 'rgba(245,158,11,0.6)' }}>&quot;Stripe&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>,</span>{'\n'}
<span style={{ color: 'rgba(14,244,197,0.6)' }}>  &quot;url&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>: </span><span style={{ color: 'rgba(245,158,11,0.6)' }}>&quot;https://stripe.com&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>,</span>{'\n'}
<span style={{ color: 'rgba(14,244,197,0.6)' }}>  &quot;sameAs&quot;</span><span style={{ color: 'rgba(255,255,255,0.15)' }}>: [</span>{'\n'}
<span style={{ color: 'rgba(245,158,11,0.5)' }}>    &quot;https://en.wikipedia.org/wiki/Stripe_(company)&quot;</span><span style={{ color: 'rgba(255,255,255,0.1)' }}>,</span>{'\n'}
<span style={{ color: 'rgba(245,158,11,0.5)' }}>    &quot;https://www.youtube.com/@StripeDev&quot;</span><span style={{ color: 'rgba(255,255,255,0.1)' }}>,</span>{'\n'}
<span style={{ color: 'rgba(245,158,11,0.5)' }}>    &quot;https://www.linkedin.com/company/stripe&quot;</span>{'\n'}
<span style={{ color: 'rgba(255,255,255,0.15)' }}>  ]</span>{'\n'}
<span style={{ color: 'rgba(255,255,255,0.2)' }}>{'}'}</span>
            </pre>
          </div>
        )}

        {/* Action plan tab */}
        {activeTab === 3 && (
          <div>
            <p className="mb-4" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
              Prioritized by impact — click to mark complete
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { period: "WEEK 1", label: "Quick Wins", desc: "High impact, low effort", items: ["Unblock GPTBot in robots.txt", "Add Organization JSON-LD schema", "Create llms.txt file", "Add sameAs links to schema"], color: "var(--accent)" },
                { period: "WEEK 2–3", label: "Content Fixes", desc: "Rewrite for AI citability", items: ["Rewrite top 5 page openings", "Add author bios + credentials", "Build FAQ schema sections", "Add definition patterns"], color: "#3b82f6" },
                { period: "MONTH 2+", label: "Strategic", desc: "Long-term authority building", items: ["Build Wikipedia presence", "Launch YouTube channel", "Grow Reddit engagement", "Create Wikidata entity"], color: "#6c63ff" },
              ].map((col) => (
                <div key={col.period} className="p-4 rounded-lg transition-all duration-200 hover:bg-[rgba(255,255,255,0.025)]" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="mb-4">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: col.color, letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>{col.period}</span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{col.label}</span>
                    <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{col.desc}</p>
                  </div>
                  {col.items.map((item) => {
                    const isChecked = checkedItems.has(item);
                    return (
                      <div key={item}
                        className="flex items-start gap-2.5 py-2 cursor-pointer group/action"
                        onClick={() => toggleCheck(item)}>
                        <div className="w-4 h-4 mt-0.5 rounded shrink-0 flex items-center justify-center transition-all duration-200"
                          style={{
                            border: `1.5px solid ${isChecked ? col.color : 'rgba(255,255,255,0.12)'}`,
                            background: isChecked ? `${col.color}20` : 'transparent',
                          }}>
                          {isChecked && (
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke={col.color} strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        <span className="transition-all duration-200 group-hover/action:text-[rgba(255,255,255,0.7)]" style={{
                          fontSize: '0.78rem', lineHeight: 1.4,
                          color: isChecked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SECTION
   Horizontal step indicator with energy beam + stacked previews
   ═══════════════════════════════════════════════════════════════ */

const STEP_DATA = [
  { num: "01", title: "Scan", sub: "We crawl up to 50 pages, check robots.txt for 14 AI crawlers, extract schema, and analyze content blocks.", badge: null },
  { num: "02", title: "Score", sub: "Get your composite GEO score (0–100) with breakdown across 6 weighted categories and top findings.", badge: "FREE" as const },
  { num: "03", title: "Report", sub: "Unlock AI rewrite suggestions, generated JSON-LD schema, 30-day action plan, and downloadable PDF.", badge: "$5" as const },
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cycleKey, setCycleKey] = useState(0); // forces re-mount of preview to restart animations
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep((s) => {
        const next = (s + 1) % 3;
        setCycleKey((k) => k + 1);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleStepClick = useCallback((i: number) => {
    setActiveStep(i);
    setCycleKey((k) => k + 1);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-dim) 0%, transparent 70%)', opacity: 0.4 }} />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            From URL to Action Plan in 60 Seconds
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            One free scan to see your score. One report to know exactly what to fix.
          </p>
        </div>

        {/* ── Step indicator bar ── */}
        <div className="relative mb-12" style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
        }}>
          <div className="flex items-center justify-between relative">
            {/* Connecting line (behind nodes) */}
            <div className="absolute top-5 left-[16.66%] right-[16.66%] h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {/* Animated progress beam */}
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${activeStep * 50}%`,
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent-dim)',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>

            {STEP_DATA.map((step, i) => {
              const isActive = activeStep === i;
              const isPast = activeStep > i;
              return (
                <button key={step.num} onClick={() => handleStepClick(i)}
                  className="relative flex flex-col items-center gap-3 cursor-pointer group"
                  style={{ flex: 1, background: 'none', border: 'none', padding: '0' }}>
                  {/* Node circle */}
                  <div className="relative" style={{
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    background: isActive ? 'var(--accent)' : isPast ? 'rgba(14,244,197,0.15)' : 'var(--bg-elevated)',
                    border: `2px solid ${isActive ? 'var(--accent)' : isPast ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 0 20px var(--accent-dim)' : 'none',
                    zIndex: 2,
                  }}>
                    {isPast ? (
                      <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem',
                        color: isActive ? 'var(--bg-void)' : 'var(--text-muted)',
                        transition: 'color 0.3s ease',
                      }}>
                        {step.num}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2" style={{ marginBottom: '4px' }}>
                      <p style={{
                        fontFamily: 'var(--font-display)', fontWeight: 600,
                        fontSize: '0.95rem',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        transition: 'color 0.3s ease',
                      }}>
                        {step.title}
                      </p>
                      {step.badge && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 700,
                          letterSpacing: '0.04em',
                          padding: '1px 6px', borderRadius: '4px',
                          background: step.badge === "FREE" ? 'rgba(14,244,197,0.12)' : 'rgba(108,99,255,0.15)',
                          color: step.badge === "FREE" ? 'var(--accent)' : 'var(--accent-secondary)',
                          border: `1px solid ${step.badge === "FREE" ? 'rgba(14,244,197,0.2)' : 'rgba(108,99,255,0.25)'}`,
                        }}>
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className="hidden md:block" style={{
                      fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)',
                      maxWidth: '220px', margin: '0 auto', lineHeight: 1.45,
                    }}>
                      {step.sub}
                    </p>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-0.5 rounded-full overflow-hidden" style={{ width: '60px' }}>
                      <div style={{
                        height: '100%', borderRadius: '999px', background: 'var(--accent)',
                        animation: 'workflow-progress 6s linear forwards',
                      }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Interactive preview ── */}
        <div className="relative" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
          minHeight: '440px',
        }}>
          {/* Each preview fades/scales in/out */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: i === activeStep ? 'relative' : 'absolute',
              inset: i === activeStep ? undefined : 0,
              opacity: i === activeStep ? 1 : 0,
              transform: i === activeStep ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
              transition: 'opacity 0.45s ease, transform 0.45s ease',
              pointerEvents: i === activeStep ? 'auto' : 'none',
            }}>
              {i === 0 && <ScanVisualization key={`scan-${cycleKey}`} active={activeStep === 0 && isVisible} />}
              {i === 1 && <ScoreDashboard key={`score-${cycleKey}`} active={activeStep === 1 && isVisible} />}
              {i === 2 && <ReportPreview key={`report-${cycleKey}`} active={activeStep === 2 && isVisible} />}
            </div>
          ))}
        </div>

        {/* Context caption per step */}
        <div className="mt-6 text-center" style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.6s',
        }}>
          {activeStep === 0 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Our crawler checks robots.txt, sitemap.xml, meta tags, JSON-LD, headings, SSR status, security headers, and llms.txt
            </p>
          )}
          {activeStep === 1 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              AI Citability 25% &middot; Brand Authority 20% &middot; E-E-A-T 20% &middot; Technical 15% &middot; Schema 10% &middot; Platform 10%
            </p>
          )}
          {activeStep === 2 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
              <span style={{ color: 'var(--text-muted)' }}>Agencies charge $2K–$12K/month for this analysis.</span>
              {' '}
              <span style={{ color: 'var(--accent)' }}>You get it for $5.</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
