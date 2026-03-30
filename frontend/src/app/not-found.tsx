import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex-1 flex items-center justify-center relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 160px)" }}
    >
      {/* Grid background */}
      <div
        className="grid-bg absolute inset-0"
        style={{ opacity: 0.15 }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, var(--accent-dim) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Radar decoration */}
        <div className="animate-fade-up" style={{ animationDelay: "0s" }}>
          <svg viewBox="0 0 32 32" className="w-16 h-16 mb-6 opacity-40">
            <circle cx="16" cy="16" r="14" fill="none" stroke="var(--accent-dim)" strokeWidth="1" />
            <circle cx="16" cy="16" r="9" fill="none" stroke="var(--accent-dim)" strokeWidth="0.5" />
            <circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent-dim)" strokeWidth="0.5" />
            <line
              x1="16" y1="16" x2="16" y2="2"
              stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"
              style={{ transformOrigin: "16px 16px", animation: "radar-sweep 4s linear infinite" }}
            />
            <circle cx="16" cy="16" r="2" fill="var(--accent)" />
          </svg>
        </div>

        {/* 404 number */}
        <h1
          className="animate-fade-up glow-text"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(7rem, 20vw, 12rem)",
            fontWeight: 800,
            lineHeight: 1,
            color: "var(--accent-dim)",
            letterSpacing: "-0.04em",
            animationDelay: "0.1s",
          }}
        >
          404
        </h1>

        {/* Heading */}
        <h2
          className="animate-fade-up mt-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            animationDelay: "0.2s",
          }}
        >
          Page not found
        </h2>

        {/* Subtitle */}
        <p
          className="animate-fade-up mt-3"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            animationDelay: "0.3s",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Buttons */}
        <div
          className="animate-fade-up flex flex-wrap items-center justify-center gap-4 mt-8"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/"
            className="card-hover"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              background: "var(--accent)",
              color: "var(--bg-void)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.95rem",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            Go Home
          </Link>

          <Link
            href="/dashboard"
            className="card-hover"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.5rem",
              background: "transparent",
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.95rem",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              border: "1px solid var(--border)",
              transition: "border-color 0.2s ease, transform 0.2s ease",
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
