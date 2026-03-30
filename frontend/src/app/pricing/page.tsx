import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - GEO Scanner",
  description:
    "Simple, transparent pricing for AI search visibility analysis. Start with a free scan or unlock the full report for $5.",
};

const freeFeatures = [
  "Composite GEO score (0-100)",
  "Top 3 findings",
  "6-category breakdown",
  "AI crawler access map",
  "1 scan included",
];

const paidFeatures = [
  "Everything in Free, plus:",
  "AI rewrite suggestions",
  "Generated JSON-LD schema code",
  "30-day action plan",
  "Platform-specific optimization tips",
  "Deep technical audit",
  "Downloadable PDF report",
];


export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute inset-0 hero-glow opacity-40" />
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-dim), transparent 55%)",
          filter: "blur(100px)",
          animation: "orb-breathe 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[5%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--orb-secondary, rgba(108, 99, 255, 0.1)), transparent 60%)",
          filter: "blur(90px)",
          animation: "orb-breathe-alt 12s ease-in-out infinite",
        }}
      />

      {/* ===== HERO ===== */}
      <section className="relative pt-24 pb-4">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Status badge */}
          <div
            className="flex justify-center mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                letterSpacing: "0.04em",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{
                    background: "var(--accent)",
                    animation: "pulse-glow 2s ease-in-out infinite",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "var(--accent)" }}
                />
              </span>
              NO SUBSCRIPTIONS &middot; PAY PER REPORT
            </div>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up"
            style={{
              animationDelay: "0.2s",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ color: "var(--text-primary)" }}>Simple, </span>
            <span className="animated-gradient-text glow-text">
              transparent
            </span>
            <span style={{ color: "var(--text-primary)" }}> pricing</span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl animate-fade-up"
            style={{
              animationDelay: "0.3s",
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Start with a free scan to see your GEO score. Upgrade to the full
            report when you&apos;re ready to take action.
          </p>
        </div>
      </section>

      {/* ===== PRICING CARDS ===== */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {/* --- FREE CARD --- */}
            <div
              className="gradient-border glass-card rounded-xl p-8 flex flex-col card-hover"
              style={{ borderRadius: "12px" }}
            >
              {/* Plan name */}
              <div className="mb-6">
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    marginBottom: "0.75rem",
                  }}
                >
                  FREE SCAN
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "3rem",
                      color: "var(--text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    $0
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    marginTop: "0.5rem",
                  }}
                >
                  See where you stand with AI search engines
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border)",
                  marginBottom: "1.5rem",
                }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {freeFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: "var(--accent)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/sign-up"
                className="block w-full text-center py-3 rounded-lg transition-all duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                Get started
              </Link>
            </div>

            {/* --- FULL REPORT CARD --- */}
            <div
              className="animated-border rounded-xl flex flex-col card-hover"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="rounded-xl p-8 flex flex-col flex-1"
                style={{
                  background:
                    "var(--card-premium-bg, linear-gradient(135deg, rgba(11, 15, 26, 0.95), rgba(17, 24, 40, 0.85)))",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Badge */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      FULL REPORT
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.08em",
                        background: "var(--accent-dim)",
                        color: "var(--accent)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 600,
                      }}
                    >
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="glow-text"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "3rem",
                        color: "var(--accent)",
                        lineHeight: 1,
                      }}
                    >
                      $5
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      per report
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Everything you need to fix your AI visibility
                  </p>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, var(--accent-dim), var(--border), var(--accent-dim))",
                    marginBottom: "1.5rem",
                  }}
                />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {paidFeatures.map((feat, i) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3"
                      style={i === 0 ? { marginBottom: "0.25rem" } : undefined}
                    >
                      {i === 0 ? (
                        <svg
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: "var(--accent)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: "var(--accent-bright)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                      <span
                        style={{
                          color:
                            i === 0
                              ? "var(--text-secondary)"
                              : "var(--text-primary)",
                          fontSize: "0.9rem",
                          fontWeight: i === 0 ? 400 : 500,
                        }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/"
                  className="block w-full text-center py-3 rounded-lg transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "var(--bg-void)",
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-bright))",
                    boxShadow:
                      "0 0 20px var(--accent-dim), 0 4px 12px var(--shadow-heavy, rgba(0,0,0,0.3))",
                  }}
                >
                  Scan now
                </Link>
              </div>
            </div>
          </div>

          {/* ===== AGENCY COMPARISON ===== */}
          <div
            className="mt-10 text-center animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
              }}
            >
              AGENCIES CHARGE{" "}
              <span style={{ color: "var(--text-secondary)" }}>
                $2K&ndash;$12K/MONTH
              </span>{" "}
              FOR THIS &middot; YOU GET IT FOR{" "}
              <span style={{ color: "var(--accent)" }}>$5</span>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="text-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--bg-void)",
              background: "linear-gradient(135deg, var(--accent), var(--accent-bright))",
              boxShadow: "0 0 20px var(--accent-dim), 0 4px 12px var(--shadow-heavy, rgba(0,0,0,0.3))",
            }}
          >
            Try your free scan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            NO CREDIT CARD REQUIRED
          </p>
        </div>
      </section>
    </div>
  );
}
