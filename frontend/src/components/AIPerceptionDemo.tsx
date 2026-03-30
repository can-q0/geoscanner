"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Chat message typing effect ────────────────────────── */
function useTypingEffect(text: string, active: boolean, speed = 18, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const delayTimer = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, active, speed, delay]);

  return { displayed, done };
}

/* ─── Signal indicator (checkmark or warning) ───────────── */
function Signal({ ok, label, visible, delay }: { ok: boolean; label: string; visible: boolean; delay: number }) {
  return (
    <div className="flex items-center gap-2" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-6px)",
      transition: `all 0.3s ease ${delay}s`,
    }}>
      {ok ? (
        <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "#ef4444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span style={{ fontSize: "0.7rem", color: ok ? "rgba(255,255,255,0.45)" : "rgba(239,68,68,0.6)", fontFamily: "var(--font-mono)" }}>{label}</span>
    </div>
  );
}

/* ─── Chat bubble ───────────────────────────────────────── */
function ChatBubble({ role, text, active, delay, typing }: { role: "user" | "ai"; text: string; active: boolean; delay: number; typing?: boolean }) {
  const { displayed, done } = useTypingEffect(text, active && role === "ai", 15, delay);

  const isUser = role === "user";

  if (!active && !isUser) return null;

  return (
    <div className="flex gap-2.5" style={{
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(8px)",
      transition: `all 0.35s ease ${isUser ? 0 : delay / 1000}s`,
      flexDirection: isUser ? "row-reverse" : "row",
    }}>
      {/* Avatar */}
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{
        background: isUser ? "rgba(255,255,255,0.06)" : "rgba(14,244,197,0.08)",
        border: `1px solid ${isUser ? "rgba(255,255,255,0.08)" : "rgba(14,244,197,0.15)"}`,
      }}>
        {isUser ? (
          <svg className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        )}
      </div>

      {/* Message */}
      <div className="flex-1" style={{ maxWidth: isUser ? "75%" : "85%" }}>
        <div className="px-3.5 py-2.5 rounded-xl" style={{
          background: isUser ? "rgba(255,255,255,0.04)" : "rgba(14,244,197,0.03)",
          border: `1px solid ${isUser ? "rgba(255,255,255,0.06)" : "rgba(14,244,197,0.06)"}`,
          borderTopRightRadius: isUser ? "4px" : "12px",
          borderTopLeftRadius: isUser ? "12px" : "4px",
        }}>
          <p style={{
            fontSize: "0.78rem",
            color: isUser ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.55)",
            lineHeight: 1.65,
            fontFamily: "var(--font-body)",
          }}>
            {isUser ? text : displayed}
            {role === "ai" && !done && typing && (
              <span className="inline-block w-1 h-3.5 ml-0.5" style={{
                background: "var(--accent)",
                animation: "pulse-glow 0.8s ease-in-out infinite",
                verticalAlign: "text-bottom",
              }} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────── */

const BEFORE_QUERY = "What does this company do and can I trust them?";

const BEFORE_RESPONSE = "I found limited information about this company. Their website mentions some services, but I couldn't extract specific details about what they offer, their track record, or credentials. The content doesn't provide clear, structured information that I can confidently reference. I'd recommend checking their site directly for more details.";

const AFTER_RESPONSE = "This company is a leading provider of payment infrastructure, founded in 2010 and serving businesses in 46 countries. According to their documentation, they process over $817B in payments annually. Their platform includes APIs for online payments, billing, fraud prevention, and financial reporting. They hold SOC 2 Type II certification and maintain 99.99% uptime SLA. Notable clients include Amazon, Google, and Shopify.";

const BEFORE_SIGNALS = [
  { ok: false, label: "No Organization schema detected" },
  { ok: false, label: "Content not self-contained — depends on context" },
  { ok: false, label: "No entity verification (Wikipedia, Wikidata)" },
  { ok: false, label: "GPTBot blocked in robots.txt" },
  { ok: false, label: "No definition patterns found" },
];

const AFTER_SIGNALS = [
  { ok: true, label: "Organization schema with sameAs links" },
  { ok: true, label: "Self-contained passages (134–167 words)" },
  { ok: true, label: "Entity verified on Wikipedia + Wikidata" },
  { ok: true, label: "All Tier 1 AI crawlers allowed" },
  { ok: true, label: "Definition patterns in 85% of blocks" },
];

export default function AIPerceptionDemo() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  const [isVisible, setIsVisible] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Restart chat animation on tab switch
  useEffect(() => {
    if (!isVisible) return;
    setChatActive(false);
    const t = setTimeout(() => setChatActive(true), 150);
    return () => clearTimeout(t);
  }, [activeTab, isVisible]);

  const isBefore = activeTab === "before";
  const signals = isBefore ? BEFORE_SIGNALS : AFTER_SIGNALS;
  const response = isBefore ? BEFORE_RESPONSE : AFTER_RESPONSE;

  return (
    <div ref={ref}>
      {/* Tab switcher */}
      <div className="flex justify-center mb-8" style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.5s ease",
      }}>
        <div className="inline-flex rounded-lg p-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {(["before", "after"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="cursor-pointer px-5 py-2 rounded-md transition-all"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                background: activeTab === tab
                  ? tab === "before" ? "rgba(239,68,68,0.1)" : "rgba(14,244,197,0.1)"
                  : "transparent",
                color: activeTab === tab
                  ? tab === "before" ? "#ef4444" : "var(--accent)"
                  : "rgba(255,255,255,0.3)",
                border: "none",
              }}
            >
              {tab === "before" ? "WITHOUT GEO" : "WITH GEO"}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout: chat + signals */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5" style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s ease 0.15s",
      }}>
        {/* Chat simulation (3 cols) */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{
          background: "#080c16",
          border: `1px solid ${isBefore ? "rgba(239,68,68,0.08)" : "rgba(14,244,197,0.08)"}`,
          transition: "border-color 0.4s ease",
        }}>
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: isBefore ? "rgba(239,68,68,0.02)" : "rgba(14,244,197,0.02)",
            transition: "background 0.4s ease",
          }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" style={{ color: isBefore ? "rgba(239,68,68,0.5)" : "var(--accent)", transition: "color 0.4s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
                AI SEARCH RESPONSE
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{
                background: isBefore ? "#ef4444" : "var(--accent)",
                transition: "background 0.4s",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.06em",
                color: isBefore ? "#ef4444" : "var(--accent)",
                transition: "color 0.4s",
              }}>
                {isBefore ? "LOW CONFIDENCE" : "HIGH CONFIDENCE"}
              </span>
            </div>
          </div>

          {/* Chat messages */}
          <div className="p-4 space-y-4" style={{ minHeight: "240px" }}>
            <ChatBubble role="user" text={BEFORE_QUERY} active={chatActive} delay={0} />
            <ChatBubble role="ai" text={response} active={chatActive} delay={600} typing />
          </div>

          {/* Source attribution bar */}
          <div className="px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            {isBefore ? (
              <div className="flex items-center gap-2" style={{
                opacity: chatActive ? 0.5 : 0,
                transition: "opacity 0.4s ease 3s",
              }}>
                <svg className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>
                  No reliable sources found for citation
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3" style={{
                opacity: chatActive ? 1 : 0,
                transition: "opacity 0.4s ease 4s",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>SOURCES:</span>
                {["yoursite.com", "wikipedia.org", "linkedin.com"].map((src) => (
                  <span key={src} style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                    color: "rgba(14,244,197,0.4)", padding: "1px 6px",
                    borderRadius: "3px", background: "rgba(14,244,197,0.04)",
                    border: "1px solid rgba(14,244,197,0.08)",
                  }}>
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Signal analysis (2 cols) */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{
          background: "#080c16",
          border: `1px solid ${isBefore ? "rgba(239,68,68,0.08)" : "rgba(14,244,197,0.08)"}`,
          transition: "border-color 0.4s ease",
        }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3 rounded-full" style={{
              background: isBefore ? "#ef4444" : "var(--accent)",
              transition: "background 0.4s",
            }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
              {isBefore ? "MISSING SIGNALS" : "DETECTED SIGNALS"}
            </span>
          </div>

          <div className="space-y-2.5">
            {signals.map((s, i) => (
              <Signal key={s.label} ok={s.ok} label={s.label} visible={chatActive} delay={0.8 + i * 0.15} />
            ))}
          </div>

          {/* Score indicator */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>
                AI CITATION READINESS
              </span>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem",
                color: isBefore ? "#ef4444" : "var(--accent)",
                transition: "color 0.4s",
              }}>
                {isBefore ? "12%" : "89%"}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="h-full rounded-full" style={{
                width: chatActive ? (isBefore ? "12%" : "89%") : "0%",
                background: isBefore ? "#ef4444" : "var(--accent)",
                boxShadow: `0 0 10px ${isBefore ? "rgba(239,68,68,0.3)" : "var(--accent-dim)"}`,
                transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.5s, background 0.4s",
              }} />
            </div>
          </div>

          {/* Bottom CTA hint */}
          <div className="mt-5 text-center" style={{
            opacity: chatActive ? 1 : 0,
            transition: "opacity 0.5s ease 3s",
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
              {isBefore
                ? "Your site may be invisible to AI search right now"
                : "GEO optimization makes AI cite your content with confidence"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
