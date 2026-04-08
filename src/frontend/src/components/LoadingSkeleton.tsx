import { cn } from "../lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function TableRowSkeleton({ rows = 4 }: { rows?: number }) {
  const items = Array.from({ length: rows }, (_, i) => `row-${i}`);
  return (
    <div className="space-y-2">
      {items.map((key) => (
        <div key={key} className="flex items-center gap-4 p-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

const CHART_BARS = [
  { key: "b60", h: 60 },
  { key: "b80", h: 80 },
  { key: "b45", h: 45 },
  { key: "b90", h: 90 },
  { key: "b70", h: 70 },
  { key: "b55", h: 55 },
  { key: "b85", h: 85 },
  { key: "b65", h: 65 },
  { key: "b75", h: 75 },
  { key: "b50", h: 50 },
  { key: "b88", h: 88 },
  { key: "b72", h: 72 },
];

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-lg bg-muted/30 animate-pulse flex items-end gap-1 p-4"
      style={{ height }}
      aria-hidden
    >
      {CHART_BARS.map(({ key, h }) => (
        <div
          key={key}
          className="flex-1 rounded-sm bg-muted/50"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  const cards = ["card-a", "card-b", "card-c", "card-d"];
  return (
    <output className="space-y-4 p-4 block" aria-label="Laster dashboard...">
      {/* Hero value card */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      {/* Chart */}
      <ChartSkeleton height={180} />
      {/* Asset cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((key) => (
          <CardSkeleton key={key} />
        ))}
      </div>
    </output>
  );
}
