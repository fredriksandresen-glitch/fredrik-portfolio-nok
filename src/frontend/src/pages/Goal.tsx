import { CalendarClock, Target, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { formatNOK, formatPercent } from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";

const GOAL_NOK = 10_000_000;

// Staked ICP yield: 9000 ICP @ 7.7% — adds to annual portfolio growth
const STAKED_ICP = 9_000;
const ICP_YIELD_RATE = 0.077;

// ICP price estimate (NOK) used for yield contribution when live data unavailable
const ICP_PRICE_NOK_FALLBACK = 90;

const MILESTONES = [25, 50, 75, 100] as const;

interface Scenario {
  label: string;
  labelEn: string;
  rate: number;
  accent: string;
  bg: string;
  border: string;
  icon: string;
}

const SCENARIOS: Scenario[] = [
  {
    label: "Konservativ",
    labelEn: "conservative",
    rate: 0.05,
    accent: "text-muted-foreground",
    bg: "bg-muted/20",
    border: "border-border",
    icon: "🛡️",
  },
  {
    label: "Moderat",
    labelEn: "moderate",
    rate: 0.12,
    accent: "text-[oklch(var(--chart-2))]",
    bg: "bg-[oklch(var(--chart-2)/0.08)]",
    border: "border-[oklch(var(--chart-2)/0.25)]",
    icon: "📈",
  },
  {
    label: "Optimistisk",
    labelEn: "optimistic",
    rate: 0.25,
    accent: "text-[oklch(var(--chart-1))]",
    bg: "bg-[oklch(var(--chart-1)/0.08)]",
    border: "border-[oklch(var(--chart-1)/0.25)]",
    icon: "🚀",
  },
];

function yearsToGoal(
  current: number,
  annualGrowthRate: number,
  annualYieldNOK: number,
): number | null {
  if (current >= GOAL_NOK) return 0;
  // Effective rate: portfolio grows by (rate * current + yieldNOK) each year
  // Simplified: treat total effective rate = (growthOnPortfolio + yield) / current
  // Use iterative approach for accuracy with fixed yield addition
  if (annualGrowthRate <= 0 && annualYieldNOK <= 0) return null;

  let value = current;
  for (let year = 1; year <= 100; year++) {
    value = value * (1 + annualGrowthRate) + annualYieldNOK;
    if (value >= GOAL_NOK) return year;
  }
  return null;
}

function estimatedDate(years: number): string {
  const date = new Date();
  const fullYears = Math.floor(years);
  const months = Math.round((years - fullYears) * 12);
  date.setFullYear(date.getFullYear() + fullYears);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("nb-NO", { month: "short", year: "numeric" });
}

function dailyMonthlyRequired(
  current: number,
  targetYears = 5,
): { daily: number; monthly: number } {
  if (current >= GOAL_NOK) return { daily: 0, monthly: 0 };
  const needed = GOAL_NOK - current;
  const targetDays = targetYears * 365;
  const targetMonths = targetYears * 12;
  return {
    daily: needed / targetDays,
    monthly: needed / targetMonths,
  };
}

export default function Goal() {
  const { summary, isLoading } = usePortfolioStore();
  const current = summary?.totalValueNOK ?? 0;

  // ICP yield in NOK per year — use live price if available
  const icpPriceNOK = useMemo(() => {
    const icpAsset = summary?.assets.find((a) => a.holding.symbol === "ICP");
    return icpAsset?.price?.priceNOK ?? ICP_PRICE_NOK_FALLBACK;
  }, [summary]);

  const annualYieldNOK = STAKED_ICP * ICP_YIELD_RATE * icpPriceNOK;

  const progress = Math.min((current / GOAL_NOK) * 100, 100);
  const remaining = Math.max(GOAL_NOK - current, 0);
  const { daily, monthly } = dailyMonthlyRequired(current);

  const scenarios = useMemo(
    () =>
      SCENARIOS.map((s) => {
        const years = yearsToGoal(current, s.rate, annualYieldNOK);
        return { ...s, years };
      }),
    [current, annualYieldNOK],
  );

  if (isLoading && !summary) {
    return (
      <div className="space-y-4" data-ocid="goal-page-loading">
        <CardSkeleton />
        <CardSkeleton />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6" data-ocid="goal-page">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/25">
          <Target className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground leading-tight">
            Målsporing
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Mål: {formatNOK(GOAL_NOK)}
          </p>
        </div>
      </div>

      {/* Hero card — current value + progress */}
      <div
        className="rounded-xl border border-border bg-card p-5 space-y-5"
        data-ocid="goal-hero"
      >
        {/* Top row: current vs target */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Nåværende verdi
            </p>
            <p className="font-display text-3xl font-bold text-foreground leading-none">
              {formatNOK(current, true)}
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              {formatNOK(current)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Målverdi
            </p>
            <p className="font-display text-3xl font-bold text-primary/80 leading-none">
              10 MNOK
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              10 000 000 NOK
            </p>
          </div>
        </div>

        {/* Animated progress bar with milestones */}
        <div className="space-y-2">
          <div className="relative h-5 w-full rounded-full bg-muted/40 overflow-hidden">
            {/* Teal gradient fill */}
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, oklch(var(--chart-1)), oklch(var(--accent)))",
              }}
              tabIndex={0}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progress.toFixed(1)}% av mål nådd`}
            />
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              aria-hidden
            />
          </div>

          {/* Milestone tick marks */}
          <div className="relative w-full h-4">
            {MILESTONES.map((m) => {
              const reached = progress >= m;
              return (
                <div
                  key={m}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${m}%`, transform: "translateX(-50%)" }}
                >
                  <div
                    className={`w-0.5 h-2 rounded-full transition-colors duration-500 ${
                      reached ? "bg-primary/80" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono mt-0.5 transition-colors duration-500 ${
                      reached
                        ? "text-primary font-semibold"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {m}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          className="rounded-xl border border-border bg-card p-4"
          data-ocid="goal-stat-progress"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Oppnådd
          </p>
          <p className="font-display text-2xl font-bold text-foreground mt-1 tabular-nums">
            {formatPercent(progress, false)}
          </p>
        </div>
        <div
          className="rounded-xl border border-border bg-card p-4"
          data-ocid="goal-stat-remaining"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Gjenstår
          </p>
          <p className="font-display text-2xl font-bold text-foreground mt-1 tabular-nums">
            {formatNOK(remaining, true)}
          </p>
        </div>
        <div
          className="rounded-xl border border-border bg-card p-4"
          data-ocid="goal-stat-daily"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Per dag (5år)
          </p>
          <p className="font-display text-xl font-bold text-foreground mt-1 tabular-nums">
            {formatNOK(daily, true)}
          </p>
        </div>
        <div
          className="rounded-xl border border-border bg-card p-4"
          data-ocid="goal-stat-monthly"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Per måned (5år)
          </p>
          <p className="font-display text-xl font-bold text-foreground mt-1 tabular-nums">
            {formatNOK(monthly, true)}
          </p>
        </div>
      </div>

      {/* Scenarios */}
      <div data-ocid="goal-scenarios">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">
            Scenarioer — estimert tid til mål
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-mono mb-3">
          Inkluderer ICP-avkastning ({formatNOK(annualYieldNOK, true)} / år)
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border p-4 space-y-3 ${s.bg} ${s.border}`}
              data-ocid={`goal-scenario-${s.labelEn}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {s.icon} {s.label}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background/60 ${s.accent}`}
                >
                  {(s.rate * 100).toFixed(0)}% / år
                </span>
              </div>

              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Estimert tid
                </p>
                <p
                  className={`font-display text-2xl font-bold mt-0.5 ${s.accent}`}
                >
                  {s.years === null
                    ? "Over 100 år"
                    : s.years === 0
                      ? "Nådd! 🎉"
                      : `${s.years} år`}
                </p>
              </div>

              {s.years !== null && s.years > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <CalendarClock className="h-3 w-3 shrink-0" />
                  <span>{estimatedDate(s.years)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Required growth card */}
      <div
        className="rounded-xl border border-border bg-card p-5"
        data-ocid="goal-required-growth"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-[oklch(var(--chart-2))]" />
          <p className="text-sm font-semibold text-foreground">
            Nødvendig vekst for å nå mål
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Per dag
            </p>
            <p className="font-display text-xl font-bold text-foreground tabular-nums">
              {formatNOK(daily)}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              for å nå 10M på 5 år
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Per måned
            </p>
            <p className="font-display text-xl font-bold text-foreground tabular-nums">
              {formatNOK(monthly)}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              for å nå 10M på 5 år
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            Beregnet som lineær vekst fra{" "}
            <span className="text-foreground font-semibold">
              {formatNOK(current, true)}
            </span>{" "}
            til <span className="text-primary font-semibold">10 MNOK</span> over
            5 år, uten reinvestering.
          </p>
        </div>
      </div>
    </div>
  );
}
