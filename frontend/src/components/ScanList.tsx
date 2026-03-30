"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Scan {
  id: string;
  url: string;
  domain: string;
  scanType: string;
  status: string;
  geoScore: number | null;
  isPaid: boolean;
  createdAt: Date;
}

type SortOption = "newest" | "oldest" | "score-high" | "score-low";
type FilterOption = "all" | "completed" | "processing" | "free" | "paid";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "score-high", label: "Score: High to Low" },
  { value: "score-low", label: "Score: Low to High" },
];

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Full Report" },
];

export default function ScanList({ scans }: { scans: Scan[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [filter, setFilter] = useState<FilterOption>("all");

  const filtered = useMemo(() => {
    let result = [...scans];

    // Search by domain or URL
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.domain.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q)
      );
    }

    // Filter chips
    switch (filter) {
      case "completed":
        result = result.filter((s) => s.status === "completed");
        break;
      case "processing":
        result = result.filter(
          (s) => s.status === "processing" || s.status === "pending"
        );
        break;
      case "free":
        result = result.filter((s) => !s.isPaid);
        break;
      case "paid":
        result = result.filter((s) => s.isPaid);
        break;
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "score-high":
        result.sort((a, b) => (b.geoScore ?? -1) - (a.geoScore ?? -1));
        break;
      case "score-low":
        result.sort((a, b) => (a.geoScore ?? 999) - (b.geoScore ?? 999));
        break;
    }

    return result;
  }, [scans, search, sort, filter]);

  return (
    <div className="space-y-5">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by domain or URL..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg outline-none text-sm transition-colors"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              caretColor: "var(--accent)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-dim)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />
          {/* Clear button */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 transition-colors"
              style={{
                color: "var(--text-muted)",
                background: "none",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
              aria-label="Clear search"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none cursor-pointer rounded-lg py-2.5 pl-3 pr-9 text-sm outline-none transition-colors"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-dim)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                background: active ? "var(--accent)" : "var(--bg-elevated)",
                color: active ? "var(--bg-void)" : "var(--text-secondary)",
                border: active
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p
        className="text-xs"
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Showing {filtered.length} of {scans.length} scan
        {scans.length !== 1 ? "s" : ""}
      </p>

      {/* Scan list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto mb-3 w-8 h-8"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p style={{ color: "var(--text-muted)" }} className="text-sm">
            No scans match your search
          </p>
          {(search || filter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-3 text-xs cursor-pointer transition-colors"
              style={{
                color: "var(--accent)",
                background: "none",
                border: "none",
                fontFamily: "var(--font-mono)",
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((scan) => (
            <Link
              key={scan.id}
              href={`/scan/${scan.id}`}
              className="flex items-center justify-between rounded-lg p-4 transition-all card-hover"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {scan.domain}
                </p>
                <p
                  className="text-sm truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {scan.url}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                {scan.status === "completed" && scan.geoScore !== null ? (
                  <div className="text-right">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        color:
                          scan.geoScore >= 80
                            ? "var(--accent)"
                            : scan.geoScore >= 60
                            ? "var(--score-blue, #60a5fa)"
                            : scan.geoScore >= 40
                            ? "var(--warning)"
                            : "var(--danger)",
                      }}
                    >
                      {scan.geoScore}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      /100
                    </span>
                  </div>
                ) : scan.status === "processing" ? (
                  <span
                    className="text-sm"
                    style={{ color: "var(--warning)" }}
                  >
                    Processing...
                  </span>
                ) : scan.status === "failed" ? (
                  <span
                    className="text-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    Failed
                  </span>
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Pending
                  </span>
                )}
                {scan.isPaid && (
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: "var(--accent-dim)",
                      color: "var(--accent)",
                    }}
                  >
                    FULL
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
