"use client";

export default function PremiumScanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--danger)', fontSize: '1rem' }}>
            Something went wrong.
          </p>
          <p className="mb-6" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            {error.message || "Unknown error"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg cursor-pointer"
              style={{ background: 'var(--accent)', color: 'var(--bg-void)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            >
              Try Again
            </button>
            <a href="/" className="px-4 py-2 rounded-lg"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
