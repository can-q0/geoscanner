"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useScanStatus } from "@/hooks/useScanStatus";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryScores from "@/components/CategoryScores";
import BlurredSection from "@/components/BlurredSection";
import CodeBlock from "@/components/CodeBlock";
import TableOfContents from "@/components/TableOfContents";
import TrustIndicators from "@/components/TrustIndicators";
import ShareButton from "@/components/ShareButton";
import ScanProgress from "@/components/ScanProgress";
import ScanResultLoading from "./loading";
import { analytics } from "@/lib/analytics";

function Breadcrumb({ domain }: { domain?: string }) {
  return (
    <div className="mb-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs transition-colors mb-2"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--text-secondary)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <span aria-hidden="true">&larr;</span> Back to Dashboard
      </Link>
      <nav
        className="flex items-center gap-1.5 text-xs"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-label="Breadcrumb"
      >
        <Link
          href="/dashboard"
          className="transition-colors"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Dashboard
        </Link>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{domain || "..."}</span>
      </nav>
    </div>
  );
}

export default function ScanResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: scan, loading, error } = useScanStatus(id);
  const router = useRouter();
  const trackedCompleted = useRef(false);
  const trackedPaywall = useRef(false);

  // Track scan completed
  useEffect(() => {
    if (scan?.status === "completed" && scan.domain && scan.geoScore != null && !trackedCompleted.current) {
      trackedCompleted.current = true;
      analytics.scanCompleted(scan.domain, scan.geoScore);
    }
  }, [scan?.status, scan?.domain, scan?.geoScore]);

  // Track paywall shown for pending_payment status
  useEffect(() => {
    if (scan?.status === "pending_payment" && scan.domain && !trackedPaywall.current) {
      trackedPaywall.current = true;
      analytics.paywallShown(scan.domain, scan.geoScore ?? 0);
    }
  }, [scan?.status, scan?.domain, scan?.geoScore]);

  if (loading) {
    return <ScanResultLoading />;
  }

  if (error || !scan) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Breadcrumb />
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || "Scan not found"}</p>
            <button onClick={() => router.push("/")} className="text-emerald-400 hover:underline">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processing state
  if (scan.status === "processing" || scan.status === "pending") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Breadcrumb domain={scan.domain} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <ScanProgress progress={scan.progress ?? 0} domain={scan.domain || "..."} scanType={scan.scanType} />
        </div>
      </div>
    );
  }

  // Pending payment state - user used their free scan, this URL needs purchase
  if (scan.status === "pending_payment") {
    const handleBuyReport = async () => {
      analytics.paymentStarted(scan.domain, scan.id);
      try {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanId: scan.id }),
        });
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;
        const data = await res.json();
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } catch {
        alert("Payment failed. Please try again.");
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Breadcrumb domain={scan.domain} />
        <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center max-w-lg px-6">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}>
            <svg className="w-7 h-7" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Full Analysis for {scan.domain}
          </h2>
          <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            You&apos;ve used your free scan. Get a complete GEO audit for this website including:
          </p>
          <ul className="text-left inline-block mb-6 space-y-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {[
              "Composite GEO score with 6 category breakdown",
              "AI citability analysis with rewrite suggestions",
              "Brand authority scan (YouTube, Reddit, Wikipedia)",
              "Technical SEO + AI crawler access audit",
              "Generated Schema.org markup ready to paste",
              "30-day prioritized action plan",
              "Downloadable PDF report",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <button onClick={handleBuyReport}
            className="cursor-pointer px-8 py-3.5 font-semibold transition-all rounded-lg"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              background: 'var(--accent)',
              color: 'var(--bg-void)',
              boxShadow: '0 0 30px var(--accent-dim)',
            }}>
            Get Full Report &mdash; $5
          </button>
          <p className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            ONE-TIME PAYMENT &middot; INSTANT ANALYSIS &middot; PDF INCLUDED
          </p>

          <div className="mt-4">
            <TrustIndicators />
          </div>

          <p className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
            100% money-back guarantee if you&apos;re not satisfied
          </p>

          <div className="mt-6">
            <button onClick={() => router.push("/dashboard")}
              className="cursor-pointer text-sm transition-colors hover:underline"
              style={{ color: 'var(--text-muted)' }}>
              Back to dashboard
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // Error state
  if (scan.status === "failed") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Breadcrumb domain={scan.domain} />
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center max-w-md">
            <p className="text-red-400 text-lg mb-2">Scan failed</p>
            <p className="text-gray-400 text-sm mb-4">{safeStr(scan.errorMessage)}</p>
            <button onClick={() => router.push("/")} className="text-emerald-400 hover:underline">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed state
  const rawSummary = scan.scoresSummary as {
    scores?: Record<string, number>;
    summary?: string;
    top_findings?: (string | Record<string, unknown>)[];
    score_label?: string;
    crawler_status?: Record<string, string>;
    llmstxt_exists?: boolean;
  } | null;

  // Normalize top_findings — could be strings or objects from different scan types
  const summary = rawSummary ? {
    ...rawSummary,
    top_findings: rawSummary.top_findings?.map((f) => {
      if (typeof f === "string") return f;
      if (typeof f === "object" && f !== null) {
        const sev = (f.severity as string || "").toUpperCase();
        const title = (f.title as string) || (f.description as string) || JSON.stringify(f);
        return sev ? `${sev}: ${title}` : title;
      }
      return String(f);
    }),
  } : null;

  const scores = summary?.scores || {
    citability: 0, brand: 0, content_eeat: 0, technical: 0, schema: 0, platform: 0,
  };

  const handleUnlock = async () => {
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: scan.id }),
      });
      const data = await res.json();

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      alert("Payment initiation failed. Please try again.");
    }
  };

  const showToc = !!(scan.isPaid && scan.resultsFull);

  return (
    <>
      {showToc && <TableOfContents />}
      <div className={`${showToc ? "max-w-6xl" : "max-w-4xl"} mx-auto px-6 py-10${showToc ? " has-toc" : ""}`}>
        {/* Breadcrumb + Back */}
        <Breadcrumb domain={scan.domain} />

        {/* Header */}
        <div className="mb-8" id="overview">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">GEO Analysis: {scan.domain}</h1>
              <p className="text-gray-400 text-sm">{scan.url}</p>
            </div>
            <ShareButton score={scan.geoScore || 0} domain={scan.domain} scanId={scan.id} />
          </div>
        </div>

        {/* Score + Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex justify-center">
            <div className="relative">
              <ScoreGauge score={scan.geoScore || 0} label={summary?.score_label} />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
            <CategoryScores scores={scores as Parameters<typeof CategoryScores>[0]["scores"]} />
          </div>
        </div>

        {/* Quick findings (always visible) */}
        {summary?.summary && (
          <div id="executive-summary" className="rounded-lg border p-6 mb-6 scroll-mt-20"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Executive Summary</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{summary.summary}</p>
          </div>
        )}

        {summary?.top_findings && summary.top_findings.length > 0 && (
          <div id="findings" className="rounded-lg border p-6 mb-6 scroll-mt-20"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Top Findings</h2>
            <ul className="space-y-3">
              {summary.top_findings.map((finding, i) => {
                const isCritical = /^CRITICAL/i.test(finding);
                const isBlurred = !scan.isPaid && isCritical;
                // Extract severity label (e.g., "CRITICAL:", "HIGH:", "MEDIUM:")
                const severityMatch = finding.match(/^(CRITICAL|HIGH|MEDIUM|LOW):\s*/i);
                const severity = severityMatch ? severityMatch[1].toUpperCase() : null;
                const insightText = severityMatch ? finding.slice(severityMatch[0].length) : finding;
                const sevColor = severity === "CRITICAL" ? "#ef4444" : severity === "HIGH" ? "#f59e0b" : severity === "MEDIUM" ? "#3b82f6" : "var(--accent)";

                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: sevColor }} />
                    <div className="flex-1">
                      {severity && (
                        <span className="inline-block mr-2" style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                          color: sevColor, padding: '1px 6px', borderRadius: '4px',
                          background: `${sevColor}15`, border: `1px solid ${sevColor}25`,
                          verticalAlign: 'middle',
                        }}>
                          {severity}
                        </span>
                      )}
                      <span style={{
                        color: isBlurred ? 'transparent' : 'var(--text-secondary)',
                        textShadow: isBlurred ? '0 0 8px var(--text-muted)' : 'none',
                        userSelect: isBlurred ? 'none' : 'auto',
                      }}>
                        {isBlurred ? insightText.replace(/./g, (c) => c === ' ' ? ' ' : 'x') : insightText}
                      </span>
                      {isBlurred && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-secondary)', marginLeft: '8px' }}>
                          Unlock full report
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* AI Crawler Status (always visible) */}
        {summary?.crawler_status && Object.keys(summary.crawler_status).length > 0 && (
          <div id="crawler-access" className="rounded-lg border p-6 mb-6 scroll-mt-20"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>AI Crawler Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(summary.crawler_status).map(([crawler, status]) => (
                <div key={crawler} className="flex items-center gap-2 text-sm">
                  <span className={`h-2 w-2 rounded-full ${
                    status === "ALLOWED" || status === "ALLOWED_BY_DEFAULT"
                      ? "bg-emerald-500"
                      : status === "BLOCKED" || status === "BLOCKED_BY_WILDCARD"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`} />
                  <span style={{ color: 'var(--text-secondary)' }}>{crawler}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid content section */}
        {scan.isPaid && scan.resultsFull ? (
          <FullResults results={scan.resultsFull as Record<string, unknown>} scanId={scan.id} pdfUrl={scan.pdfUrl} />
        ) : (
          <BlurredSection scanId={scan.id} onUnlock={handleUnlock} />
        )}
      </div>
    </>
  );
}

interface Finding {
  severity: string;
  category?: string;
  title: string;
  description: string;
  fix?: string;
}

interface ActionItem {
  action: string;
  impact: string;
  effort: string;
}

interface RewriteSuggestion {
  heading: string;
  original_preview: string;
  suggested_rewrite: string;
  improvement_reason: string;
}

interface SynthesisData {
  executive_summary?: string;
  all_findings?: Finding[];
  quick_wins?: ActionItem[];
  medium_term?: ActionItem[];
  strategic?: ActionItem[];
}

interface CategoryData {
  analysis?: string;
  generated_schema?: string;
  rewrite_suggestions?: RewriteSuggestion[];
}

// Safely convert any value to a renderable string
function safeStr(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  try { return JSON.stringify(val, null, 2); } catch { return String(val); }
}

function SeverityTabs({ findings }: { findings: Finding[] }) {
  const [active, setActive] = useState<string>("all");
  const severities = ["all", "critical", "high", "medium", "low"];
  const counts: Record<string, number> = { all: findings.length };
  findings.forEach((f) => { const s = (f.severity || "").toLowerCase(); counts[s] = (counts[s] || 0) + 1; });
  const colors: Record<string, string> = { critical: "#ef4444", high: "#f59e0b", medium: "#3b82f6", low: "var(--text-muted)" };
  const filtered = active === "all" ? findings : findings.filter((f) => (f.severity || "").toLowerCase() === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {severities.map((s) => {
          if (s !== "all" && !counts[s]) return null;
          return (
            <button key={s} onClick={() => setActive(s)}
              className="cursor-pointer px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
              style={{
                fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                background: active === s ? (s === "all" ? 'var(--accent-dim)' : `${colors[s]}20`) : 'var(--bg-elevated)',
                color: active === s ? (s === "all" ? 'var(--accent)' : colors[s]) : 'var(--text-muted)',
                border: `1px solid ${active === s ? (s === "all" ? 'var(--accent)' : colors[s]) + '40' : 'var(--border)'}`,
              }}>
              {s.toUpperCase()} {counts[s] ? `(${counts[s]})` : ""}
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        {filtered.map((finding, i) => {
          const sev = (finding.severity || "").toLowerCase();
          const color = colors[sev] || "var(--text-muted)";
          return (
            <div key={i} className="rounded-lg p-4 transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderLeft: `3px solid ${color}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ fontFamily: 'var(--font-mono)', color, background: `${color}15`, border: `1px solid ${color}25` }}>
                  {safeStr(finding.severity).toUpperCase()}
                </span>
                {finding.category && <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{safeStr(finding.category)}</span>}
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{safeStr(finding.title)}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{safeStr(finding.description)}</p>
              {finding.fix && (
                <p className="text-sm mt-2 flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {safeStr(finding.fix)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionPlanTabs({ synthesis }: { synthesis: SynthesisData }) {
  const tabs = [
    { key: "quick_wins", label: "Quick Wins", sub: "Under 4 hours", color: "var(--accent)", items: synthesis.quick_wins },
    { key: "medium_term", label: "Medium-Term", sub: "1-2 weeks", color: "#3b82f6", items: synthesis.medium_term },
    { key: "strategic", label: "Strategic", sub: "1-3 months", color: "#6c63ff", items: synthesis.strategic },
  ].filter((t) => t.items && t.items.length > 0);

  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  };

  if (tabs.length === 0) return null;
  const current = tabs[active];

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {tabs.map((t, i) => (
          <button key={t.key} onClick={() => setActive(i)}
            className="cursor-pointer flex-1 p-3 rounded-lg text-center transition-all"
            style={{
              background: active === i ? `${t.color}12` : 'var(--bg-elevated)',
              border: `1px solid ${active === i ? t.color + '40' : 'var(--border)'}`,
            }}>
            <span className="block text-sm font-semibold" style={{ color: active === i ? t.color : 'var(--text-secondary)' }}>{t.label}</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.sub}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {current.items!.map((item, i) => {
          const id = `${current.key}-${i}`;
          const isDone = checked.has(id);
          return (
            <div key={i} onClick={() => toggle(id)}
              className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all"
              style={{ background: isDone ? `${current.color}08` : 'var(--bg-elevated)', border: `1px solid ${isDone ? current.color + '25' : 'var(--border)'}` }}>
              <div className="mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all"
                style={{ border: `2px solid ${isDone ? current.color : 'var(--border)'}`, background: isDone ? `${current.color}20` : 'transparent' }}>
                {isDone && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={current.color} strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                  {safeStr(item.action)}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{safeStr(item.effort)}</span>
                  {item.impact && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      fontFamily: 'var(--font-mono)',
                      background: item.impact === "high" ? 'rgba(239,68,68,0.1)' : item.impact === "medium" ? 'rgba(59,130,246,0.1)' : 'rgba(107,114,128,0.1)',
                      color: item.impact === "high" ? '#ef4444' : item.impact === "medium" ? '#3b82f6' : 'var(--text-muted)',
                    }}>{safeStr(item.impact)} impact</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-right">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {checked.size} / {tabs.reduce((a, t) => a + (t.items?.length || 0), 0)} completed
        </span>
      </div>
    </div>
  );
}

function FullResults({ results, scanId, pdfUrl }: { results: Record<string, unknown>; scanId: string; pdfUrl: string | null }) {
  const categoryResults = (results.category_results || {}) as Record<string, CategoryData>;
  const synthesis = (results.synthesis || {}) as SynthesisData;
  const hasPdf = typeof pdfUrl === "string" && pdfUrl.length > 0;

  const categoryLabels: Record<string, string> = {
    citability: "AI Citability",
    content_eeat: "Content & E-E-A-T",
    technical: "Technical SEO",
    schema: "Schema & Structured Data",
    platform: "Platform Optimization",
    brand: "Brand Authority",
  };

  return (
    <div className="space-y-8 mt-10">
      {/* PDF Download */}
      {hasPdf && (
        <div className="flex justify-end">
          <a href={`/api/scan/${scanId}/pdf`}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
            style={{ background: 'var(--accent)', color: 'var(--bg-void)', boxShadow: '0 0 20px var(--accent-dim)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download PDF Report
          </a>
        </div>
      )}

      {/* Executive Summary */}
      {synthesis.executive_summary && (
        <div id="executive-summary-full" className="rounded-xl p-6 scroll-mt-20" style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent)30' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--accent)' }}>Executive Summary</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>{safeStr(synthesis.executive_summary)}</p>
        </div>
      )}

      {/* Findings with severity tabs */}
      {synthesis.all_findings && synthesis.all_findings.length > 0 && (
        <div id="all-findings" className="rounded-xl p-6 scroll-mt-20" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>All Findings</h2>
          <SeverityTabs findings={synthesis.all_findings} />
        </div>
      )}

      {/* Category Deep Dives — full width cards */}
      {Object.entries(categoryResults).map(([category, catData]) => {
        if (!catData.analysis) return null;
        return (
          <div key={category} id={`cat-${category}`} className="rounded-xl p-6 scroll-mt-20" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{categoryLabels[category] || category}</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{safeStr(catData.analysis)}</p>

            {/* Schema code block */}
            {category === "schema" && catData.generated_schema && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Generated Schema (ready to paste)</h3>
                  <button onClick={() => navigator.clipboard.writeText(safeStr(catData.generated_schema))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer text-xs transition-all"
                    style={{ fontFamily: 'var(--font-mono)', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)25' }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    COPY
                  </button>
                </div>
                <pre className="p-5 rounded-lg overflow-x-auto text-sm" style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--text-secondary)',
                }}>
                  {safeStr(catData.generated_schema)}
                </pre>
              </div>
            )}

            {/* Rewrite suggestions */}
            {category === "citability" && catData.rewrite_suggestions && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Rewrite Suggestions</h3>
                {catData.rewrite_suggestions.map((rw, i) => (
                  <div key={i} className="rounded-lg p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{safeStr(rw.heading)}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                        <span className="text-xs font-bold block mb-1" style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>BEFORE</span>
                        <p className="text-sm" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{safeStr(rw.original_preview)}...</p>
                      </div>
                      <div className="p-3 rounded" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)20' }}>
                        <span className="text-xs font-bold block mb-1" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>AFTER</span>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{safeStr(rw.suggested_rewrite)}</p>
                      </div>
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{safeStr(rw.improvement_reason)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Action Plan with tabs + checkboxes */}
      {(synthesis.quick_wins || synthesis.medium_term || synthesis.strategic) && (
        <div id="action-plan" className="rounded-xl p-6 scroll-mt-20" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>30-Day Action Plan</h2>
          <ActionPlanTabs synthesis={synthesis} />
        </div>
      )}
    </div>
  );
}
