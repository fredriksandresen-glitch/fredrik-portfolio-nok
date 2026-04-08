import { c as createLucideIcon, l as useActor, b as usePortfolioStore, r as reactExports, j as jsxRuntimeExports, x as Settings, s as Target, d as formatNOK, e as formatRelativeTime, n as formatQty, A as AssetType, p as createActor } from "./index-BeUVb1Bc.js";
import { Z as Zap } from "./zap-DzQhQbPB.js";
import { R as RefreshCw } from "./refresh-cw-BFZzeMsj.js";
import { T as Trash2 } from "./trash-2-BRpumYwh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
];
const Database = createLucideIcon("database", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
const GOAL_KEY = "portfolio_goal_nok";
const DEFAULT_GOAL = 1e7;
const EMPTY_HOLDING = {
  symbol: "",
  name: "",
  quantity: 0,
  stakedQty: 0,
  yieldRate: 0,
  assetType: "Crypto"
};
function SectionCard({
  icon: Icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-accent", "aria-hidden": true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children })
  ] });
}
function StatusRow({
  label,
  isLive,
  lastFetch
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3 border-b border-border/50 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: isLive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      CircleCheck,
      {
        className: "h-4 w-4 text-[oklch(var(--color-success))]",
        "aria-hidden": true
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-muted-foreground", "aria-hidden": true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: [
        isLive ? "Live data" : "Mock data",
        " · Sist:",
        " ",
        formatRelativeTime(lastFetch)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: `shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${isLive ? "bg-[oklch(var(--color-success)/0.12)] text-[oklch(var(--color-success))] border border-[oklch(var(--color-success)/0.3)]" : "bg-muted text-muted-foreground border border-border"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-1.5 w-1.5 fill-current", "aria-hidden": true }),
          isLive ? "Live" : "Mock"
        ]
      }
    )
  ] });
}
function Innstillinger() {
  const { actor } = useActor(createActor);
  const { summary, lastUpdated, isLoading } = usePortfolioStore();
  const [goalAmount, setGoalAmount] = reactExports.useState(() => {
    const stored = localStorage.getItem(GOAL_KEY);
    return stored ? Number(stored) : DEFAULT_GOAL;
  });
  const [goalInput, setGoalInput] = reactExports.useState(() => {
    const stored = localStorage.getItem(GOAL_KEY);
    return stored ?? String(DEFAULT_GOAL);
  });
  const [goalSaved, setGoalSaved] = reactExports.useState(false);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ ...EMPTY_HOLDING });
  const [saving, setSaving] = reactExports.useState(false);
  const [toasts, setToasts] = reactExports.useState([]);
  const toastIdRef = reactExports.useRef(0);
  function pushToast(type, text) {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4500
    );
  }
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
    setTimeout(() => setGoalSaved(false), 2e3);
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
  async function handleDelete(symbol) {
    if (!actor) return;
    if (!confirm(`Slett ${symbol} fra porteføljen?`)) return;
    try {
      await actor.deleteAsset(symbol);
      pushToast("success", `${symbol} fjernet fra porteføljen`);
    } catch {
      pushToast("error", `Feil ved sletting av ${symbol}`);
    }
  }
  async function handleAddAsset(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const holding = {
        symbol: form.symbol.toUpperCase(),
        name: form.name,
        quantity: Number(form.quantity),
        stakedQty: Number(form.stakedQty),
        yieldRate: Number(form.yieldRate) / 100,
        assetType: form.assetType === "Stock" ? AssetType.Stock : AssetType.Crypto
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
  const assets = (summary == null ? void 0 : summary.assets) ?? [];
  const totalValueNOK = (summary == null ? void 0 : summary.totalValueNOK) ?? 0;
  const goalProgress = goalAmount > 0 ? Math.min(totalValueNOK / goalAmount * 100, 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-5 pb-8",
      "data-ocid": "innstillinger-page",
      "aria-label": "Innstillinger",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-accent", "aria-hidden": true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Innstillinger" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { icon: Target, title: "Porteføljeinnstillinger", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "goal-amount",
                className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                children: "Sparemål (NOK)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "goal-amount",
                  type: "number",
                  min: 1,
                  step: 1e5,
                  value: goalInput,
                  onChange: (e) => setGoalInput(e.target.value),
                  onBlur: () => {
                    const parsed = Number(
                      goalInput.replace(/\s/g, "").replace(",", ".")
                    );
                    if (!Number.isNaN(parsed) && parsed > 0) {
                      setGoalInput(String(parsed));
                    }
                  },
                  className: "flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-smooth",
                  "data-ocid": "goal-amount-input",
                  "aria-label": "Sparemål i NOK"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleGoalSave,
                  className: "px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth disabled:opacity-50",
                  "data-ocid": "save-goal-btn",
                  children: goalSaved ? "Lagret ✓" : "Lagre"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Fremgang mot mål" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground font-medium", children: [
                goalProgress.toFixed(1),
                "% av ",
                formatNOK(goalAmount, true)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-2 w-full rounded-full bg-muted overflow-hidden",
                role: "progressbar",
                "aria-valuenow": goalProgress,
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": "Fremgang mot sparemål",
                tabIndex: 0,
                "data-ocid": "goal-progress-bar",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-accent transition-all duration-700",
                    style: { width: `${goalProgress}%` }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
              "Nåværende:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatNOK(totalValueNOK) }),
              " ",
              "· Gjenstår:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatNOK(Math.max(goalAmount - totalValueNOK, 0)) })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { icon: Zap, title: "API-status", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusRow,
              {
                label: "Finnhub (aksjer: BMNR, MSTR, SBET)",
                isLive: finnhubLive,
                lastFetch: lastPriceDate
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusRow,
              {
                label: "CoinGecko (krypto: ICP, BTC)",
                isLive: coingeckoLive,
                lastFetch: lastPriceDate
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg bg-muted/40 border border-border/50 px-4 py-3 flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Info,
              {
                className: "h-4 w-4 text-muted-foreground shrink-0 mt-0.5",
                "aria-hidden": true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "API-nøkler for Finnhub og CoinGecko håndteres sikkert i backend og eksponeres aldri i frontend-koden. Alle prisforespørsler går via backend-kanisteret." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { icon: Clock, title: "Oppdateringsfrekvens", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Prisoppdatering" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Automatisk oppdatering av kurser" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-sm font-semibold text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5",
                "data-ocid": "refresh-interval-display",
                children: "5 min"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 pt-3 border-t border-border/50", children: "Oppdateringsintervallet er konfigurert i backend. Manuell oppdatering er tilgjengelig i seksjonen under." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { icon: Database, title: "Datasynkronisering", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Oppdater priser nå" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Henter ferske kurser fra Finnhub og CoinGecko umiddelbart" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleRefresh,
                disabled: isRefreshing || !actor,
                className: "inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-smooth font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0",
                "data-ocid": "refresh-prices-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`,
                      "aria-hidden": true
                    }
                  ),
                  isRefreshing ? "Oppdaterer..." : "Oppdater priser nå"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Lagre daglig snapshot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Lagrer nåværende porteføljeverdi i historikken" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleSnapshot,
                disabled: !actor || isLoading,
                className: "inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-muted/60 disabled:opacity-50 transition-smooth font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 border border-border",
                "data-ocid": "record-snapshot-btn",
                children: "Lagre daglig snapshot"
              }
            )
          ] }),
          lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono pt-1", children: [
            "Sist oppdatert: ",
            formatRelativeTime(lastUpdated)
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-card overflow-hidden",
            "data-ocid": "asset-management",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 text-accent", "aria-hidden": true }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-sm font-semibold text-foreground", children: [
                    "Porteføljehåndtering",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs font-normal text-muted-foreground font-mono", children: [
                      "(",
                      assets.length,
                      " aktiva)"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAddForm((v) => !v),
                    className: "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-smooth font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-accent/20",
                    "data-ocid": "add-asset-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5", "aria-hidden": true }),
                      "Legg til"
                    ]
                  }
                )
              ] }),
              showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleAddAsset,
                  className: "p-5 border-b border-border bg-muted/10 space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Nytt aktivum" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "text-xs text-muted-foreground font-medium",
                            htmlFor: "new-symbol",
                            children: "Symbol"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "new-symbol",
                            required: true,
                            value: form.symbol,
                            onChange: (e) => setForm((f) => ({ ...f, symbol: e.target.value })),
                            placeholder: "f.eks. BTC",
                            className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono",
                            "data-ocid": "new-asset-symbol"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "text-xs text-muted-foreground font-medium",
                            htmlFor: "new-name",
                            children: "Navn"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "new-name",
                            required: true,
                            value: form.name,
                            onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                            placeholder: "f.eks. Bitcoin",
                            className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                            "data-ocid": "new-asset-name"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "text-xs text-muted-foreground font-medium",
                            htmlFor: "new-qty",
                            children: "Antall"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "new-qty",
                            type: "number",
                            step: "any",
                            required: true,
                            value: form.quantity,
                            onChange: (e) => setForm((f) => ({
                              ...f,
                              quantity: Number(e.target.value)
                            })),
                            className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono",
                            "data-ocid": "new-asset-qty"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "text-xs text-muted-foreground font-medium",
                            htmlFor: "new-staked",
                            children: "Staked"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "new-staked",
                            type: "number",
                            step: "any",
                            value: form.stakedQty,
                            onChange: (e) => setForm((f) => ({
                              ...f,
                              stakedQty: Number(e.target.value)
                            })),
                            className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono",
                            "data-ocid": "new-asset-staked"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "text-xs text-muted-foreground font-medium",
                            htmlFor: "new-yield",
                            children: "Yield % p.a."
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "new-yield",
                            type: "number",
                            step: "0.1",
                            value: form.yieldRate,
                            onChange: (e) => setForm((f) => ({
                              ...f,
                              yieldRate: Number(e.target.value)
                            })),
                            className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono",
                            "data-ocid": "new-asset-yield"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            className: "text-xs text-muted-foreground font-medium",
                            htmlFor: "new-type",
                            children: "Type"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "select",
                          {
                            id: "new-type",
                            value: form.assetType,
                            onChange: (e) => setForm((f) => ({ ...f, assetType: e.target.value })),
                            className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                            "data-ocid": "new-asset-type",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Crypto", children: "Krypto" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Stock", children: "Aksje" })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowAddForm(false),
                          className: "px-4 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "data-ocid": "cancel-add-asset",
                          children: "Avbryt"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "submit",
                          disabled: saving || !actor,
                          className: "px-5 py-2 text-sm rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-smooth font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "data-ocid": "submit-add-asset",
                          children: saving ? "Lagrer..." : "Lagre aktivum"
                        }
                      )
                    ] })
                  ]
                }
              ),
              assets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground",
                  "data-ocid": "empty-assets-settings",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-8 w-8 opacity-30", "aria-hidden": true }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Ingen aktiva registrert" })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: assets.map(({ holding, valueNOK }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 px-5 py-3.5 hover:bg-muted/10 transition-smooth",
                  "data-ocid": `settings-asset-${holding.symbol.toLowerCase()}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-bold text-accent", children: holding.symbol.slice(0, 3) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: holding.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: [
                        formatQty(holding.quantity, holding.symbol),
                        holding.stakedQty > 0 && ` · ${holding.stakedQty} staked`,
                        holding.yieldRate > 0 && ` · ${(holding.yieldRate * 100).toFixed(1)}% yield`
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-semibold text-foreground", children: formatNOK(valueNOK) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono uppercase", children: holding.assetType === AssetType.Crypto ? "Krypto" : "Aksje" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDelete(holding.symbol),
                        "aria-label": `Slett ${holding.symbol}`,
                        className: "p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "data-ocid": `delete-asset-${holding.symbol.toLowerCase()}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4", "aria-hidden": true })
                      }
                    )
                  ]
                },
                holding.symbol
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { icon: Info, title: "Om appen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Versjon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-semibold text-foreground", children: "v1.0.0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Aktiva" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-mono font-semibold text-foreground", children: [
                assets.length,
                " registrert"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Porteføljeverdi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-semibold text-foreground", children: formatNOK(totalValueNOK, true) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 border border-border/50 px-4 py-3 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Sparemål" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-semibold text-foreground", children: formatNOK(goalAmount, true) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Datakilder" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://finnhub.io",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "data-ocid": "link-finnhub",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-accent", "aria-hidden": true }),
                    "Finnhub (aksjer)"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://www.coingecko.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "data-ocid": "link-coingecko",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-accent", "aria-hidden": true }),
                    "CoinGecko (krypto)"
                  ]
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-live": "polite",
            "aria-atomic": "false",
            className: "fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 z-50 flex flex-col gap-2 pointer-events-none",
            "data-ocid": "toast-container",
            children: toasts.map((toast) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                role: "alert",
                className: `pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm text-sm font-medium animate-in slide-in-from-bottom-2 duration-300 ${toast.type === "success" ? "bg-card border-[oklch(var(--color-success)/0.35)] text-[oklch(var(--color-success))]" : "bg-destructive/20 border-destructive/40 text-destructive"}`,
                children: [
                  toast.type === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0", "aria-hidden": true }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 shrink-0", "aria-hidden": true }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0 break-words", children: toast.text })
                ]
              },
              toast.id
            ))
          }
        )
      ]
    }
  );
}
export {
  Innstillinger as default
};
