"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/* ─── Types ──────────────────────────────────────────────────── */

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  dismissing: boolean;
}

interface ToastAPI {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

/* ─── Context ────────────────────────────────────────────────── */

const ToastContext = createContext<ToastAPI | null>(null);

export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ─── Constants ──────────────────────────────────────────────── */

const AUTO_DISMISS_MS = 4000;
const EXIT_DURATION_MS = 320;

let toastCounter = 0;

/* ─── Color map ──────────────────────────────────────────────── */

const colorMap: Record<ToastType, { accent: string; bg: string }> = {
  success: { accent: "var(--accent)", bg: "var(--toast-success-bg, rgba(14, 244, 197, 0.08))" },
  error: { accent: "var(--danger)", bg: "var(--toast-error-bg, rgba(255, 71, 87, 0.08))" },
  info: { accent: "var(--info, #4e8cff)", bg: "var(--toast-info-bg, rgba(78, 140, 255, 0.08))" },
};

/* ─── Icons ──────────────────────────────────────────────────── */

function ToastIcon({ type }: { type: ToastType }) {
  const color = colorMap[type].accent;

  if (type === "success") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" opacity={0.5} />
        <path d="M5 8.5l2 2 4-4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" opacity={0.5} />
        <path d="M6 6l4 4M10 6l-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // info
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" opacity={0.5} />
      <path d="M8 7v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill={color} />
    </svg>
  );
}

/* ─── Single Toast ───────────────────────────────────────────── */

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const { accent, bg } = colorMap[toast.type];

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "10px",
        border: `1px solid ${accent}20`,
        background: bg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: `0 8px 32px var(--shadow-heavy, rgba(0,0,0,0.35)), inset 0 1px 0 ${accent}10`,
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--text-primary)",
        maxWidth: "380px",
        width: "100%",
        pointerEvents: "auto",
        animation: toast.dismissing
          ? `toast-out ${EXIT_DURATION_MS}ms ease-in forwards`
          : `toast-in 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
      }}
    >
      <ToastIcon type={toast.type} />

      <span style={{ flex: 1, lineHeight: 1.4, letterSpacing: "0.01em" }}>
        {toast.message}
      </span>

      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          border: "none",
          background: "transparent",
          color: "var(--text-muted)",
          cursor: "pointer",
          transition: "color 0.15s, background 0.15s",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--text-primary)";
          e.currentTarget.style.background = "var(--hover-overlay, rgba(255,255,255,0.06))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-muted)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l6 6M8 2l-6 6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Provider ───────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Clean up all timers on unmount
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    // Clear auto-dismiss timer
    const existing = timersRef.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timersRef.current.delete(id);
    }

    // Mark as dismissing for exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t))
    );

    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_DURATION_MS);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${++toastCounter}`;
      const item: ToastItem = { id, type, message, dismissing: false };

      setToasts((prev) => [...prev, item]);

      // Auto-dismiss
      const timer = setTimeout(() => {
        dismiss(id);
      }, AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const api: ToastAPI = {
    success: useCallback((msg: string) => addToast("success", msg), [addToast]),
    error: useCallback((msg: string) => addToast("error", msg), [addToast]),
    info: useCallback((msg: string) => addToast("info", msg), [addToast]),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-label="Notifications"
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              zIndex: 100000,
              pointerEvents: "none",
              maxWidth: "calc(100vw - 40px)",
            }}
          >
            {toasts.map((t) => (
              <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
