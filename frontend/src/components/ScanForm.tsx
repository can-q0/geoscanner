"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/Toast";
import TrustIndicators from "@/components/TrustIndicators";

interface PendingPurchase {
  scanId: string;
  domain: string;
}

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const toast = useToast();

  // Animate modal in when pendingPurchase is set
  useEffect(() => {
    if (pendingPurchase) {
      // Small delay so the DOM renders first, then trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setModalVisible(true));
      });
    }
  }, [pendingPurchase]);

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setPendingPurchase(null);
      setUrl("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    setLoading(true);
    setError("");
    toast.info("Scan started — analyzing your site...");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        if (res.status === 401 || res.status === 307 || res.status === 302) {
          router.push("/sign-up");
          return;
        }
        const msg = "Unexpected server response. Please try again.";
        setError(msg);
        toast.error(msg);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/sign-up");
          return;
        }
        const msg = data.error || data.detail || "Something went wrong";
        setError(msg);
        toast.error(msg);
        return;
      }

      if (data.requiresPayment) {
        const domain = url.trim().replace(/^https?:\/\//, "").split("/")[0];
        setPendingPurchase({ scanId: data.scanId, domain });
        return;
      }

      router.push(`/scan/${data.scanId}`);
    } catch (err) {
      console.error("Scan error:", err);
      const msg = "Failed to connect. Please check your connection and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!pendingPurchase) return;
    setPurchasing(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: pendingPurchase.scanId }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
      closeModal();
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <>
      {/* Scan input form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="relative animated-border rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3 p-2">
            <label htmlFor="scan-url" className="hidden sm:flex items-center gap-1.5 pl-3 cursor-text"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', opacity: 0.6 }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              https://
            </label>

            <input
              id="scan-url"
              name="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="enter your website URL"
              autoComplete="url"
              className="flex-1 bg-transparent px-2 py-3 text-base outline-none placeholder:opacity-30"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 300, caretColor: 'var(--accent)' }}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex items-center gap-2 px-6 py-3 font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap rounded-lg cursor-pointer"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.06em',
                background: loading ? 'var(--accent-dim)' : 'var(--accent)',
                color: 'var(--bg-void)', boxShadow: '0 0 24px var(--accent-dim)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  SCANNING
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  SCAN
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-center text-sm" style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            {error}
          </p>
        )}
      </form>

      {/* Purchase modal - rendered via portal to escape stacking contexts */}
      {pendingPurchase && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 99999,
            padding: '24px',
            opacity: modalVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: modalVisible ? 'auto' : 'none',
            isolation: 'isolate',
          }}
        >
          {/* Backdrop - fully opaque */}
          <div
            className="absolute inset-0"
            onClick={closeModal}
            style={{
              background: 'var(--modal-backdrop, #030510)',
              opacity: modalVisible ? 0.92 : 0,
              transition: 'opacity 0.4s ease',
              cursor: 'pointer',
            }}
          />

          {/* Card */}
          <div
            className="relative w-full"
            style={{
              maxWidth: '380px',
              background: 'var(--modal-card-bg, linear-gradient(180deg, #0d1220 0%, #080c16 100%))',
              border: '1px solid var(--modal-card-border, rgba(255,255,255,0.06))',
              borderRadius: '16px',
              boxShadow: '0 40px 80px var(--modal-shadow, rgba(0,0,0,0.6))',
              transform: modalVisible ? 'translateY(0)' : 'translateY(24px)',
              opacity: modalVisible ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
            }}
          >
            {/* Subtle top accent line */}
            <div style={{
              height: '1px',
              borderRadius: '16px 16px 0 0',
              background: 'linear-gradient(90deg, transparent 10%, var(--accent-glow, rgba(14,244,197,0.3)) 50%, transparent 90%)',
            }} />

            {/* Close X */}
            <button
              onClick={closeModal}
              className="absolute cursor-pointer"
              style={{ top: '16px', right: '16px', color: 'var(--modal-close, rgba(255,255,255,0.2))', transition: 'color 0.2s', background: 'none', border: 'none', padding: '4px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--modal-close-hover, rgba(255,255,255,0.5))')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--modal-close, rgba(255,255,255,0.2))')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>

            <div style={{ padding: '32px 28px 28px' }}>
              {/* Domain */}
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
                color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase',
              }}>
                Full report for
              </p>

              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem',
                color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '20px',
              }}>
                {pendingPurchase.domain}
              </h3>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--modal-divider, rgba(255,255,255,0.05))', marginBottom: '20px' }} />

              {/* Feature list - quiet, no icons overload */}
              <div style={{ marginBottom: '24px' }}>
                {[
                  "Composite GEO score & 6-category breakdown",
                  "Content rewrite suggestions for AI citability",
                  "Brand authority scan across 5 platforms",
                  "Generated Schema.org markup",
                  "Prioritized 30-day action plan",
                  "PDF report download",
                ].map((item, i) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: '10px',
                      padding: '5px 0',
                      opacity: modalVisible ? 1 : 0,
                      transform: modalVisible ? 'translateY(0)' : 'translateY(8px)',
                      transition: `opacity 0.3s ease ${0.12 + i * 0.04}s, transform 0.3s ease ${0.12 + i * 0.04}s`,
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', flexShrink: 0 }}>&mdash;</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full cursor-pointer transition-all disabled:opacity-40"
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem',
                  letterSpacing: '0.01em',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-void)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {purchasing ? "Processing..." : "Purchase \u2014 $5.00"}
              </button>

              <p style={{
                textAlign: 'center', marginTop: '12px',
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: 'var(--text-muted)', letterSpacing: '0.06em',
              }}>
                One-time payment. Instant delivery.
              </p>

              <div style={{ marginTop: '16px' }}>
                <TrustIndicators />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
