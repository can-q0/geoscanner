import { SkeletonLine, SkeletonGauge } from "@/components/Skeleton";

export default function ScanResultLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back link */}
      <SkeletonLine width="w-28" height="h-4" className="mb-6" />

      {/* Header: domain + url */}
      <div className="mb-8 space-y-2">
        <SkeletonLine width="w-72" height="h-7" />
        <SkeletonLine width="w-96" height="h-4" />
      </div>

      {/* Score + Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Score gauge placeholder */}
        <div className="flex justify-center">
          <SkeletonGauge />
        </div>

        {/* Category bars placeholder */}
        <div>
          <SkeletonLine width="w-44" height="h-5" className="mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <SkeletonLine width="w-28" height="h-3" />
                  <SkeletonLine width="w-10" height="h-3" />
                </div>
                <SkeletonLine height="h-1.5" className="rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executive summary card placeholder */}
      <div
        className="rounded-lg border border-[var(--border)] p-6 mb-6"
        style={{ background: "var(--bg-surface)" }}
      >
        <SkeletonLine width="w-48" height="h-5" className="mb-4" />
        <div className="space-y-2">
          <SkeletonLine height="h-3" />
          <SkeletonLine height="h-3" />
          <SkeletonLine width="w-3/4" height="h-3" />
        </div>
      </div>

      {/* Top findings card placeholder */}
      <div
        className="rounded-lg border border-[var(--border)] p-6 mb-6"
        style={{ background: "var(--bg-surface)" }}
      >
        <SkeletonLine width="w-36" height="h-5" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="skeleton mt-1.5 h-2 w-2 rounded-full shrink-0" />
              <SkeletonLine height="h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
