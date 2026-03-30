import { auth } from "@clerk/nextjs/server";
import ScanForm from "@/components/ScanForm";
import MockPreview from "@/components/MockPreview";
import PlatformTicker from "@/components/PlatformTicker";
import WorkflowSection from "@/components/WorkflowSection";
import AIPerceptionDemo from "@/components/AIPerceptionDemo";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Link from "next/link";

const categories = [
  { title: "AI Citability", desc: "Are your content blocks structured for AI to extract and cite? Optimal passages are 134-167 words, self-contained, and fact-rich.", weight: "25%", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { title: "Brand Authority", desc: "Brand mentions on YouTube, Reddit, and Wikipedia correlate 3x stronger with AI visibility than backlinks.", weight: "20%", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { title: "Content E-E-A-T", desc: "Experience, Expertise, Authoritativeness, Trustworthiness - the signals AI systems use to decide what to cite.", weight: "20%", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Technical Foundation", desc: "AI crawlers see raw HTML only. If your content is JavaScript-rendered, AI engines might not see it at all.", weight: "15%", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { title: "Schema & Structured Data", desc: "JSON-LD markup with sameAs links helps AI systems verify your entity and connect information about your brand.", weight: "10%", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
  { title: "Platform Optimization", desc: "Only 11% of domains are cited by both ChatGPT and Google AI Overviews. Each platform needs its own strategy.", weight: "10%", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
];


const aiPlatforms = [
  {
    name: "ChatGPT",
    logo: "/logos/chatgpt.png",
    logoInvert: true,
    users: "300M+ weekly users",
    desc: "OpenAI's model pulls from web sources it deems authoritative. It favors pages with clear entity markup, Wikipedia references, and structured content that answers questions directly.",
    signals: [
      { label: "Entity disambiguation", detail: "sameAs links, Knowledge Graph presence" },
      { label: "Content structure", detail: "H2/H3 hierarchy, answer-first formatting" },
      { label: "Brand authority", detail: "Wikipedia, Reddit, YouTube mentions" },
      { label: "Self-contained passages", detail: "134–167 word blocks with factual claims" },
    ],
    stat: "0.737",
    statLabel: "brand mention correlation",
  },
  {
    name: "Google AI Overviews",
    logo: null,
    logoSvg: true,
    users: "Billions of searches/day",
    desc: "Google's AI snippets pull from indexed pages in real-time. Schema markup, topic cluster authority, and traditional SEO signals all feed into which content gets featured in the AI overview panel.",
    signals: [
      { label: "Schema markup", detail: "JSON-LD Organization, Article, FAQ" },
      { label: "Topic authority", detail: "Content depth, internal linking clusters" },
      { label: "Page experience", detail: "Core Web Vitals, mobile-first, HTTPS" },
      { label: "E-E-A-T signals", detail: "Author pages, credentials, cited sources" },
    ],
    stat: "57%",
    statLabel: "of queries show AI overviews",
  },
  {
    name: "Perplexity",
    logo: "/logos/perplexity.png",
    users: "100M+ monthly queries",
    desc: "Perplexity cites specific passages inline with numbered references. It strongly prefers self-contained paragraphs with statistics, named sources, and clear factual claims over generic marketing copy.",
    signals: [
      { label: "Passage citability", detail: "Optimal 134–167 words, fact-dense" },
      { label: "Source attribution", detail: "Named studies, data with context" },
      { label: "Content freshness", detail: "Recent publication dates, updated data" },
      { label: "Structural clarity", detail: "Numbered lists, definition patterns" },
    ],
    stat: "3x",
    statLabel: "more citations from structured content",
  },
  {
    name: "Gemini",
    logo: "/logos/gemini.png",
    users: "Integrated in Google products",
    desc: "Gemini leverages Google's Knowledge Graph and Search index. Brands with strong sameAs links, consistent structured data across properties, and verified entity information rank highest.",
    signals: [
      { label: "Knowledge Graph", detail: "Wikidata entity, sameAs cross-references" },
      { label: "Structured data", detail: "Organization, Product, SoftwareApplication" },
      { label: "Brand consistency", detail: "Same name/logo/description everywhere" },
      { label: "Multi-platform presence", detail: "YouTube, LinkedIn, GitHub profiles" },
    ],
    stat: "11%",
    statLabel: "domain overlap with ChatGPT citations",
  },
  {
    name: "Copilot",
    logo: "/logos/copilot.webp",
    users: "Powered by Bing index",
    desc: "Microsoft's Copilot uses Bing's web index with a preference for fast-loading, technically clean pages. Well-attributed content with clear authorship and factual density gets prioritized.",
    signals: [
      { label: "Technical SEO", detail: "SSR content, clean HTML, security headers" },
      { label: "Load performance", detail: "Sub-2s LCP, optimized Core Web Vitals" },
      { label: "Content attribution", detail: "Author bylines, source citations" },
      { label: "IndexNow support", detail: "Real-time content indexing via API" },
    ],
    stat: "40%",
    statLabel: "of Copilot answers cite top-3 Bing results",
  },
];

const stats = [
  { value: "+527%", label: "AI-referred sessions growth", sub: "2025" },
  { value: "4.4x", label: "Higher conversion from AI traffic", sub: "vs organic" },
  { value: "-50%", label: "Traditional search decline", sub: "Gartner 2028" },
  { value: "23%", label: "Marketers investing in GEO", sub: "early adopter window" },
];


const reportFeatures = [
  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "AI Rewrite Suggestions", desc: "Exact rewrites for your lowest-scoring content blocks" },
  { icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", title: "Generated Schema Code", desc: "Ready-to-paste JSON-LD tailored to your business" },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "30-Day Action Plan", desc: "Quick wins, medium-term fixes, strategic initiatives" },
  { icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "PDF Report", desc: "Client-ready PDF with gauges, charts, executive summary" },
  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", title: "Platform-Specific Tips", desc: "Separate strategy per AI engine: GPT, Perplexity, Gemini" },
  { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", title: "Deep Technical Audit", desc: "SSR, security headers, crawler map, Core Web Vitals" },
];

function scoreColor(score: number) {
  if (score >= 80) return "var(--accent)";
  if (score >= 60) return "var(--score-blue, #3b82f6)";
  if (score >= 40) return "var(--warning)";
  return "var(--danger)";
}

export default async function Home() {
  const { userId } = await auth();

  // Signed-in view: scan tool + recent scans
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    const recentScans = user
      ? await prisma.scan.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [];

    const hasScanned = recentScans.length > 0;
    const hasPaidScan = recentScans.some((s) => s.isPaid);

    return (
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute inset-0 hero-glow opacity-40" />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)', animation: 'orb-breathe 8s ease-in-out infinite' }} />
        <div className="absolute top-60 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--orb-secondary, rgba(108,99,255,0.08)) 0%, transparent 70%)', animation: 'orb-breathe-alt 6s ease-in-out infinite' }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-16">

          {/* === SCAN SECTION === */}
          <section className="mb-16">
            <div className="flex justify-center mb-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
                </span>
                SCANNER ONLINE &middot; 6 AI ANALYSIS MODULES READY
              </div>
            </div>

            <h1 className="text-center animate-fade-up" style={{ animationDelay: '0.1s', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              <span style={{ color: 'var(--text-primary)' }}>Run </span>
              <span className="animated-gradient-text">AI Visibility</span>
              <span style={{ color: 'var(--text-primary)' }}> Analysis</span>
            </h1>

            <p className="text-center mt-3 mb-8 animate-fade-up" style={{ animationDelay: '0.15s', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Scan any website across 14 AI crawlers and 5 platforms in under 60 seconds
            </p>

            {/* Scan form with animated border */}
            <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="animated-border rounded-xl">
                <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                  <ScanForm />
                </div>
              </div>
            </div>

            {/* Analysis modules strip */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {categories.map((cat) => (
                <div key={cat.title} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.04em' }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                  </svg>
                  {cat.title.toUpperCase()}
                </div>
              ))}
            </div>
          </section>

          {/* === RECENT SCANS === */}
          {hasScanned && (
            <section className="mb-16 animate-fade-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    Intelligence Feed
                  </h2>
                </div>
                <Link href="/dashboard" className="hover:underline"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.06em' }}>
                  ALL SCANS &rarr;
                </Link>
              </div>

              <div className="space-y-2">
                {recentScans.map((scan, i) => (
                  <Link key={scan.id} href={`/scan/${scan.id}`}
                    className="group flex items-center justify-between p-4 rounded-lg transition-all animate-fade-up"
                    style={{ animationDelay: `${0.4 + i * 0.05}s`, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          border: scan.status === "completed" && scan.geoScore !== null
                            ? `2px solid ${scoreColor(scan.geoScore)}` : '2px solid var(--border)',
                          background: 'var(--bg-elevated)',
                        }}>
                        {scan.status === "completed" && scan.geoScore !== null ? (
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: scoreColor(scan.geoScore) }}>
                            {scan.geoScore}
                          </span>
                        ) : scan.status === "processing" ? (
                          <svg className="animate-spin h-5 w-5" style={{ color: 'var(--warning)' }} viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>--</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {scan.domain}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                            {new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          {scan.isPaid ? (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.06em', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '1px 6px', borderRadius: '3px' }}>
                              FULL REPORT
                            </span>
                          ) : scan.status === "completed" ? (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.06em', background: 'var(--accent-secondary-dim, rgba(108,99,255,0.15))', color: 'var(--accent-secondary)', padding: '1px 6px', borderRadius: '3px' }}>
                              UPGRADE AVAILABLE
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* === FULL REPORT VALUE PROP === */}
          {!hasPaidScan && (
            <section className="mb-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="animated-border rounded-xl">
                <div className="rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="group px-6 py-5 flex items-center justify-between transition-all"
                    style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-5 rounded-full transition-all" style={{ background: 'var(--accent-secondary)' }} />
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                          Unlock Full Intelligence
                        </h2>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                        Your free scan shows the score. The full report shows exactly how to fix it.
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="glow-text transition-all" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--accent)' }}>$5</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>PER REPORT</div>
                    </div>
                  </div>

                  {/* Features grid */}
                  <div className="p-6" style={{ background: 'var(--bg-surface)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {reportFeatures.map((feat, i) => (
                        <div key={feat.title}
                          className="group/feat flex gap-3 p-3 rounded-lg animate-fade-up cursor-default transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_-12px_var(--accent-dim)]"
                          style={{
                            animationDelay: `${0.55 + i * 0.05}s`,
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            transitionProperty: 'transform, box-shadow, border-color',
                          }}>
                          <div className="shrink-0 mt-0.5">
                            <div className="p-1.5 rounded transition-all duration-300 group-hover/feat:shadow-[0_0_12px_var(--accent-dim)]"
                              style={{ background: 'var(--accent-dim)' }}>
                              <svg className="w-4 h-4 transition-transform duration-300 group-hover/feat:scale-110" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p className="transition-colors duration-300 group-hover/feat:text-[var(--accent)]"
                              style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                              {feat.title}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feat.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comparison bar */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                      <div className="flex items-center gap-2 opacity-50">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>FREE: Score + Top 3 Findings</span>
                      </div>
                      <div style={{ color: 'var(--border)' }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full score-bar-fill" />
                        <span style={{ color: 'var(--accent)' }}>FULL: 6 Deep Analyses + Rewrites + Schema + PDF</span>
                      </div>
                    </div>

                    {/* Social proof */}
                    <div className="mt-5 text-center">
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                        AGENCIES CHARGE $2K&ndash;$12K/MONTH FOR THIS &middot; YOU GET IT FOR $5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* === ANALYSIS MODULES === */}
          <section className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                Analysis Modules
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat, i) => (
                <div key={cat.title} className="glass-card rounded-lg p-4 card-hover animate-fade-up"
                  style={{ animationDelay: `${0.65 + i * 0.05}s`, borderRadius: '10px' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-1.5 rounded" style={{ background: 'var(--accent-dim)' }}>
                      <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                      </svg>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 600 }}>{cat.weight}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.55 }}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    );
  }

  // Signed-out view: full marketing landing page
  return (
    <div className="relative overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[80vh] flex items-center">
        {/* BG: Grid */}
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* BG: Multi-layer glow */}
        <div className="absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse 80% 60% at 50% -20%, var(--accent-dim) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 40% at 25% 0%, var(--orb-secondary, rgba(108, 99, 255, 0.08)) 0%, transparent 50%)',
            'radial-gradient(ellipse 50% 40% at 75% 0%, var(--orb-accent, rgba(14, 244, 197, 0.06)) 0%, transparent 50%)',
          ].join(', ')
        }} />

        {/* BG: Radar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: '650px', height: '650px', opacity: 0.05 }}>
          <svg viewBox="0 0 650 650" className="w-full h-full">
            <circle cx="325" cy="325" r="90" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
            <circle cx="325" cy="325" r="180" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
            <circle cx="325" cy="325" r="270" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
            <line x1="325" y1="25" x2="325" y2="625" stroke="var(--accent)" strokeWidth="0.3" />
            <line x1="25" y1="325" x2="625" y2="325" stroke="var(--accent)" strokeWidth="0.3" />
            <line x1="325" y1="325" x2="325" y2="55" stroke="var(--accent-bright)" strokeWidth="1.5" strokeLinecap="round"
              style={{ transformOrigin: '325px 325px', animation: 'radar-sweep 8s linear infinite' }} />
          </svg>
        </div>

        {/* BG: Orbs */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--accent-dim), transparent 55%)', filter: 'blur(100px)', animation: 'orb-breathe 8s ease-in-out infinite' }} />
        <div className="absolute top-[0%] left-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--orb-secondary-strong, rgba(108, 99, 255, 0.12)), transparent 60%)', filter: 'blur(90px)', animation: 'orb-breathe-alt 12s ease-in-out infinite' }} />

        {/* BG: Scan sweep lines */}
        <div className="absolute h-[1px] w-[30%] pointer-events-none" style={{ top: '30%', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'sweep-x 5s ease-in-out infinite', opacity: 0.4 }} />
        <div className="absolute h-[1px] w-[20%] pointer-events-none" style={{ top: '70%', background: 'linear-gradient(90deg, transparent, var(--accent-secondary), transparent)', animation: 'sweep-x 7s ease-in-out infinite 2.5s', opacity: 0.25 }} />

        {/* BG: Particles */}
        <div className="particle" style={{ left: '12%', bottom: '0', animationDuration: '9s', animationDelay: '0s' }} />
        <div className="particle" style={{ left: '28%', bottom: '0', animationDuration: '11s', animationDelay: '2s' }} />
        <div className="particle" style={{ left: '44%', bottom: '0', animationDuration: '8s', animationDelay: '4.5s' }} />
        <div className="particle" style={{ left: '62%', bottom: '0', animationDuration: '10s', animationDelay: '1.5s' }} />
        <div className="particle" style={{ left: '78%', bottom: '0', animationDuration: '12s', animationDelay: '3s' }} />
        <div className="particle" style={{ left: '92%', bottom: '0', animationDuration: '9s', animationDelay: '6s' }} />

        {/* Content */}
        <div className="relative w-full max-w-5xl mx-auto px-6 py-24">
          {/* Status badge */}
          <div className="flex justify-center mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
              </span>
              SCANNING 14+ AI CRAWLERS ACROSS 5 PLATFORMS
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center animate-fade-up" style={{ animationDelay: '0.2s', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            <span style={{ color: 'var(--text-primary)' }}>Is Your Website </span>
            <br />
            <span className="animated-gradient-text glow-text">Visible to AI?</span>
          </h1>

          <p className="text-center mx-auto mt-6 max-w-2xl animate-fade-up" style={{ animationDelay: '0.3s', color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.7, fontWeight: 300 }}>
            ChatGPT, Perplexity, Google AI Overviews, and Gemini are replacing traditional search.
            Discover whether AI engines can find, understand, and cite your content.
          </p>

          {/* Scan form */}
          <div className="mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <ScanForm />
          </div>

          <p className="text-center mt-5 animate-fade-up" style={{ animationDelay: '0.5s', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            1 FREE SCAN &middot; FULL REPORTS AVAILABLE &middot; RESULTS IN 60 SECONDS
          </p>
        </div>
      </section>

      {/* ===== AI PLATFORM TICKER ===== */}
      <section className="relative py-8 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <p className="text-center mb-5" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
          MAKE YOUR BRAND VISIBLE IN
        </p>
        <PlatformTicker />
      </section>

      {/* ===== LIVE PREVIEW ===== */}
      <section className="relative py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-center mb-8" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
            SEE WHAT YOU&apos;LL GET
          </p>
          <MockPreview />
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-up" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', color: 'var(--accent)', letterSpacing: '-0.02em' }}>
                  {stat.value}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{stat.label}</p>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em', marginTop: '0.15rem' }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="relative max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            COMPOSITE GEO SCORE
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            6 Dimensions of AI Visibility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div key={cat.title} className="card-hover gradient-border rounded-xl p-6 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s`, background: 'var(--bg-surface)', borderRadius: '12px' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ background: 'var(--accent-dim)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {cat.weight}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {cat.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works - interactive */}
      <WorkflowSection />

      {/* How AI models see your brand */}
      <section className="relative py-24" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(108,99,255,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
              AI PERCEPTION ANALYSIS
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              How AI Models See Your Brand
            </h2>
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
              AI can&apos;t cite what it can&apos;t understand. Your site structure determines
              whether AI recommends you or ignores you entirely.
            </p>
          </div>

          {/* Live AI response simulation */}
          <div className="mb-16">
            <AIPerceptionDemo />
          </div>

          {/* Platform cards — stacked full-width */}
          <div className="space-y-5">
            {aiPlatforms.map((platform, i) => (
              <div key={platform.name} className="card-hover rounded-xl overflow-hidden animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.1}s`, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                <div className="flex flex-col lg:flex-row">

                  {/* Left: header + description */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Logo */}
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        {platform.logo ? (
                          <Image
                            src={platform.logo}
                            alt={platform.name}
                            width={32}
                            height={32}
                            className={`w-8 h-8 object-contain${'logoInvert' in platform && platform.logoInvert ? ' brightness-0 invert' : ''}`}
                          />
                        ) : 'logoSvg' in platform && platform.logoSvg ? (
                          <svg viewBox="0 0 24 24" className="w-8 h-8">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        ) : null}
                      </div>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                          {platform.name}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                          {platform.users}
                        </p>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                      {platform.desc}
                    </p>

                    {/* Key stat */}
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>
                        {platform.stat}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                        {platform.statLabel}
                      </span>
                    </div>
                  </div>

                  {/* Right: signal checklist */}
                  <div className="lg:w-[380px] shrink-0 p-6 lg:p-8 lg:pl-0">
                    <p className="mb-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                      WHAT WE CHECK
                    </p>
                    <div className="space-y-3">
                      {platform.signals.map((signal) => (
                        <div key={signal.label} className="flex items-start gap-3">
                          <div className="mt-1 shrink-0">
                            <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                              {signal.label}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                              {signal.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Bottom stat */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--accent)' }}>5</span>
              <div className="text-left">
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>AI platforms analyzed per scan</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                  Each with different citation patterns, ranking signals, and content preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24">
        <div className="absolute inset-0 hero-glow opacity-50" style={{ transform: 'rotate(180deg)' }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Start Scanning
          </h2>
          <p className="mt-4 mb-8" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Get your GEO score in under 60 seconds. Free.
          </p>
          <ScanForm />
        </div>
      </section>
    </div>
  );
}
