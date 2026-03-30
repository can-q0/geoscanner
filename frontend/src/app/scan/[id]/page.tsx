"use client";

import { use } from "react";
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
          <ScanProgress progress={scan.progress ?? 0} domain={scan.domain || "..."} />
        </div>
      </div>
    );
  }

  // Pending payment state - user used their free scan, this URL needs purchase
  if (scan.status === "pending_payment") {
    const handleBuyReport = async () => {
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
            <p className="text-gray-400 text-sm mb-4">{scan.errorMessage}</p>
            <button onClick={() => router.push("/")} className="text-emerald-400 hover:underline">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed state
  const summary = scan.scoresSummary as {
    scores?: Record<string, number>;
    summary?: string;
    top_findings?: string[];
    score_label?: string;
    crawler_status?: Record<string, string>;
    llmstxt_exists?: boolean;
  } | null;

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
      <div className={`max-w-4xl mx-auto px-6 py-10${showToc ? " has-toc" : ""}`}>
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
          <div id="executive-summary" className="rounded-lg bg-gray-900 border border-gray-800 p-6 mb-6 scroll-mt-20">
            <h2 className="text-lg font-semibold mb-3">Executive Summary</h2>
            <p className="text-gray-300 leading-relaxed">{summary.summary}</p>
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
                        textShadow: isBlurred ? '0 0 8px rgba(255,255,255,0.3)' : 'none',
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
          <div id="crawler-access" className="rounded-lg bg-gray-900 border border-gray-800 p-6 mb-6 scroll-mt-20">
            <h2 className="text-lg font-semibold mb-3">AI Crawler Access</h2>
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
                  <span className="text-gray-400">{crawler}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid content section */}
        {/* TODO: re-enable payment wall after testing */}
        {scan.isPaid && scan.resultsFull ? (
          <FullResults results={scan.resultsFull as Record<string, unknown>} scanId={scan.id} pdfUrl={scan.pdfUrl} />
        ) : null}
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

function FullResults({ results, scanId, pdfUrl }: { results: Record<string, unknown>; scanId: string; pdfUrl: string | null }) {
  const categoryResults = (results.category_results || {}) as Record<string, CategoryData>;
  const synthesis = (results.synthesis || {}) as SynthesisData;
  const hasPdf = typeof pdfUrl === "string" && pdfUrl.length > 0;

  return (
    <div className="space-y-6 mt-8">
      {/* PDF Download */}
      {hasPdf && (
        <div className="flex justify-end">
          <a
            href={`/api/scan/${scanId}/pdf`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition"
          >
            Download PDF Report
          </a>
        </div>
      )}

      {/* Executive Summary */}
      {synthesis.executive_summary && (
        <div className="rounded-lg bg-gray-900 border border-emerald-800/50 p-6 scroll-mt-20">
          <h2 className="text-lg font-semibold mb-3 text-emerald-400">Full Executive Summary</h2>
          <p className="text-gray-300 leading-relaxed">{synthesis.executive_summary}</p>
        </div>
      )}

      {/* All Findings */}
      {synthesis.all_findings && (
        <div className="rounded-lg bg-gray-900 border border-gray-800 p-6 scroll-mt-20">
          <h2 className="text-lg font-semibold mb-4">All Findings</h2>
          <div className="space-y-3">
            {synthesis.all_findings!.map((finding, i) => (
              <div key={i} className="border-l-2 pl-4 py-1" style={{
                borderColor: finding.severity === "critical" ? "var(--danger, #ef4444)" : finding.severity === "high" ? "var(--warning, #f59e0b)" : finding.severity === "medium" ? "var(--score-blue, #3b82f6)" : "var(--text-muted, #6b7280)",
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    finding.severity === "critical" ? "bg-red-500/20 text-red-400" :
                    finding.severity === "high" ? "bg-amber-500/20 text-amber-400" :
                    finding.severity === "medium" ? "bg-blue-500/20 text-blue-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {finding.severity?.toUpperCase()}
                  </span>
                  {finding.category && <span className="text-xs text-gray-500">{finding.category}</span>}
                </div>
                <p className="text-white text-sm font-medium">{finding.title}</p>
                <p className="text-gray-400 text-sm mt-1">{finding.description}</p>
                {finding.fix && <p className="text-emerald-400 text-sm mt-1">Fix: {finding.fix}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Deep Dives */}
      {(() => {
        let isFirst = true;
        return Object.entries(categoryResults).map(([category, catData]) => {
          if (!catData.analysis) return null;
          const labels: Record<string, string> = {
            citability: "AI Citability Analysis",
            content_eeat: "Content & E-E-A-T Analysis",
            technical: "Technical SEO Analysis",
            schema: "Schema & Structured Data",
            platform: "Platform Optimization",
          };
          let sectionId: string | undefined;
          if (category === "schema") {
            sectionId = "schema-code";
          } else if (isFirst) {
            sectionId = "category-details";
            isFirst = false;
          }
          return (
            <div key={category} id={sectionId} className="rounded-lg bg-gray-900 border border-gray-800 p-6 scroll-mt-20">
              <h2 className="text-lg font-semibold mb-3">{labels[category] || category}</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{catData.analysis}</p>

            {/* Schema: show generated code */}
            {category === "schema" && catData.generated_schema && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-emerald-400 mb-2">Generated Schema (ready to paste)</h3>
                <CodeBlock code={catData.generated_schema} language="json-ld" />
              </div>
            )}

            {/* Citability: show rewrite suggestions */}
            {category === "citability" && catData.rewrite_suggestions && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-medium text-emerald-400">Rewrite Suggestions</h3>
                {catData.rewrite_suggestions!.map((rw, i) => (
                  <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">{rw.heading}</p>
                    <p className="text-sm text-gray-400 mb-2">Original: {rw.original_preview}...</p>
                    <p className="text-sm text-emerald-300">{rw.suggested_rewrite}</p>
                    <p className="text-xs text-gray-500 mt-1">{rw.improvement_reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      });
      })()}

      {/* Action Plan */}
      {(synthesis.quick_wins || synthesis.medium_term || synthesis.strategic) && (
        <div id="action-plan" className="rounded-lg bg-gray-900 border border-gray-800 p-6 scroll-mt-20">
          <h2 className="text-lg font-semibold mb-4">Action Plan</h2>

          {synthesis.quick_wins && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-emerald-400 mb-3">Quick Wins (under 4 hours)</h3>
              <div className="space-y-2">
                {synthesis.quick_wins!.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-emerald-400 mt-0.5">&#10003;</span>
                    <div>
                      <span className="text-white">{item.action}</span>
                      <span className="text-gray-500 ml-2">({item.effort})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {synthesis.medium_term && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-blue-400 mb-3">Medium-Term (1-2 weeks)</h3>
              <div className="space-y-2">
                {synthesis.medium_term!.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-blue-400 mt-0.5">&#9679;</span>
                    <div>
                      <span className="text-white">{item.action}</span>
                      <span className="text-gray-500 ml-2">({item.effort})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {synthesis.strategic && (
            <div>
              <h3 className="text-sm font-medium text-purple-400 mb-3">Strategic (1-3 months)</h3>
              <div className="space-y-2">
                {synthesis.strategic!.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-purple-400 mt-0.5">&#9670;</span>
                    <div>
                      <span className="text-white">{item.action}</span>
                      <span className="text-gray-500 ml-2">({item.effort})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
