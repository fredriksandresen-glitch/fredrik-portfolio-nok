import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatPercent } from "../lib/format";

interface ChangeIndicatorProps {
  value: number; // percentage change
  showIcon?: boolean;
  className?: string;
}

export function ChangeIndicator({
  value,
  showIcon = true,
  className = "",
}: ChangeIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const colorClass = isNeutral
    ? "text-muted-foreground"
    : isPositive
      ? "text-[oklch(var(--color-success))]"
      : "text-[oklch(var(--color-danger))]";

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${colorClass} ${className}`}
      aria-label={`Endring: ${formatPercent(value)}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />}
      {formatPercent(value)}
    </span>
  );
}
