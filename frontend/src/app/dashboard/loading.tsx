import { SkeletonLine, SkeletonCard } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header row: title + button */}
      <div className="flex items-center justify-between mb-8">
        <SkeletonLine width="w-40" height="h-7" />
        <SkeletonLine width="w-24" height="h-9" className="rounded-lg" />
      </div>

      {/* 5 scan row placeholders */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] p-4"
            style={{
              background: "var(--bg-surface)",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {/* Left: domain + url lines */}
            <div className="flex-1 min-w-0 space-y-2">
              <SkeletonLine width="w-48" height="h-4" />
              <SkeletonLine width="w-64" height="h-3" />
            </div>

            {/* Right: score placeholder */}
            <div className="ml-4">
              <SkeletonLine width="w-14" height="h-8" className="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
