"use client";

import { useMemo, useState, useEffect } from "react";

interface Stage {
  label: string;
  minPercent: number;
  maxPercent: number;
  icon: React.ReactNode;
}

const STAGES: Stage[] = [
  {
    label: "Fetching page content...",
    minPercent: 0,
    maxPercent: 10,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Analyzing robots.txt & crawlers...",
    minPercent: 10,
    maxPercent: 25,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Scoring content citability...",
    minPercent: 25,
    maxPercent: 40,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Evaluating brand authority...",
    minPercent: 40,
    maxPercent: 55,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Checking schema & structured data...",
    minPercent: 55,
    maxPercent: 70,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: "Running platform analysis...",
    minPercent: 70,
    maxPercent: 85,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Computing final GEO score...",
    minPercent: 85,
    maxPercent: 100,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

function getStageStatus(
  stage: Stage,
  progress: number
): "completed" | "active" | "pending" {
  if (progress >= stage.maxPercent) return "completed";
  if (progress >= stage.minPercent) return "active";
  return "pending";
}

export default function ScanProgress({
  progress,
  domain,
  scanType,
}: {
  progress: number;
  domain: string;
  scanType?: string;
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `0:${seconds.toString().padStart(2, "0")}`;
  const isFull = scanType === "full";

  const activeIndex = useMemo(() => {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (clampedProgress >= STAGES[i].minPercent) return i;
    }
    return 0;
  }, [clampedProgress]);

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Domain header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
          }}
        >
          <span
            className="scan-progress-pulse-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--accent)",
              letterSpacing: "0.02em",
            }}
          >
            Scanning in progress
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          {domain}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          GEO Analysis
        </p>
      </div>

      {/* Vertical stepper */}
      <div className="relative" style={{ paddingLeft: "2rem" }}>
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "0.9375rem",
            top: "0.75rem",
            bottom: "0.75rem",
            width: 2,
            background: "var(--border)",
            borderRadius: 1,
          }}
        />
        {/* Filled progress line */}
        <div
          style={{
            position: "absolute",
            left: "0.9375rem",
            top: "0.75rem",
            width: 2,
            borderRadius: 1,
            background: "var(--accent)",
            transition: "height 0.6s ease",
            height:
              activeIndex >= STAGES.length - 1
                ? "calc(100% - 1.5rem)"
                : `calc(${(activeIndex / (STAGES.length - 1)) * 100}% + ${
                    ((clampedProgress - STAGES[activeIndex].minPercent) /
                      (STAGES[activeIndex].maxPercent -
                        STAGES[activeIndex].minPercent)) *
                    (100 / (STAGES.length - 1))
                  }%)`,
          }}
        />

        {STAGES.map((stage, i) => {
          const status = getStageStatus(stage, clampedProgress);

          return (
            <div
              key={i}
              className="relative flex items-start gap-3 scan-progress-stage"
              style={{
                paddingBottom: i < STAGES.length - 1 ? "1.5rem" : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              {/* Dot / Check */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  position: "absolute",
                  left: "-2rem",
                  top: "0.125rem",
                  width: "1.875rem",
                  height: "1.875rem",
                  borderRadius: "50%",
                  transition: "all 0.4s ease",
                  ...(status === "completed"
                    ? {
                        background: "var(--accent)",
                      }
                    : status === "active"
                    ? {
                        background: "var(--bg-surface)",
                        border: "2px solid var(--accent)",
                        boxShadow: "0 0 12px var(--accent-dim), 0 0 4px var(--accent-dim)",
                      }
                    : {
                        background: "var(--bg-surface)",
                        border: "2px solid var(--border)",
                      }),
                }}
              >
                {status === "completed" ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--bg-void)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : status === "active" ? (
                  <span
                    className="scan-progress-pulse-dot"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "block",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--text-muted)",
                      display: "block",
                      opacity: 0.5,
                    }}
                  />
                )}
              </div>

              {/* Icon + Label */}
              <div
                className="flex items-center gap-2.5 min-h-[1.875rem]"
                style={{
                  transition: "color 0.4s ease",
                  color:
                    status === "completed"
                      ? "var(--accent)"
                      : status === "active"
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                }}
              >
                <span
                  style={{
                    opacity: status === "pending" ? 0.4 : 1,
                    transition: "opacity 0.4s ease",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {stage.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: status === "active" ? 600 : 400,
                    transition: "all 0.4s ease",
                  }}
                >
                  {stage.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Overall Progress
          </span>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              {timeStr}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              {Math.round(clampedProgress)}%
            </span>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: 6,
            borderRadius: 3,
            background: "var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            className="scan-progress-bar-fill"
            style={{
              height: "100%",
              borderRadius: 3,
              width: `${clampedProgress}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {/* Full scan reminder */}
      {isFull && (
        <div className="mt-6 text-center rounded-lg p-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.04em', marginBottom: '4px' }}>
            FULL GEO AUDIT IN PROGRESS
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            We&apos;re running a deep analysis across 6 categories, scanning up to 50 pages, and checking 14 AI crawlers. This usually takes 3-5 minutes.
          </p>
        </div>
      )}

    </div>
  );
}
