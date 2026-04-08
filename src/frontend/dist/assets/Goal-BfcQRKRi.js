import { c as createLucideIcon, b as usePortfolioStore, r as reactExports, j as jsxRuntimeExports, q as CardSkeleton, s as Target, d as formatNOK, f as formatPercent, T as TrendingUp } from "./index-BeUVb1Bc.js";
import { Z as Zap } from "./zap-DzQhQbPB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode);
const GOAL_NOK = 1e7;
const STAKED_ICP = 9e3;
const ICP_YIELD_RATE = 0.077;
const ICP_PRICE_NOK_FALLBACK = 90;
const MILESTONES = [25, 50, 75, 100];
const SCENARIOS = [
  {
    label: "Konservativ",
    labelEn: "conservative",
    rate: 0.05,
    accent: "text-muted-foreground",
    bg: "bg-muted/20",
    border: "border-border",
    icon: "🛡️"
  },
  {
    label: "Moderat",
    labelEn: "moderate",
    rate: 0.12,
    accent: "text-[oklch(var(--chart-2))]",
    bg: "bg-[oklch(var(--chart-2)/0.08)]",
    border: "border-[oklch(var(--chart-2)/0.25)]",
    icon: "📈"
  },
  {
    label: "Optimistisk",
    labelEn: "optimistic",
    rate: 0.25,
    accent: "text-[oklch(var(--chart-1))]",
    bg: "bg-[oklch(var(--chart-1)/0.08)]",
    border: "border-[oklch(var(--chart-1)/0.25)]",
    icon: "🚀"
  }
];
function yearsToGoal(current, annualGrowthRate, annualYieldNOK) {
  if (current >= GOAL_NOK) return 0;
  if (annualGrowthRate <= 0 && annualYieldNOK <= 0) return null;
  let value = current;
  for (let year = 1; year <= 100; year++) {
    value = value * (1 + annualGrowthRate) + annualYieldNOK;
    if (value >= GOAL_NOK) return year;
  }
  return null;
}
function estimatedDate(years) {
  const date = /* @__PURE__ */ new Date();
  const fullYears = Math.floor(years);
  const months = Math.round((years - fullYears) * 12);
  date.setFullYear(date.getFullYear() + fullYears);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("nb-NO", { month: "short", year: "numeric" });
}
function dailyMonthlyRequired(current, targetYears = 5) {
  if (current >= GOAL_NOK) return { daily: 0, monthly: 0 };
  const needed = GOAL_NOK - current;
  const targetDays = targetYears * 365;
  const targetMonths = targetYears * 12;
  return {
    daily: needed / targetDays,
    monthly: needed / targetMonths
  };
}
function Goal() {
  const { summary, isLoading } = usePortfolioStore();
  const current = (summary == null ? void 0 : summary.totalValueNOK) ?? 0;
  const icpPriceNOK = reactExports.useMemo(() => {
    var _a;
    const icpAsset = summary == null ? void 0 : summary.assets.find((a) => a.holding.symbol === "ICP");
    return ((_a = icpAsset == null ? void 0 : icpAsset.price) == null ? void 0 : _a.priceNOK) ?? ICP_PRICE_NOK_FALLBACK;
  }, [summary]);
  const annualYieldNOK = STAKED_ICP * ICP_YIELD_RATE * icpPriceNOK;
  const progress = Math.min(current / GOAL_NOK * 100, 100);
  const remaining = Math.max(GOAL_NOK - current, 0);
  const { daily, monthly } = dailyMonthlyRequired(current);
  const scenarios = reactExports.useMemo(
    () => SCENARIOS.map((s) => {
      const years = yearsToGoal(current, s.rate, annualYieldNOK);
      return { ...s, years };
    }),
    [current, annualYieldNOK]
  );
  if (isLoading && !summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "goal-page-loading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-6", "data-ocid": "goal-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground leading-tight", children: "Målsporing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
          "Mål: ",
          formatNOK(GOAL_NOK)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-5 space-y-5",
        "data-ocid": "goal-hero",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1", children: "Nåværende verdi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-bold text-foreground leading-none", children: formatNOK(current, true) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground mt-1", children: formatNOK(current) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1", children: "Målverdi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-bold text-primary/80 leading-none", children: "10 MNOK" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground mt-1", children: "10 000 000 NOK" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-5 w-full rounded-full bg-muted/40 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-700 ease-out",
                  style: {
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, oklch(var(--chart-1)), oklch(var(--accent)))"
                  },
                  tabIndex: 0,
                  role: "progressbar",
                  "aria-valuenow": Math.round(progress),
                  "aria-valuemin": 0,
                  "aria-valuemax": 100,
                  "aria-label": `${progress.toFixed(1)}% av mål nådd`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 rounded-full opacity-30",
                  style: {
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                    backgroundSize: "200% 100%"
                  },
                  "aria-hidden": true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full h-4", children: MILESTONES.map((m) => {
              const reached = progress >= m;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute flex flex-col items-center",
                  style: { left: `${m}%`, transform: "translateX(-50%)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-0.5 h-2 rounded-full transition-colors duration-500 ${reached ? "bg-primary/80" : "bg-muted-foreground/30"}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `text-[9px] font-mono mt-0.5 transition-colors duration-500 ${reached ? "text-primary font-semibold" : "text-muted-foreground/50"}`,
                        children: [
                          m,
                          "%"
                        ]
                      }
                    )
                  ]
                },
                m
              );
            }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4",
          "data-ocid": "goal-stat-progress",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Oppnådd" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground mt-1 tabular-nums", children: formatPercent(progress, false) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4",
          "data-ocid": "goal-stat-remaining",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Gjenstår" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground mt-1 tabular-nums", children: formatNOK(remaining, true) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4",
          "data-ocid": "goal-stat-daily",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Per dag (5år)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground mt-1 tabular-nums", children: formatNOK(daily, true) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4",
          "data-ocid": "goal-stat-monthly",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Per måned (5år)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground mt-1 tabular-nums", children: formatNOK(monthly, true) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "goal-scenarios", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Scenarioer — estimert tid til mål" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono mb-3", children: [
        "Inkluderer ICP-avkastning (",
        formatNOK(annualYieldNOK, true),
        " / år)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3", children: scenarios.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-xl border p-4 space-y-3 ${s.bg} ${s.border}`,
          "data-ocid": `goal-scenario-${s.labelEn}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
                s.icon,
                " ",
                s.label
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background/60 ${s.accent}`,
                  children: [
                    (s.rate * 100).toFixed(0),
                    "% / år"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground uppercase tracking-wider", children: "Estimert tid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `font-display text-2xl font-bold mt-0.5 ${s.accent}`,
                  children: s.years === null ? "Over 100 år" : s.years === 0 ? "Nådd! 🎉" : `${s.years} år`
                }
              )
            ] }),
            s.years !== null && s.years > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-3 w-3 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: estimatedDate(s.years) })
            ] })
          ]
        },
        s.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-5",
        "data-ocid": "goal-required-growth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-[oklch(var(--chart-2))]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Nødvendig vekst for å nå mål" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Per dag" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground tabular-nums", children: formatNOK(daily) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "for å nå 10M på 5 år" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Per måned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground tabular-nums", children: formatNOK(monthly) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "for å nå 10M på 5 år" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
            "Beregnet som lineær vekst fra",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatNOK(current, true) }),
            " ",
            "til ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "10 MNOK" }),
            " over 5 år, uten reinvestering."
          ] }) })
        ]
      }
    )
  ] });
}
export {
  Goal as default
};
