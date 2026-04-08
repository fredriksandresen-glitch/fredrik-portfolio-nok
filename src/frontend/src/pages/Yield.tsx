import { Calendar, Coins, PlusCircle, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CardSkeleton } from "../components/LoadingSkeleton";
import { formatNOK, formatPercent } from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";

const MONTHS_NO = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function buildProjectionData(totalMonthlyNOK: number) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      month: MONTHS_NO[d.getMonth()],
      kumulativ: Math.round(totalMonthlyNOK * (i + 1)),
      maanedlig: Math.round(totalMonthlyNOK),
    };
  });
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
      <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-mono font-bold text-accent">
          {formatNOK(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Yield() {
  const { yieldInfo, isLoading } = usePortfolioStore();

  const activeYield = yieldInfo.filter((y) => y.annualYieldRate > 0);

  const totalMonthlyNOK = activeYield.reduce(
    (sum, y) => sum + y.monthlyYieldNOK,
    0,
  );
  const totalYearlyNOK = activeYield.reduce(
    (sum, y) => sum + y.yearlyYieldNOK,
    0,
  );

  const projectionData = buildProjectionData(totalMonthlyNOK);

  if (isLoading && activeYield.length === 0) {
    return (
      <div className="space-y-4" data-ocid="yield-page">
        <h1 className="font-display text-xl font-bold text-foreground">
          Yield
        </h1>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8" data-ocid="yield-page">
      <h1 className="font-display text-xl font-bold text-foreground">Yield</h1>

      {/* Header summary cards */}
      <div className="grid grid-cols-2 gap-3" data-ocid="yield-summary">
        <div className="rounded-xl border border-accent/20 bg-card px-4 py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              Månedlig yield
            </p>
          </div>
          <p className="font-display text-xl font-bold text-accent leading-tight">
            {formatNOK(totalMonthlyNOK)}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono mt-1">
            per måned
          </p>
        </div>

        <div className="rounded-xl border border-accent/20 bg-card px-4 py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              Årlig yield
            </p>
          </div>
          <p className="font-display text-xl font-bold text-accent leading-tight">
            {formatNOK(totalYearlyNOK)}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono mt-1">
            per år
          </p>
        </div>
      </div>

      {/* Staked ICP section */}
      {activeYield.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-border p-10 text-center"
          data-ocid="empty-yield"
        >
          <Coins className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm">
            Ingen yield-aktiva registrert
          </p>
        </div>
      ) : (
        <>
          {/* Per-asset yield cards */}
          <div className="space-y-3" data-ocid="yield-list">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-0.5">
              Yield-aktiva
            </p>
            {activeYield.map((y) => (
              <div
                key={y.symbol}
                className="rounded-xl border border-border bg-card p-4"
                data-ocid={`yield-card-${y.symbol.toLowerCase()}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                      <Coins className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {y.symbol}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {y.stakedQty.toLocaleString("nb-NO")} staked
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                    {formatPercent(y.annualYieldRate * 100, false)} p.a.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg bg-muted/40 border border-border/50 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1">
                      Månedlig
                    </p>
                    <p className="text-sm font-bold font-mono text-foreground leading-tight">
                      {formatNOK(y.monthlyYieldNOK)}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {y.monthlyYieldAsset.toFixed(3)} {y.symbol}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/40 border border-border/50 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1">
                      Årlig
                    </p>
                    <p className="text-sm font-bold font-mono text-foreground leading-tight">
                      {formatNOK(y.yearlyYieldNOK)}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {y.yearlyYieldAsset.toFixed(2)} {y.symbol}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Yield breakdown table */}
          <div
            className="rounded-xl border border-border bg-card overflow-hidden"
            data-ocid="yield-table"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Yield-oversikt
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Symbol
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Staked
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Rate
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Mnd NOK
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      År NOK
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeYield.map((y, i) => (
                    <tr
                      key={y.symbol}
                      className={
                        i < activeYield.length - 1
                          ? "border-b border-border/30"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-foreground text-xs">
                          {y.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                        {y.stakedQty.toLocaleString("nb-NO")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-xs font-bold text-accent">
                          {formatPercent(y.annualYieldRate * 100, false)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-foreground font-semibold">
                        {formatNOK(y.monthlyYieldNOK)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-foreground font-semibold">
                        {formatNOK(y.yearlyYieldNOK)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-muted/20">
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider"
                    >
                      Totalt
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-accent">
                      {formatNOK(totalMonthlyNOK)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-bold text-accent">
                      {formatNOK(totalYearlyNOK)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 12-month projection chart */}
          <div
            className="rounded-xl border border-border bg-card overflow-hidden"
            data-ocid="yield-chart"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Kumulativ yield — neste 12 måneder
              </p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={projectionData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                  barSize={18}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => {
                      if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                      return String(v);
                    }}
                    tick={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      fill: "oklch(var(--muted-foreground))",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "oklch(var(--accent) / 0.06)" }}
                  />
                  <Bar
                    dataKey="kumulativ"
                    fill="oklch(var(--accent))"
                    radius={[4, 4, 0, 0]}
                    name="Kumulativ yield"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Add yield source placeholder */}
      <div
        className="rounded-xl border border-dashed border-border/60 bg-card/50 p-5"
        data-ocid="yield-add-source"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Legg til yield-kilde
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Staking, lending, eller annen passiv inntekt
            </p>
          </div>
          <button
            type="button"
            disabled
            aria-label="Legg til yield-kilde (kommer snart)"
            className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs font-mono text-muted-foreground cursor-not-allowed opacity-50 transition-smooth"
          >
            <PlusCircle className="w-4 h-4" />
            Legg til
          </button>
        </div>
      </div>
    </div>
  );
}
