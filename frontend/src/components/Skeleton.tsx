/**
 * Reusable skeleton/shimmer loading primitives.
 *
 * All skeletons use the `.skeleton` class from globals.css which applies
 * a shimmer highlight that sweeps across a var(--bg-elevated) background.
 */

interface SkeletonLineProps {
  /** Tailwind width class, e.g. "w-48", "w-full". Default: "w-full" */
  width?: string;
  /** Tailwind height class. Default: "h-4" */
  height?: string;
  className?: string;
}

export function SkeletonLine({
  width = "w-full",
  height = "h-4",
  className = "",
}: SkeletonLineProps) {
  return (
    <div
      className={`skeleton rounded ${height} ${width} ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonCardProps {
  /** Tailwind height class. Default: "h-20" */
  height?: string;
  className?: string;
}

export function SkeletonCard({ height = "h-20", className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`skeleton rounded-lg border border-[var(--border)] ${height} ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonGaugeProps {
  /** Pixel size matching ScoreGauge. Default: 200 */
  size?: number;
  className?: string;
}

export function SkeletonGauge({ size = 200, className = "" }: SkeletonGaugeProps) {
  return (
    <div className={`flex flex-col items-center ${className}`} aria-hidden="true">
      <div
        className="skeleton rounded-full"
        style={{ width: size, height: size }}
      />
      {/* Label pill below the gauge */}
      <div className="skeleton rounded-full h-6 w-24 mt-3" />
    </div>
  );
}
