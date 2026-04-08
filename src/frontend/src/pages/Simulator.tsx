import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Minus,
  RotateCcw,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNOK } from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { AssetType } from "../types/portfolio";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SimInputs {
  monthlySavings: number;
  cryptoGrowth: number;
  stocksGrowth: number;
  yieldReinvest: boolean;
  nokUsdRate: number;
}

interface ScenarioDef {
  label: string;
  key: "bull" | "base" | "bear";
  cryptoGrowth: number;
  stocksGrowth: number;
  color: string;
  icon: React.ReactNode;
}

interface ProjectionPoint {
  year: number;
  bull: number;
  base: number;
  bear: number;
}

interface MilestoneRow {
  year: number;
  label: string;
  bull: number;
  base: number;
  bear: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const GOAL_NOK = 10_000_000;
const MILESTONES = [1, 3, 5, 10];
const ICP_STAKED_FRACTION = 0.529; // 9000 / 17000
const ICP_YIELD_RATE = 0.077; // 7.7% annual

const SCENARIOS: ScenarioDef[] = [
  {
    key: "bull",
    label: "Bull",
    cryptoGrowth: 40,
    stocksGrowth: 20,
    color: "oklch(75% 0.2 152)",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    key: "base",
    label: "Base",
    cryptoGrowth: 15,
    stocksGrowth: 10,
    color: "oklch(72% 0.18 252)",
    icon: <Minus className="w-4 h-4" />,
  },
  {
    key: "bear",
    label: "Bear",
    cryptoGrowth: -10,
    stocksGrowth: 2,
    color: "oklch(65% 0.19 22)",
    icon: <TrendingDown className="w-4 h-4" />,
  },
];

const DEFAULT_INPUTS: SimInputs = {
  monthlySavings: 10000,
  cryptoGrowth: 15,
  stocksGrowth: 10,
  yieldReinvest: true,
  nokUsdRate: 10.5,
};

// ── Projection Engine ─────────────────────────────────────────────────────────

function projectValue(
  initialCryptoNOK: number,
  initialStocksNOK: number,
  inputs: SimInputs,
  cryptoGrowth: number,
  stocksGrowth: number,
  years: number,
): number {
  const cryptoMonthlyRate = cryptoGrowth / 100 / 12;
  const stocksMonthlyRate = stocksGrowth / 100 / 12;
  const total = initialCryptoNOK + initialStocksNOK;
  const cryptoFrac = total > 0 ? initialCryptoNOK / total : 0.6;
  const stocksFrac = total > 0 ? initialStocksNOK / total : 0.4;

  let crypto = initialCryptoNOK;
  let stocks = initialStocksNOK;

  for (let m = 0; m < years * 12; m++) {
    crypto *= 1 + cryptoMonthlyRate;
    stocks *= 1 + stocksMonthlyRate;

    if (inputs.yieldReinvest) {
      const icpYieldNOK = crypto * ICP_STAKED_FRACTION * (ICP_YIELD_RATE / 12);
      crypto += icpYieldNOK;
    }

    crypto += inputs.monthlySavings * cryptoFrac;
    stocks += inputs.monthlySavings * stocksFrac;
  }

  return crypto + stocks;
}

function buildProjections(
  cryptoNOK: number,
  stocksNOK: number,
  inputs: SimInputs,
): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  for (let year = 0; year <= 10; year++) {
    points.push({
      year,
      bull: projectValue(cryptoNOK, stocksNOK, inputs, 40, 20, year),
      base: projectValue(
        cryptoNOK,
        stocksNOK,
        inputs,
        inputs.cryptoGrowth,
        inputs.stocksGrowth,
        year,
      ),
      bear: projectValue(cryptoNOK, stocksNOK, inputs, -10, 2, year),
    });
  }
  return points;
}

function findGoalYear(
  points: ProjectionPoint[],
  key: "bull" | "base" | "bear",
): string {
  for (const p of points) {
    if (p[key] >= GOAL_NOK) return `År ${p.year}`;
  }
  return "Ikke nådd";
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="text-muted-foreground mb-2 font-medium font-mono">
        År {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-foreground font-mono font-semibold">
            {formatNOK(p.value, true)}
          </span>
          <span className="text-muted-foreground text-xs">{p.name}</span>
        </div>
      ))}
    </div>
  );
}

