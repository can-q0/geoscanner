/**
 * Payment trust signals displayed near $5 purchase CTAs.
 * Renders: Secure payment (lock), Instant access (lightning), Money-back guarantee (shield).
 */
export default function TrustIndicators() {
  return (
    <div
      className="flex items-center justify-center flex-wrap"
      style={{
        gap: '1.25rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.03em',
      }}
    >
      <span className="flex items-center gap-1.5">
        {/* Lock icon */}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--accent)', opacity: 0.5 }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        Secure payment
      </span>

      <span className="flex items-center gap-1.5">
        {/* Lightning bolt icon */}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--accent)', opacity: 0.5 }}
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Instant access
      </span>

      <span className="flex items-center gap-1.5">
        {/* Shield/check icon */}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--accent)', opacity: 0.5 }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        Money-back guarantee
      </span>
    </div>
  );
}
