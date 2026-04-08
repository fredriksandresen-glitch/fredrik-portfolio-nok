import { useActor } from "@caffeineai/core-infrastructure";
import {
  CheckCircle2,
  Circle,
  Clock,
  Database,
  Info,
  Plus,
  RefreshCw,
  Settings,
  Target,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { createActor } from "../backend";
import { formatNOK, formatQty, formatRelativeTime } from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { AssetType } from "../types/portfolio";
import type { AssetHolding } from "../types/portfolio";

const GOAL_KEY = "portfolio_goal_nok";
const DEFAULT_GOAL = 10_000_000;

const EMPTY_HOLDING: Omit<AssetHolding, "assetType"> & { assetType: string } = {
  symbol: "",
  name: "",
  quantity: 0,
  stakedQty: 0,
  yieldRate: 0,
  assetType: "Crypto",
};

interface Toast {
  id: number;
  type: "success" | "error";
  text: string;
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
          <Icon className="h-4 w-4 text-accent" aria-hidden />
        </div>
        <h2 className="font-display text-sm font-semibold text-foreground">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusRow({
  label,
  isLive,
  lastFetch,
}: {
  label: string;
  isLive: boolean;
  lastFetch: Date | null;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="mt-0.5">
        {isLive ? (
          <CheckCircle2
            className="h-4 w-4 text-[oklch(var(--color-success))]"
            aria-hidden
          />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground" aria-hidden />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {isLive ? "Live data" : "Mock data"} · Sist:{" "}
          {formatRelativeTime(lastFetch)}
        </p>
      </div>
      <span
        className={`shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          isLive
            ? "bg-[oklch(var(--color-success)/0.12)] text-[oklch(var(--color-success))] border border-[oklch(var(--color-success)/0.3)]"
            : "bg-muted text-muted-foreground border border-border"
        }`}
      >
        <Circle className="h-1.5 w-1.5 fill-current" aria-hidden />
        {isLive ? "Live" : "Mock"}
      </span>
    </div>
  );
}

export default function Innstillinger() {
  const { actor } = useActor(createActor);
  const { summary, lastUpdated, isLoading } = usePortfolioStore();

  // Goal state
  const [goalAmount, setGoalAmount] = useState<number>(() => {
    const stored = localStorage.getItem(GOAL_KEY);
    return stored ? Number(stored) : DEFAULT_GOAL;
  });
  const [goalInput, setGoalInput] = useState<string>(() => {
    const stored = localStorage.getItem(GOAL_KEY);
    return stored ?? String(DEFAULT_GOAL);
  });
  const [goalSaved, setGoalSaved] = useState(false);

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Asset form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_HOLDING });
  const [saving, setSaving] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  function pushToast(type: "success" | "error", text: string) {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4500,
    );
  }

  // Derive API statuses from store data
  const hasSummary = summary !== null;
  const finnhubLive = hasSummary && summary.hasLiveData;
  const coingeckoLive = hasSummary && summary.hasLiveData;
  const lastPriceDate = lastUpdated;

  function handleGoalSave() {
    const parsed = Number(goalInput.replace(/\s/g, "").replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0) {
      pushToast("error", "Ugyldig beløp. Skriv inn et positivt tall.");
      return;
    }
    setGoalAmount(parsed);
    localStorage.setItem(GOAL_KEY, String(parsed));
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 2000);
    pushToast("success", `Mål oppdatert til ${formatNOK(parsed)}`);
  }

  async function handleRefresh() {
    if (!actor) {
      pushToast("error", "Ikke tilkoblet backend");
      return;
    }
    setIsRefreshing(true);
    try {
      await actor.refreshPrices();
      pushToast("success", "Priser oppdatert fra Finnhub og CoinGecko");
    } catch {
      pushToast("error", "Feil ved oppdatering av priser. Prøv igjen.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleSnapshot() {
    if (!actor) return;
    try {
      await actor.recordDailySnapshot();
      pushToast("success", "Daglig snapshot registrert");
    } catch {
      pushToast("error", "Feil ved registrering av snapshot");
    }
  }

  async function handleDelete(symbol: string) {
    if (!actor) return;
    if (!confirm(`Slett ${symbol} fra porteføljen?`)) return;
    try {
      await actor.deleteAsset(symbol);
      pushToast("success", `${symbol} fjernet fra porteføljen`);
    } catch {
      pushToast("error", `Feil ved sletting av ${symbol}`);
    }
  }

  async function handleAddAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const holding: AssetHolding = {
        symbol: form.symbol.toUpperCase(),
        name: form.name,
        quantity: Number(form.quantity),
        stakedQty: Number(form.stakedQty),
        yieldRate: Number(form.yieldRate) / 100,
        assetType:
          form.assetType === "Stock" ? AssetType.Stock : AssetType.Crypto,
      };
      await actor.addAsset(holding);
      pushToast("success", `${holding.symbol} lagt til i porteføljen`);
      setShowAddForm(false);
      setForm({ ...EMPTY_HOLDING });
    } catch {
      pushToast("error", "Feil ved lagring av aktivum");
    } finally {
      setSaving(false);
    }
  }

  const assets = summary?.assets ?? [];
  const totalValueNOK = summary?.totalValueNOK ?? 0;
  const goalProgress =
    goalAmount > 0 ? Math.min((totalValueNOK / goalAmount) * 100, 100) : 0;

  return (
    <div
      className="space-y-5 pb-8"
      data-ocid="innstillinger-page"
      aria-label="Innstillinger"
    >
      {/* Page header */}
      <div className="flex items-center gap-3 pb-1">
        <Settings className="h-5 w-5 text-accent" aria-hidden />
        <h1 className="font-display text-xl font-bold text-foreground">
          Innstillinger
        </h1>
      </div>

      {/* ── 1. Porteføljeinnstillinger ── */}
      <SectionCard icon={Target} title="Porteføljeinnstillinger">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="goal-amount"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Sparemål (NOK)
            </label>
            <div className="flex gap-2">
              <input
                id="goal-amount"
                type="number"
                min={1}
                step={100000}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onBlur={() => {
                  const parsed = Number(
                    goalInput.replace(/\s/g, "").replace(",", "."),
                  );
                  if (!Number.isNaN(parsed) && parsed > 0) {
                    setGoalInput(String(parsed));
                  }
                }}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                data-ocid="goal-amount-input"
                aria-label="Sparemål i NOK"
              />
              <button
                type="button"
                onClick={handleGoalSave}
                className="px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50"
                data-ocid="save-goal-btn"
              >
                {goalSaved ? "Lagret ✓" : "Lagre"}
              </button>
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Fremgang mot mål</span>
              <span className="font-mono text-foreground font-medium">
                {goalProgress.toFixed(1)}% av {formatNOK(goalAmount, true)}
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full bg-muted overflow-hidden"
              role="progressbar"
              aria-valuenow={goalProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Fremgang mot sparemål"
              tabIndex={0}
              data-ocid="goal-progress-bar"
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Nåværende:{" "}
              <span className="text-foreground font-semibold">
                {formatNOK(totalValueNOK)}
              </span>{" "}
              · Gjenstår:{" "}
              <span className="text-foreground font-semibold">
                {formatNOK(Math.max(goalAmount - totalValueNOK, 0))}
              </span>
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ── 2. API-status ── */}
      <SectionCard icon={Zap} title="API-status">
        <div className="space-y-0">
          <StatusRow
            label="Finnhub (aksjer: BMNR, MSTR, SBET)"
            isLive={finnhubLive}
            lastFetch={lastPriceDate}
          />
          <StatusRow
            label="CoinGecko (krypto: ICP, BTC)"
            isLive={coingeckoLive}
            lastFetch={lastPriceDate}
          />
        </div>
        <div className="mt-4 rounded-lg bg-muted/40 border border-border/50 px-4 py-3 flex gap-3">
          <Info
            className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"
            aria-hidden
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            API-nøkler for Finnhub og CoinGecko håndteres sikkert i backend og
            eksponeres aldri i frontend-koden. Alle prisforespørsler går via
            backend-kanisteret.
          </p>
        </div>
      </SectionCard>

      {/* ── 3. Oppdateringsfrekvens ── */}
      <SectionCard icon={Clock} title="Oppdateringsfrekvens">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-foreground">
              Prisoppdatering
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatisk oppdatering av kurser
            </p>
          </div>
          <span
            className="font-mono text-sm font-semibold text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5"
            data-ocid="refresh-interval-display"
          >
            5 min
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 pt-3 border-t border-border/50">
          Oppdateringsintervallet er konfigurert i backend. Manuell oppdatering
          er tilgjengelig i seksjonen under.
        </p>
      </SectionCard>

      {/* ── 4. Datasynkronisering ── */}
      <SectionCard icon={Database} title="Datasynkronisering">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Oppdater priser nå
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Henter ferske kurser fra Finnhub og CoinGecko umiddelbart
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || !actor}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-smooth font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
              data-ocid="refresh-prices-btn"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden
              />
              {isRefreshing ? "Oppdaterer..." : "Oppdater priser nå"}
            </button>
          </div>
          <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Lagre daglig snapshot
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Lagrer nåværende porteføljeverdi i historikken
              </p>
            </div>
            <button
              type="button"
              onClick={handleSnapshot}
              disabled={!actor || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-muted/60 disabled:opacity-50 transition-smooth font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 border border-border"
              data-ocid="record-snapshot-btn"
            >
              Lagre daglig snapshot
            </button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground font-mono pt-1">
              Sist oppdatert: {formatRelativeTime(lastUpdated)}
            </p>
          )}
        </div>
      </SectionCard>

      {/* ── 5. Aktivahåndtering ── */}
      <div
        className="rounded-xl border border-border bg-card overflow-hidden"
        data-ocid="asset-management"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Database className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <h2 className="font-display text-sm font-semibold text-foreground">
              Porteføljehåndtering
              <span className="ml-2 text-xs font-normal text-muted-foreground font-mono">
                ({assets.length} aktiva)
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-smooth font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-accent/20"
            data-ocid="add-asset-btn"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Legg til
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddAsset}
            className="p-5 border-b border-border bg-muted/10 space-y-4"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nytt aktivum
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground font-medium"
                  htmlFor="new-symbol"
                >
                  Symbol
                </label>
                <input
                  id="new-symbol"
                  required
                  value={form.symbol}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, symbol: e.target.value }))
                  }
                  placeholder="f.eks. BTC"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  data-ocid="new-asset-symbol"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground font-medium"
                  htmlFor="new-name"
                >
                  Navn
                </label>
                <input
                  id="new-name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="f.eks. Bitcoin"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="new-asset-name"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground font-medium"
                  htmlFor="new-qty"
                >
                  Antall
                </label>
                <input
                  id="new-qty"
                  type="number"
                  step="any"
                  required
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      quantity: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  data-ocid="new-asset-qty"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground font-medium"
                  htmlFor="new-staked"
                >
                  Staked
                </label>
                <input
                  id="new-staked"
                  type="number"
                  step="any"
                  value={form.stakedQty}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stakedQty: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  data-ocid="new-asset-staked"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground font-medium"
                  htmlFor="new-yield"
                >
                  Yield % p.a.
                </label>
                <input
                  id="new-yield"
                  type="number"
                  step="0.1"
                  value={form.yieldRate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      yieldRate: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  data-ocid="new-asset-yield"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  className="text-xs text-muted-foreground font-medium"
                  htmlFor="new-type"
                >
                  Type
                </label>
                <select
                  id="new-type"
                  value={form.assetType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, assetType: e.target.value }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="new-asset-type"
                >
                  <option value="Crypto">Krypto</option>
                  <option value="Stock">Aksje</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid="cancel-add-asset"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={saving || !actor}
                className="px-5 py-2 text-sm rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-smooth font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid="submit-add-asset"
              >
                {saving ? "Lagrer..." : "Lagre aktivum"}
              </button>
            </div>
          </form>
        )}

        {assets.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground"
            data-ocid="empty-assets-settings"
          >
            <Database className="h-8 w-8 opacity-30" aria-hidden />
            <p className="text-sm">Ingen aktiva registrert</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {assets.map(({ holding, valueNOK }) => (
              <div
                key={holding.symbol}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/10 transition-smooth"
                data-ocid={`settings-asset-${holding.symbol.toLowerCase()}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <span className="font-mono text-[10px] font-bold text-accent">
                    {holding.symbol.slice(0, 3)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {holding.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {formatQty(holding.quantity, holding.symbol)}
                    {holding.stakedQty > 0 && ` · ${holding.stakedQty} staked`}
                    {holding.yieldRate > 0 &&
                      ` · ${(holding.yieldRate * 100).toFixed(1)}% yield`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-semibold text-foreground">
                    {formatNOK(valueNOK)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">
                    {holding.assetType === AssetType.Crypto
                      ? "Krypto"
                      : "Aksje"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(holding.symbol)}
                  aria-label={`Slett ${holding.symbol}`}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-ocid={`delete-asset-${holding.symbol.toLowerCase()}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 6. Om appen ── */}
      <SectionCard icon={Info} title="Om appen">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Versjon
              </p>
              <p className="text-sm font-mono font-semibold text-foreground">
                v1.0.0
              </p>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Aktiva
              </p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {assets.length} registrert
              </p>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Porteføljeverdi
              </p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {formatNOK(totalValueNOK, true)}
              </p>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Sparemål
              </p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {formatNOK(goalAmount, true)}
              </p>
            </div>
          </div>
          <div className="pt-1 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Datakilder
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://finnhub.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid="link-finnhub"
              >
                <Zap className="h-3 w-3 text-accent" aria-hidden />
                Finnhub (aksjer)
              </a>
              <a
                href="https://www.coingecko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-ocid="link-coingecko"
              >
                <Zap className="h-3 w-3 text-accent" aria-hidden />
                CoinGecko (krypto)
              </a>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Toast container ── */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 z-50 flex flex-col gap-2 pointer-events-none"
        data-ocid="toast-container"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm text-sm font-medium animate-in slide-in-from-bottom-2 duration-300 ${
              toast.type === "success"
                ? "bg-card border-[oklch(var(--color-success)/0.35)] text-[oklch(var(--color-success))]"
                : "bg-destructive/20 border-destructive/40 text-destructive"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" aria-hidden />
            )}
            <span className="flex-1 min-w-0 break-words">{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