// ── Slider Input Component ────────────────────────────────────────────────────

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  dataOcid,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
  dataOcid: string;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground">{label}</Label>
        <span className="text-sm font-mono text-primary font-semibold tabular-nums">
          {displayValue}
        </span>
      </div>
      <div className="relative h-5 flex items-center group">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          data-ocid={dataOcid}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-all duration-75 group-hover:scale-110"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Simulator() {
  const { summary } = usePortfolioStore();
  const [inputs, setInputs] = useState<SimInputs>(DEFAULT_INPUTS);

  const { cryptoNOK, stocksNOK } = useMemo(() => {
    if (!summary) return { cryptoNOK: 1_400_000, stocksNOK: 380_000 };
    let crypto = 0;
    let stocks = 0;
    for (const a of summary.assets) {
      if (a.holding.assetType === AssetType.Crypto) crypto += a.valueNOK;
      else stocks += a.valueNOK;
    }
    return { cryptoNOK: crypto || 1_400_000, stocksNOK: stocks || 380_000 };
  }, [summary]);

  const totalNOK = cryptoNOK + stocksNOK;

  const projections = useMemo(
    () => buildProjections(cryptoNOK, stocksNOK, inputs),
    [cryptoNOK, stocksNOK, inputs],
  );

  const milestones: MilestoneRow[] = useMemo(
    () =>
      MILESTONES.map((y) => {
        const p =
          projections.find((pt) => pt.year === y) ??
          projections[projections.length - 1];
        return {
          year: y,
          label: `${y} år`,
          bull: p.bull,
          base: p.base,
          bear: p.bear,
        };
      }),
    [projections],
  );

  const applyScenario = useCallback((s: ScenarioDef) => {
    setInputs((prev) => ({
      ...prev,
      cryptoGrowth: s.cryptoGrowth,
      stocksGrowth: s.stocksGrowth,
    }));
  }, []);

  const resetInputs = useCallback(() => setInputs(DEFAULT_INPUTS), []);

  const update = useCallback(
    <K extends keyof SimInputs>(key: K, val: SimInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  const isBullActive = inputs.cryptoGrowth === 40 && inputs.stocksGrowth === 20;
  const isBearActive = inputs.cryptoGrowth === -10 && inputs.stocksGrowth === 2;
  const isBaseActive = !isBullActive && !isBearActive;

  const activeMap = {
    bull: isBullActive,
    base: isBaseActive,
    bear: isBearActive,
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Page header */}
      <div className="bg-card border-b border-border px-4 py-5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
              Simulator
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Projiser porteføljens fremtidige verdi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="font-mono text-xs hidden sm:flex"
            >
              Basis: {formatNOK(totalNOK, true)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={resetInputs}
              data-ocid="simulator-reset"
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Nullstill
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Scenario presets */}
        <div className="grid grid-cols-3 gap-3">
          {SCENARIOS.map((s) => {
            const active = activeMap[s.key];
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => applyScenario(s)}
                data-ocid={`scenario-${s.key}`}
                className={[
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 sm:p-4 transition-smooth cursor-pointer",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40",
                ].join(" ")}
              >
                <span
                  style={{ color: active ? "oklch(72% 0.18 252)" : s.color }}
                >
                  {s.icon}
                </span>
                <span
                  className={`text-xs sm:text-sm font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-mono ${active ? "text-primary/70" : "text-muted-foreground/70"}`}
                >
                  K {s.cryptoGrowth > 0 ? "+" : ""}
                  {s.cryptoGrowth}% / A +{s.stocksGrowth}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Input panel + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Inputs */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-display">
                Parametere
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SliderInput
                label="Månedlig sparing"
                value={inputs.monthlySavings}
                min={0}
                max={100_000}
                step={1000}
                displayValue={formatNOK(inputs.monthlySavings, true)}
                onChange={(v) => update("monthlySavings", v)}
                dataOcid="input-monthly-savings"
              />

              <SliderInput
                label="Krypto vekst (% per år)"
                value={inputs.cryptoGrowth}
                min={-30}
                max={100}
                step={1}
                displayValue={`${inputs.cryptoGrowth > 0 ? "+" : ""}${inputs.cryptoGrowth}%`}
                onChange={(v) => update("cryptoGrowth", v)}
                dataOcid="input-crypto-growth"
              />

              <SliderInput
                label="Aksjer vekst (% per år)"
                value={inputs.stocksGrowth}
                min={-20}
                max={50}
                step={1}
                displayValue={`${inputs.stocksGrowth > 0 ? "+" : ""}${inputs.stocksGrowth}%`}
                onChange={(v) => update("stocksGrowth", v)}
                dataOcid="input-stocks-growth"
              />

              <SliderInput
                label="NOK/USD kurs"
                value={inputs.nokUsdRate}
                min={8}
                max={16}
                step={0.1}
                displayValue={inputs.nokUsdRate.toFixed(1)}
                onChange={(v) => update("nokUsdRate", v)}
                dataOcid="input-nok-usd-rate"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="space-y-0.5">
                  <Label className="text-sm text-foreground cursor-pointer">
                    Reinvester ICP-avkastning
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    7.7% p.a. på 9 000 stakede ICP
                  </p>
                </div>
                <Switch
                  checked={inputs.yieldReinvest}
                  onCheckedChange={(v) => update("yieldReinvest", v)}
                  data-ocid="toggle-yield-reinvest"
                />
              </div>

              {/* Portfolio split info */}
              <div className="rounded-lg bg-muted/40 border border-border/50 p-3 space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Nåværende portefølje
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">
                      Krypto
                    </p>
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {formatNOK(cryptoNOK, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">
                      Aksjer
                    </p>
                    <p className="font-mono font-semibold text-foreground text-sm">
                      {formatNOK(stocksNOK, true)}
                    </p>
                  </div>
                </div>
                <div className="flex h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-primary"
                    style={{ width: `${(cryptoNOK / totalNOK) * 100}%` }}
                  />
                  <div className="flex-1 bg-accent/50" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display">
                  10-års projeksjon
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  <span>10M NOK mål</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div
                className="h-[320px] sm:h-[380px] w-full"
                data-ocid="simulator-chart"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projections}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.24 0 0)"
                      strokeOpacity={0.6}
                    />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "oklch(0.52 0 0)",
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                      }}
                      tickFormatter={(v: number) => `${v}y`}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "oklch(0.52 0 0)",
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                      }}
                      tickFormatter={(v: number) => formatNOK(v, true)}
                      width={76}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: "12px",
                        paddingTop: "12px",
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                    <ReferenceLine
                      y={GOAL_NOK}
                      stroke="oklch(0.72 0.18 252)"
                      strokeDasharray="6 3"
                      strokeWidth={1.5}
                      label={{
                        value: "10M mål",
                        fill: "oklch(0.72 0.18 252)",
                        fontSize: 10,
                        position: "insideTopRight",
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bull"
                      name="Bull"
                      stroke={SCENARIOS[0].color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: SCENARIOS[0].color }}
                    />
                    <Line
                      type="monotone"
                      dataKey="base"
                      name="Base"
                      stroke={SCENARIOS[1].color}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4, fill: SCENARIOS[1].color }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bear"
                      name="Bear"
                      stroke={SCENARIOS[2].color}
                      strokeWidth={2}
                      strokeDasharray="5 3"
                      dot={false}
                      activeDot={{ r: 4, fill: SCENARIOS[2].color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal crossing cards */}
        <div className="grid grid-cols-3 gap-3">
          {SCENARIOS.map((s) => {
            const goalYear = findGoalYear(projections, s.key);
            const reached = goalYear !== "Ikke nådd";
            return (
              <Card
                key={s.key}
                className={`bg-card border-border ${reached ? "ring-1 ring-primary/40" : ""}`}
              >
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    10M NOK nås
                  </p>
                  <p
                    className={`text-base sm:text-lg font-mono font-bold tabular-nums ${
                      reached ? "text-primary" : "text-muted-foreground"
                    }`}
                    data-ocid={`goal-year-${s.key}`}
                  >
                    {goalYear}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Milestones table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Milepæler</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden rounded-b-xl">
            <div className="overflow-x-auto" data-ocid="milestones-table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 sm:px-6 py-3">
                      Tidspunkt
                    </th>
                    {SCENARIOS.map((s) => (
                      <th
                        key={s.key}
                        className="text-right text-xs font-semibold uppercase tracking-wide px-4 sm:px-6 py-3 font-mono"
                        style={{ color: s.color }}
                      >
                        {s.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((row, i) => (
                    <tr
                      key={row.year}
                      className={`transition-colors hover:bg-muted/20 ${
                        i < milestones.length - 1
                          ? "border-b border-border/50"
                          : ""
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-3.5 font-medium text-foreground">
                        {row.label}
                      </td>
                      {(["bull", "base", "bear"] as const).map((key) => {
                        const val = row[key];
                        const hitGoal = val >= GOAL_NOK;
                        return (
                          <td
                            key={key}
                            className={`px-4 sm:px-6 py-3.5 text-right font-mono font-medium tabular-nums ${
                              hitGoal ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {formatNOK(val, true)}
                            {hitGoal && (
                              <span className="ml-1 text-[10px] text-primary/70">
                                ✓
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
