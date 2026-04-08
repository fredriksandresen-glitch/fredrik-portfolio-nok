import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  PackagePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createActor } from "../backend";
import { ChangeIndicator } from "../components/ChangeIndicator";
import { TableRowSkeleton } from "../components/LoadingSkeleton";
import { StatusBadge } from "../components/StatusBadge";
import { formatNOK, formatPercent, formatQty } from "../lib/format";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { AssetType } from "../types/portfolio";
import type { AssetHolding } from "../types/portfolio";

// ─── Sort ────────────────────────────────────────────────────────────────────

type SortKey =
  | "name"
  | "quantity"
  | "valueNOK"
  | "allocation"
  | "price"
  | "dailyChange";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40 shrink-0" />;
  return dir === "asc" ? (
    <ChevronUp className="ml-1 h-3 w-3 shrink-0 text-accent" />
  ) : (
    <ChevronDown className="ml-1 h-3 w-3 shrink-0 text-accent" />
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────

type EditMode = "buy" | "sell" | "exact";

interface EditFormValues {
  mode: EditMode;
  amount: string;
  stakedQty: string;
}

interface EditModalProps {
  holding: AssetHolding | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: AssetHolding) => Promise<void>;
}

function EditModal({ holding, open, onClose, onSave }: EditModalProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    defaultValues: {
      mode: "exact",
      amount: holding?.quantity?.toString() ?? "0",
      stakedQty: holding?.stakedQty?.toString() ?? "0",
    },
  });

  const mode = watch("mode");

  const onSubmit = async (data: EditFormValues) => {
    if (!holding) return;
    const amount = Number.parseFloat(data.amount);
    const staked = Number.parseFloat(data.stakedQty);
    if (Number.isNaN(amount) || amount < 0) return;

    let newQty: number;
    if (data.mode === "buy") newQty = holding.quantity + amount;
    else if (data.mode === "sell")
      newQty = Math.max(0, holding.quantity - amount);
    else newQty = amount;

    await onSave({
      ...holding,
      quantity: newQty,
      stakedQty: Number.isNaN(staked) ? holding.stakedQty : staked,
    });
  };

  if (!holding) return null;

  const modeLabel: Record<EditMode, string> = {
    buy: "Kjøp (legg til)",
    sell: "Selg (trekk fra)",
    exact: "Sett nøyaktig antall",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        data-ocid="edit-asset-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Rediger {holding.name}
            <span className="ml-2 font-mono text-sm text-muted-foreground">
              {holding.symbol}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="edit-mode">Operasjon</Label>
            <Controller
              control={control}
              name="mode"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="edit-mode"
                    className="bg-background"
                    data-ocid="edit-mode-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["buy", "sell", "exact"] as EditMode[]).map((m) => (
                      <SelectItem key={m} value={m}>
                        {modeLabel[m]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-amount">
              {mode === "exact"
                ? "Nytt antall"
                : mode === "buy"
                  ? "Kjøp antall"
                  : "Selg antall"}
            </Label>
            <Input
              id="edit-amount"
              type="number"
              step="any"
              min="0"
              className="bg-background font-mono"
              data-ocid="edit-amount-input"
              {...register("amount", {
                required: "Antall er påkrevd",
                min: { value: 0, message: "Kan ikke være negativt" },
              })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">
                {errors.amount.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Nåværende:{" "}
              <span className="font-mono">
                {formatQty(holding.quantity, holding.symbol)}
              </span>
            </p>
          </div>

          {holding.assetType === AssetType.Crypto && (
            <div className="space-y-1.5">
              <Label htmlFor="edit-staked">Staked antall</Label>
              <Input
                id="edit-staked"
                type="number"
                step="any"
                min="0"
                className="bg-background font-mono"
                data-ocid="edit-staked-input"
                {...register("stakedQty", {
                  min: { value: 0, message: "Kan ikke være negativt" },
                })}
              />
              {errors.stakedQty && (
                <p className="text-xs text-destructive">
                  {errors.stakedQty.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              data-ocid="edit-cancel-btn"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-ocid="edit-save-btn"
            >
              {isSubmitting ? "Lagrer..." : "Lagre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add form ─────────────────────────────────────────────────────────────────

interface AddFormValues {
  symbol: string;
  name: string;
  quantity: string;
  stakedQty: string;
  assetType: AssetType;
  yieldRate: string;
}

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (holding: AssetHolding) => Promise<void>;
}

function AddModal({ open, onClose, onAdd }: AddModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddFormValues>({
    defaultValues: {
      symbol: "",
      name: "",
      quantity: "",
      stakedQty: "0",
      assetType: AssetType.Stock,
      yieldRate: "0",
    },
  });

  const assetType = watch("assetType");

  const onSubmit = async (data: AddFormValues) => {
    const qty = Number.parseFloat(data.quantity);
    const staked = Number.parseFloat(data.stakedQty);
    const rate = Number.parseFloat(data.yieldRate);
    await onAdd({
      symbol: data.symbol.toUpperCase().trim(),
      name: data.name.trim(),
      quantity: qty,
      stakedQty: Number.isNaN(staked) ? 0 : staked,
      assetType: data.assetType,
      yieldRate: Number.isNaN(rate) ? 0 : rate / 100,
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        data-ocid="add-asset-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Legg til nytt aktiva
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-symbol">Symbol</Label>
              <Input
                id="add-symbol"
                placeholder="f.eks. BTC"
                className="bg-background font-mono uppercase"
                data-ocid="add-symbol-input"
                {...register("symbol", { required: "Symbol er påkrevd" })}
              />
              {errors.symbol && (
                <p className="text-xs text-destructive">
                  {errors.symbol.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-type">Type</Label>
              <Controller
                control={control}
                name="assetType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as AssetType)}
                  >
                    <SelectTrigger
                      id="add-type"
                      className="bg-background"
                      data-ocid="add-type-select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AssetType.Stock}>Aksje</SelectItem>
                      <SelectItem value={AssetType.Crypto}>Krypto</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-name">Navn</Label>
            <Input
              id="add-name"
              placeholder="f.eks. Bitcoin"
              className="bg-background"
              data-ocid="add-name-input"
              {...register("name", { required: "Navn er påkrevd" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-qty">Antall</Label>
              <Input
                id="add-qty"
                type="number"
                step="any"
                min="0"
                className="bg-background font-mono"
                data-ocid="add-qty-input"
                {...register("quantity", {
                  required: "Antall er påkrevd",
                  min: { value: 0, message: "Kan ikke være negativt" },
                })}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            {assetType === AssetType.Crypto && (
              <div className="space-y-1.5">
                <Label htmlFor="add-staked">Staked</Label>
                <Input
                  id="add-staked"
                  type="number"
                  step="any"
                  min="0"
                  defaultValue="0"
                  className="bg-background font-mono"
                  data-ocid="add-staked-input"
                  {...register("stakedQty")}
                />
              </div>
            )}
          </div>

          {assetType === AssetType.Crypto && (
            <div className="space-y-1.5">
              <Label htmlFor="add-yield">Avkastning (% per år)</Label>
              <Input
                id="add-yield"
                type="number"
                step="0.1"
                min="0"
                defaultValue="0"
                className="bg-background font-mono"
                data-ocid="add-yield-input"
                {...register("yieldRate")}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                reset();
              }}
              disabled={isSubmitting}
              data-ocid="add-cancel-btn"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-ocid="add-submit-btn"
            >
              {isSubmitting ? "Legger til..." : "Legg til"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const { summary, isLoading, dataStatus, setSummary } = usePortfolioStore();
  const { actor } = useActor(createActor);

  const [sortKey, setSortKey] = useState<SortKey>("valueNOK");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [editTarget, setEditTarget] = useState<AssetHolding | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetHolding | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const assets = summary?.assets ?? [];
  const totalValue = summary?.totalValueNOK ?? 0;

  // ── Sort helpers ──────────────────────────────────────────────────────────

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    switch (sortKey) {
      case "name":
        return mul * a.holding.name.localeCompare(b.holding.name);
      case "quantity":
        return mul * (a.holding.quantity - b.holding.quantity);
      case "valueNOK":
        return mul * (a.valueNOK - b.valueNOK);
      case "allocation":
        return mul * (a.valueNOK - b.valueNOK);
      case "price":
        return mul * ((a.price?.priceNOK ?? 0) - (b.price?.priceNOK ?? 0));
      case "dailyChange":
        return mul * ((a.price?.priceUSD ?? 0) - (b.price?.priceUSD ?? 0));
      default:
        return 0;
    }
  });

  // ── Refresh after mutations ───────────────────────────────────────────────

  const refreshSummary = useCallback(async () => {
    if (!actor) return;
    try {
      const updated = await actor.getPortfolioSummary();
      setSummary(updated);
    } catch {
      toast.error("Kunne ikke oppdatere portefølje");
    }
  }, [actor, setSummary]);

  // ── Edit handler ──────────────────────────────────────────────────────────

  const handleEdit = async (updated: AssetHolding) => {
    if (!actor) return;
    await actor.updateAsset(updated);
    toast.success(`${updated.name} oppdatert`);
    setEditTarget(null);
    await refreshSummary();
  };

  // ── Add handler ───────────────────────────────────────────────────────────

  const handleAdd = async (holding: AssetHolding) => {
    if (!actor) return;
    await actor.addAsset(holding);
    toast.success(`${holding.name} lagt til`);
    setShowAdd(false);
    await refreshSummary();
  };

  // ── Delete handler ────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!actor || !deleteTarget) return;
    setIsDeleting(true);
    try {
      await actor.deleteAsset(deleteTarget.symbol);
      toast.success(`${deleteTarget.name} slettet`);
      setDeleteTarget(null);
      await refreshSummary();
    } catch {
      toast.error("Sletting mislyktes");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Th helper ─────────────────────────────────────────────────────────────

  function Th({
    col,
    label,
    className = "",
  }: { col: SortKey; label: string; className?: string }) {
    return (
      <th
        className={`px-3 py-2.5 text-left text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground ${className}`}
      >
        <button
          type="button"
          className="inline-flex items-center cursor-pointer select-none hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          onClick={() => handleSort(col)}
          data-ocid={`sort-${col}`}
        >
          {label}
          <SortIcon active={sortKey === col} dir={sortDir} />
        </button>
      </th>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4" data-ocid="portfolio-page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Portefølje
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversikt over alle beholdninger
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={dataStatus} />
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="gap-1.5"
            data-ocid="add-asset-btn"
          >
            <PackagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Legg til</span>
          </Button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total verdi", value: formatNOK(totalValue) },
          { label: "Aktiva", value: `${assets.length} stk` },
          { label: "USD/NOK", value: summary?.usdNokRate?.toFixed(2) ?? "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card px-3 py-2.5 sm:px-4"
          >
            <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
              {label}
            </p>
            <p className="font-display text-base sm:text-lg font-bold text-foreground mt-0.5 truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Table / cards */}
      <div
        className="rounded-lg border border-border bg-card overflow-hidden"
        data-ocid="portfolio-table"
      >
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Beholdninger</p>
          <span className="text-xs text-muted-foreground font-mono">
            {sortedAssets.length} aktiva
          </span>
        </div>

        {/* Loading */}
        {isLoading && assets.length === 0 ? (
          <div className="p-4">
            <TableRowSkeleton rows={5} />
          </div>
        ) : assets.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground"
            data-ocid="empty-portfolio"
          >
            <PackagePlus className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">Ingen aktiva funnet</p>
            <p className="text-xs">
              Kom i gang ved å legge til ditt første aktiva
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAdd(true)}
              data-ocid="empty-add-btn"
            >
              Legg til aktiva
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/20">
                  <tr>
                    <Th col="name" label="Aktiva" className="pl-4 w-[220px]" />
                    <Th col="quantity" label="Beholdning" />
                    <Th col="price" label="Pris" />
                    <Th col="valueNOK" label="Verdi (NOK)" />
                    <Th col="allocation" label="Andel" />
                    <th className="px-3 py-2.5 text-right text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground pr-4">
                      Handlinger
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedAssets.map(({ holding, price, valueNOK }) => {
                    const allocation =
                      totalValue > 0 ? (valueNOK / totalValue) * 100 : 0;
                    const isCrypto = holding.assetType === AssetType.Crypto;
                    return (
                      <tr
                        key={holding.symbol}
                        className="hover:bg-muted/10 transition-colors group"
                        data-ocid={`portfolio-row-${holding.symbol.toLowerCase()}`}
                      >
                        {/* Asset name + badge */}
                        <td className="pl-4 pr-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                              <span className="font-mono text-[10px] font-bold text-accent">
                                {holding.symbol.slice(0, 3)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                {holding.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {holding.symbol}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 h-4 font-mono"
                                >
                                  {isCrypto ? "Krypto" : "Aksje"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-3 py-3">
                          <p className="font-mono text-sm text-foreground">
                            {formatQty(holding.quantity, holding.symbol)}
                          </p>
                          {holding.stakedQty > 0 && (
                            <p className="font-mono text-xs text-accent mt-0.5">
                              {formatQty(holding.stakedQty, holding.symbol)}{" "}
                              staked
                            </p>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-3 py-3">
                          {price ? (
                            <>
                              <p className="font-mono text-sm text-foreground">
                                {price.priceNOK >= 1
                                  ? formatNOK(price.priceNOK)
                                  : `${price.priceNOK.toFixed(4)} NOK`}
                              </p>
                              {price.priceUSD > 0 && (
                                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                                  $
                                  {price.priceUSD >= 1
                                    ? price.priceUSD.toFixed(2)
                                    : price.priceUSD.toFixed(4)}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs font-mono">
                              —
                            </span>
                          )}
                        </td>

                        {/* Value NOK */}
                        <td className="px-3 py-3">
                          <p className="font-mono font-semibold text-foreground">
                            {formatNOK(valueNOK)}
                          </p>
                        </td>

                        {/* Allocation */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent"
                                style={{
                                  width: `${Math.min(allocation, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="font-mono text-xs text-muted-foreground w-10 text-right">
                              {formatPercent(allocation, false)}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 pr-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => setEditTarget(holding)}
                              aria-label={`Rediger ${holding.name}`}
                              data-ocid={`edit-btn-${holding.symbol.toLowerCase()}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 hover:text-destructive"
                              onClick={() => setDeleteTarget(holding)}
                              aria-label={`Slett ${holding.name}`}
                              data-ocid={`delete-btn-${holding.symbol.toLowerCase()}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border">
              {sortedAssets.map(({ holding, valueNOK }) => {
                const allocation =
                  totalValue > 0 ? (valueNOK / totalValue) * 100 : 0;
                const isCrypto = holding.assetType === AssetType.Crypto;
                return (
                  <div
                    key={holding.symbol}
                    className="flex items-center gap-3 px-4 py-3.5"
                    data-ocid={`portfolio-row-${holding.symbol.toLowerCase()}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                      <span className="font-mono text-[10px] font-bold text-accent">
                        {holding.symbol.slice(0, 3)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {holding.name}
                        </p>
                        <span className="shrink-0 text-[9px] px-1 py-px rounded font-mono bg-muted/40 text-muted-foreground">
                          {isCrypto ? "Krypto" : "Aksje"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {formatQty(holding.quantity, holding.symbol)}
                        {holding.stakedQty > 0 && (
                          <span className="ml-2 text-accent">
                            ({formatQty(holding.stakedQty, holding.symbol)}{" "}
                            staked)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold font-mono text-foreground">
                        {formatNOK(valueNOK)}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {formatPercent(allocation, false)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditTarget(holding)}
                        aria-label={`Rediger ${holding.name}`}
                        data-ocid={`edit-btn-mobile-${holding.symbol.toLowerCase()}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:text-destructive"
                        onClick={() => setDeleteTarget(holding)}
                        aria-label={`Slett ${holding.name}`}
                        data-ocid={`delete-btn-mobile-${holding.symbol.toLowerCase()}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <EditModal
        holding={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
      />

      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="delete-confirm-dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Slett aktiva
            </AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>{" "}
              ({deleteTarget?.symbol}) fra porteføljen? Denne handlingen kan
              ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              data-ocid="delete-cancel-btn"
            >
              Avbryt
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="delete-confirm-btn"
            >
              {isDeleting ? "Sletter..." : "Slett"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
