"use client";

import Link from "next/link";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";

/* ─── Theme toggle icons ─────────────────────────────────────── */

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  // Close on click outside
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav className="relative z-50" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-void)' }}>
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-8 h-8">
              <circle cx="16" cy="16" r="14" fill="none" stroke="var(--accent-dim)" strokeWidth="1" />
              <circle cx="16" cy="16" r="9" fill="none" stroke="var(--accent-dim)" strokeWidth="0.5" />
              <circle cx="16" cy="16" r="4" fill="none" stroke="var(--accent-dim)" strokeWidth="0.5" />
              <line x1="16" y1="16" x2="16" y2="2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"
                style={{ transformOrigin: '16px 16px', animation: 'radar-sweep 4s linear infinite' }} />
              <circle cx="16" cy="16" r="2" fill="var(--accent)" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            <span style={{ color: 'var(--accent)' }}>GEO</span>
            <span style={{ color: 'var(--text-primary)' }}>Scanner</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="cursor-pointer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "none",
              background: "transparent",
              color: "var(--text-secondary)",
              transition: "color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.background = "var(--bg-surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>
          {isSignedIn ? (
            <>
              <Link href="/dashboard"
                className="text-sm transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                DASHBOARD
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="redirect">
                <button className="text-sm transition-colors cursor-pointer hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                  LOGIN
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button className="cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:shadow-[0_0_30px_var(--accent-dim)]"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em',
                    background: 'var(--accent)', color: 'var(--bg-void)', borderRadius: '6px',
                    boxShadow: '0 0 20px var(--accent-dim)',
                  }}>
                  SIGN UP FREE
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          ref={buttonRef}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden relative w-8 h-8 flex items-center justify-center cursor-pointer"
          style={{ background: 'none', border: 'none' }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="3" y1="6" x2="19" y2="6"
              stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"
              style={{
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transformOrigin: '11px 6px',
                ...(mobileOpen ? { transform: 'translateY(5px) rotate(45deg)' } : {}),
              }}
            />
            <line
              x1="3" y1="11" x2="19" y2="11"
              stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"
              style={{
                transition: 'opacity 0.2s ease',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <line
              x1="3" y1="16" x2="19" y2="16"
              stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round"
              style={{
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transformOrigin: '11px 16px',
                ...(mobileOpen ? { transform: 'translateY(-5px) rotate(-45deg)' } : {}),
              }}
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        ref={menuRef}
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: mobileOpen ? '300px' : '0px',
          opacity: mobileOpen ? 1 : 0,
          transition: 'max-height 0.35s ease, opacity 0.3s ease',
          background: 'var(--bg-surface)',
          borderTop: mobileOpen ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="cursor-pointer transition-colors hover:text-[var(--accent)]"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
              background: "none",
              border: "none",
              borderBottomStyle: "solid",
              borderBottomWidth: "1px",
              borderBottomColor: "var(--border)",
              width: "100%",
              textAlign: "left",
              transition: "color 0.2s ease",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", transition: "transform 0.3s ease" }}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </span>
            {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
          </button>
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="transition-colors hover:text-[var(--accent)]"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                DASHBOARD
              </Link>
              <div style={{ padding: '12px 0' }}>
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="redirect">
                <button
                  onClick={closeMenu}
                  className="text-left transition-colors cursor-pointer hover:text-[var(--accent)]"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                    background: 'none',
                    border: 'none',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: 'var(--border)',
                    width: '100%',
                  }}
                >
                  LOGIN
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button
                  onClick={closeMenu}
                  className="cursor-pointer text-sm font-medium transition-all hover:shadow-[0_0_30px_var(--accent-dim)]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    background: 'var(--accent)',
                    color: 'var(--bg-void)',
                    borderRadius: '6px',
                    boxShadow: '0 0 20px var(--accent-dim)',
                    padding: '10px 16px',
                    marginTop: '8px',
                    width: '100%',
                    border: 'none',
                    textAlign: 'center',
                  }}
                >
                  SIGN UP FREE
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
