"use client";

import TrustIndicators from "@/components/TrustIndicators";

interface BlurredSectionProps {
  scanId: string;
  onUnlock: () => void;
}

export default function BlurredSection({ scanId, onUnlock }: BlurredSectionProps) {
  return (
    <div className="relative mt-10 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {/* Placeholder content */}
      <div className="blur-[6px] pointer-events-none select-none p-8" aria-hidden="true"
        style={{ background: 'var(--bg-surface)' }}>
        <div className="space-y-6">
          <div className="rounded-lg p-5" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="h-3 w-32 rounded mb-4" style={{ background: 'var(--accent-dim)' }} />
            <div className="space-y-2">
              <div className="h-2 w-full rounded" style={{ background: 'var(--border)' }} />
              <div className="h-2 w-4/5 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-2 w-11/12 rounded" style={{ background: 'var(--border)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: i <= 2 ? 'var(--danger)' : 'var(--warning)' }} />
                  <div className="h-2 w-24 rounded" style={{ background: 'var(--border)' }} />
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded" style={{ background: 'var(--border)' }} />
                  <div className="h-1.5 w-3/4 rounded" style={{ background: 'var(--border)' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-5" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="h-3 w-40 rounded mb-4" style={{ background: 'var(--accent-dim)' }} />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded" style={{ border: '1px solid var(--border)' }} />
                  <div className="h-2 flex-1 rounded" style={{ background: 'var(--border)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, var(--bg-void)90 0%, var(--bg-void)ee 30%, var(--bg-void)f5 100%)' }}>
        <div className="text-center max-w-md px-6">
          {/* Lock icon */}
          <div className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)30' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Unlock Full Report
          </h3>
          <p className="mb-6" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Detailed findings, AI rewrite suggestions, generated Schema code,
            30-day action plan, and downloadable PDF.
          </p>

          <button onClick={onUnlock}
            className="cursor-pointer px-8 py-3.5 font-semibold transition-all rounded-lg"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              background: 'var(--accent)',
              color: 'var(--bg-void)',
              boxShadow: '0 0 30px var(--accent-dim), 0 4px 20px var(--accent-dim)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 50px var(--accent-dim), 0 4px 30px var(--accent-dim)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 30px var(--accent-dim), 0 4px 20px var(--accent-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get Full Report &mdash; $5
          </button>

          <p className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            ONE-TIME PAYMENT &middot; INSTANT ACCESS &middot; PDF INCLUDED
          </p>

          <div className="mt-4">
            <TrustIndicators />
          </div>
        </div>
      </div>
    </div>
  );
}
