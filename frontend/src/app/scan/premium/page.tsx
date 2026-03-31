"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PremiumScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") || "";
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!code) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/promo/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, url: url.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/scan/${data.scanId}`);
    } catch {
      setError("Failed to start scan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 70%)' }} />

      <div className="relative max-w-2xl mx-auto px-6 pt-20 pb-16">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-secondary)', letterSpacing: '0.06em' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            PREMIUM SCAN &middot; CODE: {code}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Full GEO Audit
        </h1>
        <p className="text-center mb-10" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Deep analysis with Claude Sonnet 4.6 across all 6 categories.
          Enter the URL you want to analyze.
        </p>

        {/* Scan form */}
        <form onSubmit={handleSubmit}>
          <div className="animated-border rounded-xl">
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-3 p-2">
                <div className="hidden sm:flex items-center gap-1.5 pl-3"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-secondary)', opacity: 0.6 }}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  https://
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="enter your website URL"
                  className="flex-1 bg-transparent px-2 py-3 text-base outline-none placeholder:opacity-30"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 300, caretColor: 'var(--accent-secondary)' }}
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="flex items-center gap-2 px-6 py-3 font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap rounded-lg cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.06em',
                    background: loading ? 'rgba(108,99,255,0.4)' : 'var(--accent-secondary)',
                    color: 'white',
                    boxShadow: '0 0 24px rgba(108,99,255,0.3)',
                  }}>
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      ANALYZING
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      FULL AUDIT
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--danger)' }}>
              {error}
            </p>
          )}
        </form>

        {/* What's included */}
        <div className="mt-12">
          <p className="text-center mb-6" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
            WHAT&apos;S INCLUDED IN YOUR FULL AUDIT
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "AI Rewrite Suggestions" },
              { icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", label: "Generated Schema Code" },
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", label: "30-Day Action Plan" },
              { icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "PDF Report Download" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", label: "5 Platform Analysis" },
              { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", label: "Deep Technical Audit" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-lg"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          POWERED BY CLAUDE SONNET 4.6 &middot; UP TO 50 PAGES CRAWLED &middot; 6 ANALYSIS MODULES
        </p>
      </div>
    </div>
  );
}

export default function PremiumScanPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    }>
      <PremiumScanContent />
    </Suspense>
  );
}
