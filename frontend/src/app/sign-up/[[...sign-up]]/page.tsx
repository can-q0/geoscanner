import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      {/* Background effects */}
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-dim) 0%, transparent 70%)",
        }}
      />

      {/* Back to home */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.03em",
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Main content: two-column on desktop */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Left column: benefits */}
        <div className="flex-1 max-w-lg lg:pt-8">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              lineHeight: 1.15,
            }}
          >
            Start scanning in{" "}
            <span className="animated-gradient-text">60 seconds</span>
          </h1>
          <p
            className="text-base mb-10"
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            See how AI engines perceive your brand — and what to fix.
          </p>

          <div className="flex flex-col gap-5">
            <BenefitItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              }
              text="Free AI visibility score for your website"
            />
            <BenefitItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              }
              text="See how ChatGPT, Perplexity & Google AI see your brand"
            />
            <BenefitItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              }
              text="Get actionable fixes to boost AI citations"
            />
            <BenefitItem
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              }
              text="Full reports with schema code & rewrite suggestions"
            />
          </div>

          {/* Social proof */}
          <div
            className="mt-10 pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p
              className="text-sm"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
              }}
            >
              FREE TIER INCLUDES 3 SCANS / MONTH
            </p>
          </div>
        </div>

        {/* Right column: Clerk form */}
        <div className="flex-shrink-0">
          <SignUp />
        </div>
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="var(--accent)"
          strokeWidth={1.5}
        >
          {icon}
        </svg>
      </div>
      <p
        className="text-sm pt-2"
        style={{
          color: "var(--text-primary)",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </div>
  );
}
