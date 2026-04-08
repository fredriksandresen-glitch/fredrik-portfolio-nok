import type { DataStatus } from "../types/portfolio";

interface StatusBadgeProps {
  status: DataStatus;
  label?: string;
  className?: string;
}

const statusConfig: Record<
  DataStatus,
  { label: string; dotClass: string; textClass: string; pulse: boolean }
> = {
  live: {
    label: "Live",
    dotClass: "bg-accent",
    textClass: "text-accent",
    pulse: true,
  },
  stale: {
    label: "Utdatert",
    dotClass: "bg-muted-foreground",
    textClass: "text-muted-foreground",
    pulse: false,
  },
  error: {
    label: "Feil",
    dotClass: "bg-destructive",
    textClass: "text-destructive",
    pulse: false,
  },
  loading: {
    label: "Laster...",
    dotClass: "bg-muted-foreground",
    textClass: "text-muted-foreground",
    pulse: true,
  },
};

export function StatusBadge({
  status,
  label,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono ${config.textClass} ${className}`}
      data-ocid="status-badge"
      aria-label={`Datastatus: ${displayLabel}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dotClass} opacity-60`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`}
        />
      </span>
      {displayLabel}
    </span>
  );
}
