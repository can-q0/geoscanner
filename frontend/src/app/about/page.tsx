import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - GEO Scanner",
  description:
    "GEO Scanner provides signal intelligence for the AI search era. Understand and optimize your website's visibility across AI-powered search engines.",
};

const dimensions = [
  {
    label: "AI Crawler Access",
    desc: "Which of 14+ AI crawlers can reach your site",
  },
  {
    label: "Content Citability",
    desc: "How likely AI systems are to quote your content",
  },
  {
    label: "Structured Data",
    desc: "Schema.org markup that machines can parse",
  },
  {
    label: "Technical Infrastructure",
    desc: "SSR, performance, and crawlability signals",
  },
  {
    label: "Platform Readiness",
    desc: "Optimization for ChatGPT, Perplexity, Gemini & more",
  },
  {
    label: "Authority Signals",
    desc: "E-E-A-T and brand presence across the AI web",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute inset-0 hero-glow opacity-40" />
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-dim), transparent 55%)",
          filter: "blur(100px)",
          animation: "orb-breathe 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[15%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--orb-secondary, rgba(108, 99, 255, 0.1)), transparent 60%)",
          filter: "blur(90px)",
          animation: "orb-breathe-alt 12s ease-in-out infinite",
        }}
      />

      {/* ===== HERO ===== */}
      <section className="relative pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Badge */}
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
                fontSize: "0.7rem",
                color: "var(--text-secondary)",
                letterSpacing: "0.06em",
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
              ABOUT GEO SCANNER
            </div>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up"
            style={{
              animationDelay: "0.2s",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ color: "var(--text-primary)" }}>
              Signal Intelligence for the{" "}
            </span>
            <span className="animated-gradient-text glow-text">
              AI Search Era
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up"
            style={{
              animationDelay: "0.3s",
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              fontWeight: 300,
              fontFamily: "var(--font-body)",
            }}
          >
            AI is replacing traditional search. Sessions referred by AI have
            grown{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              527%
            </strong>{" "}
            in a single year. Yet only{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              11%
            </strong>{" "}
            of domains are cited by both ChatGPT and Google AI Overviews. The
            rest are invisible.
          </p>

          <p
            className="mx-auto mt-4 max-w-2xl animate-fade-up"
            style={{
              animationDelay: "0.4s",
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              fontWeight: 300,
              fontFamily: "var(--font-body)",
            }}
          >
            GEO Scanner helps businesses understand where they stand in this new
            landscape and what to do about it. We analyze your website across
            every dimension that matters for AI search visibility and give you a
            clear, actionable roadmap.
          </p>
        </div>
      </section>

      {/* ===== WHAT WE ANALYZE ===== */}
      <section
        className="relative py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="text-center mb-14 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
              }}
            >
              ANALYSIS FRAMEWORK
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Six dimensions of AI visibility
            </h2>
            <p
              className="mx-auto mt-3 max-w-xl"
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
              }}
            >
              Every scan evaluates your website across six critical categories
              that determine whether AI systems can find, understand, and cite
              your content.
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            {dimensions.map((dim) => (
              <div
                key={dim.label}
                className="glass-card rounded-lg p-5 card-hover"
                style={{ borderRadius: "10px" }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {dim.label}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {dim.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BUILT WITH ===== */}
      <section
        className="relative py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="text-center animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
              }}
            >
              TECHNOLOGY
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Built on cutting-edge AI analysis
            </h2>
          </div>

          <div
            className="mt-10 space-y-6 animate-fade-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div
              className="glass-card rounded-lg p-6"
              style={{ borderRadius: "10px" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "var(--accent-dim)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Powered by Claude API
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    Our analysis engine is built on Anthropic&apos;s Claude API,
                    delivering deep, nuanced understanding of your content that
                    goes far beyond surface-level keyword checks. Every scan
                    produces intelligent, contextual recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="glass-card rounded-lg p-6"
              style={{ borderRadius: "10px" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "var(--accent-dim)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.73-3.56"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    14+ AI crawlers, 5 platforms
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    We scan your site against every major AI crawler
                    &mdash; GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
                    and more &mdash; and evaluate visibility across ChatGPT,
                    Perplexity, Gemini, Google AI Overviews, and Bing Copilot.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="glass-card rounded-lg p-6"
              style={{ borderRadius: "10px" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "var(--accent-dim)",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Results in under 60 seconds
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    Our parallelized analysis pipeline delivers comprehensive
                    results fast. No waiting days for an agency audit &mdash; get
                    your full GEO score and actionable recommendations in under a
                    minute.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section
        className="relative py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="animate-fade-up" style={{ animationDelay: "0.9s" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to see where you stand?
            </h2>
            <p
              className="mx-auto mt-3 max-w-lg"
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
              }}
            >
              Run your first scan for free. No credit card required, no
              strings attached. Find out how visible your website is to AI
              search engines in under 60 seconds.
            </p>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg transition-all duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "var(--bg-void)",
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-bright))",
                  boxShadow:
                    "0 0 20px var(--accent-dim), 0 4px 12px var(--shadow-heavy, rgba(0,0,0,0.3))",
                }}
              >
                Start your free scan
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            <p
              className="mt-4"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
              }}
            >
              NO CREDIT CARD REQUIRED
            </p>
          </div>

          {/* Contact */}
          <div className="mt-14">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              Questions? Reach out at{" "}
              <a
                href="mailto:hello@geoscanner.ai"
                style={{ color: "var(--accent)" }}
              >
                hello@geoscanner.ai
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
