"use client";

import { useEffect, useState, useRef } from "react";

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "executive-summary", label: "Executive Summary" },
  { id: "findings", label: "Top Findings" },
  { id: "crawler-access", label: "AI Crawler Access" },
  { id: "category-details", label: "Category Details" },
  { id: "schema-code", label: "Schema Code" },
  { id: "action-plan", label: "Action Plan" },
];

export default function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = TOC_ITEMS.map((item) => item.id);
    const visible = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        // Pick the first visible section in document order
        for (const id of ids) {
          if (visible.has(id)) {
            setActiveId(id);
            return;
          }
        }
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: 0 }
    );

    // Small delay to ensure DOM elements exist after render
    const timer = setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observerRef.current?.observe(el);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  // Filter to only sections that exist in the DOM
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      const present = new Set<string>();
      TOC_ITEMS.forEach((item) => {
        if (document.getElementById(item.id)) {
          present.add(item.id);
        }
      });
      setPresentIds(present);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const visibleItems = TOC_ITEMS.filter((item) => presentIds.has(item.id));

  if (visibleItems.length === 0) return null;

  return (
    <nav
      className="hidden lg:block fixed top-0 left-0 h-screen w-56 overflow-y-auto z-40"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div className="pt-28 pb-8 px-4">
        <p
          className="text-[10px] uppercase tracking-[0.15em] mb-4 px-2"
          style={{ color: "var(--text-muted)" }}
        >
          On this page
        </p>
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="block px-2 py-1.5 rounded text-xs transition-colors"
                  style={{
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    background: isActive ? "var(--accent-dim)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
