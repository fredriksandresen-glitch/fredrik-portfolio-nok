import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  BarChart3,
  Coins,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChangeIndicator } from "../components/ChangeIndicator";
import { ChartSkeleton } from "../components/LoadingSkeleton";
import { StatusBadge } from "../components/StatusBadge";
import { useBackend } from "../hooks/useBackend";
import {
  formatDate,
  formatNOK,
  formatPercent,
  formatRelativeTime,
} from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";
import type { AssetWithPrice, PortfolioSnapshot } from "../types/portfolio";

// ── Constants ─────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "oklch(var(--chart-1))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-2))",
  "oklch(var(--chart-3))",
  "oklch(var(--chart-5))",
] as const;

// ── Period selector ───────────────────────────────────────────────────────────

type Period = "7d" | "30d" | "90d" | "1y" | "All";
const PERIODS: Period[] = ["7d", "30d", "90d", "1y", "All"];
const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7d",
  "30d": "30d",
  "90d": "90d",
  "1y": "1å",
  All: "Alt",
};
const PERIOD_DAYS: Record<Exclude<Period, "All">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

function filterByPeriod(snapshots: PortfolioSnapshot[], period: Period) {
  if (period === "All" || !snapshots.length) return snapshots;
  const cutoff = Date.now() - PERIOD_DAYS[period] * 86_400_000;
  return snapshots.filter((s) => new Date(s.date).getTime() >= cutoff);
}

// ── Tooltip components ────────────────────────────────────────────────────────

interface LineTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}
function LineTooltip({ active, payload, label }: LineTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className="font-mono font-semibold text-foreground text-sm">
        {formatNOK(payload[0].value)}
      </p>
    </div>
  );
}

interface PieTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number } }[];
}
function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{item.name}</p>
      <p className="font-mono text-xs text-muted-foreground">
        {formatNOK(item.value)} · {formatPercent(item.payload.pct, false)}
      </p>
    </div>
  );
}

// ── Hero KPI card ─────────────────────────────────────────────────────────────

interface HeroCardProps {
  totalNOK: number;
  dailyChangePct: number;
  dailyChangeNOK: number;
  hasDailyData: boolean;
  dataStatus: "live" | "stale" | "error" | "loading";
  lastUpdated: Date | null;
  usdNokRate: number;
}
function HeroCard({
  totalNOK,
  dailyChangePct,
  dailyChangeNOK,
  hasDailyData,
  dataStatus,
  lastUpdated,
  usdNokRate,
}: HeroCardProps) {
  return (
    <Card
      className="relative overflow-hidden border-border bg-card p-6 md:p-8"
      data-ocid="hero-kpi-card"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Total porteføljeverdi
          </p>
          <StatusBadge status={dataStatus} />
        </div>
        <p
          className="font-display font-bold text-foreground leading-none mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {formatNOK(totalNOK)}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {hasDailyData ? (
            <>
              <ChangeIndicator value={dailyChangePct} />
              <span className="font-mono text-sm text-muted-foreground">
                {dailyChangeNOK >= 0 ? "+" : ""}
                {formatNOK(dailyChangeNOK)} i dag
              </span>
            </>
          ) : (
            <span className="font-mono text-sm text-muted-foreground">
              — i dag (venter på to dagers data)
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          {lastUpdated && (
            <p className="text-[11px] text-muted-foreground/60 font-mono">
              Oppdatert {formatRelativeTime(lastUpdated)}
            </p>
          )}
          {usdNokRate > 0 && (
            <p className="text-[11px] text-muted-foreground/60 font-mono">
              USD/NOK: {usdNokRate.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

// ── Allocation pie chart ──────────────────────────────────────────────────────

function AllocationChart({
  assets,
  totalNOK,
}: {
  assets: AssetWithPrice[];
  totalNOK: number;
}) {
  const data = useMemo(
    () =>
      assets
        .filter((a) => a.valueNOK > 0)
        .map((a) => ({
          name: a.holding.symbol,
          value: a.valueNOK,
          pct: totalNOK > 0 ? (a.valueNOK / totalNOK) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value),
    [assets, totalNOK],
  );

  return (
    <Card className="border-border bg-card p-5" data-ocid="allocation-chart">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-accent shrink-0" aria-hidden />
        <h2 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
          Fordeling
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ── Top contributors ──────────────────────────────────────────────────────────

function TopContributors({
  assets,
  totalNOK,
}: {
  assets: AssetWithPrice[];
  totalNOK: number;
}) {
  const ranked = useMemo(
    () => [...assets].sort((a, b) => b.valueNOK - a.valueNOK).slice(0, 5),
    [assets],
  );

  return (
    <Card className="border-border bg-card p-5" data-ocid="top-contributors">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-accent shrink-0" aria-hidden />
        <h2 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
          Topp bidragsytere
        </h2>
      </div>
      <ol className="space-y-1">
        {ranked.map((asset, i) => {
          const pct = totalNOK > 0 ? (asset.valueNOK / totalNOK) * 100 : 0;
          return (
            <li
              key={asset.holding.symbol}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-150"
              data-ocid={`contributor-row-${asset.holding.symbol.toLowerCase()}`}
            >
              <span className="w-5 h-5 shrink-0 rounded-full bg-muted/60 flex items-center justify-center font-mono text-[10px] text-muted-foreground">
                {i + 1}
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="font-mono font-semibold text-sm text-accent flex-1 min-w-0 truncate">
                {asset.holding.symbol}
              </span>
              <span className="font-mono text-sm text-foreground font-semibold shrink-0">
                {formatNOK(asset.valueNOK, true)}
              </span>
              <Badge
                variant="secondary"
                className="font-mono text-xs px-1.5 shrink-0 tabular-nums"
              >
                {formatPercent(pct, false)}
              </Badge>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

// ── Yield summary ─────────────────────────────────────────────────────────────

function YieldSummary() {
  const yieldInfo = usePortfolioStore((s) => s.yieldInfo);
  if (!yieldInfo.length) return null;

  return (
    <Card className="border-border bg-card p-5" data-ocid="yield-summary">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-4 w-4 text-accent shrink-0" aria-hidden />
        <h2 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
          Avkastning (staking)
        </h2>
      </div>
      <div className="space-y-3">
        {yieldInfo.map((y) => (
          <div
            key={y.symbol}
            className="rounded-lg bg-muted/20 border border-border/40 p-4"
            data-ocid={`yield-row-${y.symbol.toLowerCase()}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="text-xs font-mono font-semibold text-accent uppercase">
                {y.symbol}
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-accent border-accent/40 font-mono text-[11px]"
                >
                  {formatPercent(y.annualYieldRate * 100, false)} p.a.
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {y.stakedQty.toLocaleString("nb-NO")} staked
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">
                  Per måned
                </p>
                <p className="font-mono text-base font-bold text-foreground leading-none">
                  {formatNOK(y.monthlyYieldNOK)}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                  {y.monthlyYieldAsset.toFixed(2)} {y.symbol}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Per år</p>
                <p className="font-mono text-base font-bold text-foreground leading-none">
                  {formatNOK(y.yearlyYieldNOK)}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                  {y.yearlyYieldAsset.toFixed(2)} {y.symbol}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Custom single-point dot with always-visible label ─────────────────────────

interface SingleDotProps {
  cx?: number;
  cy?: number;
  value?: number;
  date?: string;
}

function SinglePointDot({
  cx = 0,
  cy = 0,
  value = 0,
  date = "",
}: SingleDotProps) {
  if (!cx || !cy) return null;
  const label = formatNOK(value);
  // Estimate label width to center it properly
  const labelWidth = Math.max(label.length * 7.5 + 16, 120);
  const labelX = cx;
  const labelY = cy - 48;
  const pillW = labelWidth;
  const pillH = 38;

  return (
    <g>
      {/* Outer glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill="oklch(var(--chart-4))"
        opacity={0.12}
      />
      {/* Mid ring */}
      <circle
        cx={cx}
        cy={cy}
        r={13}
        fill="oklch(var(--chart-4))"
        opacity={0.22}
      />
      {/* Solid dot */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="oklch(var(--chart-4))"
        stroke="oklch(var(--card))"
        strokeWidth={2.5}
      />
      {/* Connector line from dot to pill */}
      <line
        x1={cx}
        y1={cy - 10}
        x2={cx}
        y2={labelY + pillH}
        stroke="oklch(var(--chart-4))"
        strokeWidth={1.5}
        strokeDasharray="3 2"
        opacity={0.6}
      />
      {/* Label pill background */}
      <rect
        x={labelX - pillW / 2}
        y={labelY}
        width={pillW}
        height={pillH}
        rx={8}
        fill="oklch(var(--chart-4))"
        opacity={0.15}
      />
      <rect
        x={labelX - pillW / 2}
        y={labelY}
        width={pillW}
        height={pillH}
        rx={8}
        fill="none"
        stroke="oklch(var(--chart-4))"
        strokeWidth={1}
        opacity={0.4}
      />
      {/* Value text */}
      <text
        x={labelX}
        y={labelY + 14}
        textAnchor="middle"
        fill="oklch(var(--foreground))"
        fontSize={12}
        fontWeight={700}
        fontFamily="var(--font-mono, monospace)"
      >
        {label}
      </text>
      {/* Date text */}
      <text
        x={labelX}
        y={labelY + 28}
        textAnchor="middle"
        fill="oklch(var(--muted-foreground))"
        fontSize={10}
        fontFamily="var(--font-mono, monospace)"
      >
        {date}
      </text>
    </g>
  );
}

// ── History chart ─────────────────────────────────────────────────────────────

function HistoryChart({
  snapshots,
  isLoading,
}: {
  snapshots: PortfolioSnapshot[];
  isLoading: boolean;
}) {
  const [period, setPeriod] = useState<Period>("30d");

  const chartData = useMemo(() => {
    const filtered = filterByPeriod(snapshots, period);
    return filtered.map((s) => ({
      date: formatDate(s.date),
      value: s.totalValueNOK,
    }));
  }, [snapshots, period]);

  const isSinglePoint = chartData.length === 1;

  const [minVal, maxVal] = useMemo(() => {
    if (!chartData.length) return [0, 0];
    const vals = chartData.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    // Single point: pad 5% each side so dot is visually centered
    if (min === max) return [min * 0.92, max * 1.08];
    return [min * 0.97, max * 1.03];
  }, [chartData]);

  return (
    <Card className="border-border bg-card p-5" data-ocid="history-chart">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">
          Verdihistorikk
        </h2>
        <fieldset
          className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 border-0 m-0"
          aria-label="Velg periode"
          data-ocid="period-selector"
        >
          <legend className="sr-only">Velg tidsperiode</legend>
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded px-2.5 py-1 text-xs font-mono transition-colors duration-150 cursor-pointer ${
                period === p
                  ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={period === p}
              data-ocid={`period-btn-${p.toLowerCase()}`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </fieldset>
      </div>

      {isLoading ? (
        <ChartSkeleton height={200} />
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={chartData}
            margin={{ top: 64, right: 24, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(var(--border))"
              vertical={false}
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minVal, maxVal]}
              tick={{ fontSize: 10, fill: "oklch(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : `${(v / 1_000).toFixed(0)}k`
              }
              width={56}
            />
            {!isSinglePoint && <Tooltip content={<LineTooltip />} />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={isSinglePoint ? "none" : "oklch(var(--chart-4))"}
              strokeWidth={isSinglePoint ? 0 : 2}
              dot={
                isSinglePoint
                  ? false
                  : {
                      r: 4,
                      fill: "oklch(var(--chart-4))",
                      strokeWidth: 2,
                      stroke: "oklch(var(--card))",
                    }
              }
              activeDot={
                isSinglePoint
                  ? false
                  : {
                      r: 6,
                      fill: "oklch(var(--chart-4))",
                      strokeWidth: 0,
                    }
              }
              isAnimationActive={false}
            />
            {isSinglePoint && chartData[0] && (
              <ReferenceDot
                x={chartData[0].date}
                y={chartData[0].value}
                r={0}
                shape={(props: SingleDotProps) => (
                  <SinglePointDot
                    cx={props.cx}
                    cy={props.cy}
                    value={chartData[0].value}
                    date={chartData[0].date}
                  />
                )}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-44 gap-3 text-muted-foreground">
          <BarChart3 className="h-8 w-8 opacity-25" aria-hidden />
          <p className="text-sm text-center max-w-xs leading-relaxed">
            Historikk samles inn — ett punkt per dag du åpner appen
          </p>
        </div>
      )}

      {isSinglePoint && chartData[0] && (
        <p className="mt-3 text-center text-[11px] text-muted-foreground/60 font-mono">
          1 datapunkt registrert — neste punkt legges til i morgen
        </p>
      )}
    </Card>
  );
}

// ── Price status row ──────────────────────────────────────────────────────────

function PriceStatusRow({ assets }: { assets: AssetWithPrice[] }) {
  return (
    <Card className="border-border bg-card p-5" data-ocid="price-status-row">
      <h2 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider mb-4">
        Prisstatus
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {assets.map((a) => {
          const status = a.price
            ? a.price.isMockData
              ? "stale"
              : a.price.isLive
                ? "live"
                : "stale"
            : "error";

          const lastUpd = a.price?.lastUpdated
            ? formatRelativeTime(
                new Date(Number(a.price.lastUpdated / BigInt(1_000_000))),
              )
            : "—";

          return (
            <div
              key={a.holding.symbol}
              className="rounded-lg bg-muted/20 border border-border/40 p-3 space-y-2"
              data-ocid={`price-status-${a.holding.symbol.toLowerCase()}`}
            >
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="font-mono font-bold text-sm text-accent">
                  {a.holding.symbol}
                </span>
                <StatusBadge status={status} />
              </div>
              {a.price ? (
                <p className="font-mono text-sm font-semibold text-foreground">
                  {a.price.priceNOK >= 1
                    ? formatNOK(a.price.priceNOK)
                    : `${a.price.priceNOK.toFixed(6)} NOK`}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">—</p>
              )}
              <p className="text-[10px] text-muted-foreground/70 font-mono truncate">
                {lastUpd}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Daily change calculation ──────────────────────────────────────────────────

/** Returns today's date as a YYYY-MM-DD string in local time. */
function todayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function useDailyChange(
  totalNOK: number,
  snapshots: PortfolioSnapshot[],
): { changeNOK: number; changePct: number; hasData: boolean } {
  return useMemo(() => {
    const noData = { changeNOK: 0, changePct: 0, hasData: false };

    // Need at least 2 real backend snapshots to compute a meaningful daily change.
    if (snapshots.length < 2) return noData;

    const today = todayDateString();

    // Sort descending by date (most recent first).
    const sorted = [...snapshots].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Find a snapshot that is strictly on a different calendar day from today.
    // This prevents comparing today's snapshot against itself if it appears in
    // the list multiple times or if there's only one unique day.
    const yesterday = sorted.find((s) => {
      const d = new Date(s.date);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return ds !== today;
    });

    if (!yesterday) return noData;

    const changeNOK = totalNOK - yesterday.totalValueNOK;
    const changePct =
      yesterday.totalValueNOK > 0
        ? (changeNOK / yesterday.totalValueNOK) * 100
        : 0;
    return { changeNOK, changePct, hasData: true };
  }, [totalNOK, snapshots]);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { refresh } = useBackend();
  const {
    summary,
    historicalSnapshots,
    isLoading,
    error,
    dataStatus,
    lastUpdated,
  } = usePortfolioStore();

  const totalNOK = summary?.totalValueNOK ?? 0;
  const assets = summary?.assets ?? [];
  const { changeNOK, changePct, hasData } = useDailyChange(
    totalNOK,
    historicalSnapshots,
  );

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  if (error && !summary) {
    return (
      <div className="p-4 md:p-6">
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center"
          data-ocid="dashboard-error"
        >
          <AlertCircle className="h-10 w-10 text-destructive/70" aria-hidden />
          <div>
            <p className="font-display font-semibold text-foreground mb-1">
              Kunne ikke laste data
            </p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {error}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
            data-ocid="dashboard-retry-btn"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Prøv igjen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main
      className="space-y-4 p-4 md:p-6 pb-10"
      aria-label="Dashboard"
      data-ocid="dashboard-page"
    >
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-lg text-foreground">
          Portefølje
        </h1>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors duration-150 disabled:opacity-50"
          aria-label="Oppdater data"
          data-ocid="refresh-btn"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            aria-hidden
          />
        </button>
      </div>

      {/* Hero KPI — full width */}
      {summary && (
        <HeroCard
          totalNOK={totalNOK}
          dailyChangePct={changePct}
          dailyChangeNOK={changeNOK}
          hasDailyData={hasData}
          dataStatus={dataStatus}
          lastUpdated={lastUpdated}
          usdNokRate={summary.usdNokRate}
        />
      )}

      {/* Allocation + Top contributors */}
      {assets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AllocationChart assets={assets} totalNOK={totalNOK} />
          <TopContributors assets={assets} totalNOK={totalNOK} />
        </div>
      )}

      {/* Yield summary */}
      <YieldSummary />

      {/* History chart */}
      <HistoryChart snapshots={historicalSnapshots} isLoading={isLoading} />

      {/* Price status per asset */}
      {assets.length > 0 && <PriceStatusRow assets={assets} />}

      {/* Inline error banner when we have data but also a fresh error */}
      {error && summary && (
        <div
          className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3"
          data-ocid="dashboard-error-banner"
        >
          <AlertCircle
            className="h-4 w-4 text-destructive shrink-0"
            aria-hidden
          />
          <p className="text-sm text-destructive flex-1 min-w-0 truncate">
            {error}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="shrink-0 gap-1.5 text-destructive hover:text-destructive"
            data-ocid="error-banner-retry-btn"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Prøv igjen
          </Button>
        </div>
      )}
    </main>
  );
}
