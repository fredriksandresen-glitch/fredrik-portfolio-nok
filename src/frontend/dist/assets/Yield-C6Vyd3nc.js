import { c as createLucideIcon, b as usePortfolioStore, j as jsxRuntimeExports, q as CardSkeleton, d as formatNOK, T as TrendingUp, f as formatPercent } from "./index-BeUVb1Bc.js";
import { C as Coins } from "./coins-BbH5a3AI.js";
import { x as generateCategoricalChart, H as Bar, X as XAxis, Y as YAxis, I as formatAxisMap, R as ResponsiveContainer, E as CartesianGrid, z as Tooltip } from "./generateCategoricalChart-De5RRHLJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode);
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
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
  "Des"
];
function buildProjectionData(totalMonthlyNOK) {
  const now = /* @__PURE__ */ new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      month: MONTHS_NO[d.getMonth()],
      kumulativ: Math.round(totalMonthlyNOK * (i + 1)),
      maanedlig: Math.round(totalMonthlyNOK)
    };
  });
}
function CustomTooltip({ active, payload, label }) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-popover p-3 shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground mb-1", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-bold text-accent", children: formatNOK(p.value) }, p.name))
  ] });
}
function Yield() {
  const { yieldInfo, isLoading } = usePortfolioStore();
  const activeYield = yieldInfo.filter((y) => y.annualYieldRate > 0);
  const totalMonthlyNOK = activeYield.reduce(
    (sum, y) => sum + y.monthlyYieldNOK,
    0
  );
  const totalYearlyNOK = activeYield.reduce(
    (sum, y) => sum + y.yearlyYieldNOK,
    0
  );
  const projectionData = buildProjectionData(totalMonthlyNOK);
  if (isLoading && activeYield.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "yield-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Yield" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardSkeleton, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-8", "data-ocid": "yield-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Yield" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", "data-ocid": "yield-summary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-card px-4 py-4 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent/5 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-wider", children: "Månedlig yield" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-accent leading-tight", children: formatNOK(totalMonthlyNOK) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-mono mt-1", children: "per måned" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/20 bg-card px-4 py-4 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent/5 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-wider", children: "Årlig yield" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-accent leading-tight", children: formatNOK(totalYearlyNOK) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-mono mt-1", children: "per år" })
      ] })
    ] }),
    activeYield.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-dashed border-border p-10 text-center",
        "data-ocid": "empty-yield",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Ingen yield-aktiva registrert" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "yield-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground px-0.5", children: "Yield-aktiva" }),
        activeYield.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-card p-4",
            "data-ocid": `yield-card-${y.symbol.toLowerCase()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-accent" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-tight", children: y.symbol }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-mono", children: [
                      y.stakedQty.toLocaleString("nb-NO"),
                      " staked"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full", children: [
                  formatPercent(y.annualYieldRate * 100, false),
                  " p.a."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border/50 p-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1", children: "Månedlig" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold font-mono text-foreground leading-tight", children: formatNOK(y.monthlyYieldNOK) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-mono mt-0.5", children: [
                    y.monthlyYieldAsset.toFixed(3),
                    " ",
                    y.symbol
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border/50 p-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1", children: "Årlig" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold font-mono text-foreground leading-tight", children: formatNOK(y.yearlyYieldNOK) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-mono mt-0.5", children: [
                    y.yearlyYieldAsset.toFixed(2),
                    " ",
                    y.symbol
                  ] })
                ] })
              ] })
            ]
          },
          y.symbol
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card overflow-hidden",
          "data-ocid": "yield-table",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Yield-oversikt" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: "Symbol" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: "Staked" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: "Rate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: "Mnd NOK" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground", children: "År NOK" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: activeYield.map((y, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: i < activeYield.length - 1 ? "border-b border-border/30" : "",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-foreground text-xs", children: y.symbol }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-xs text-muted-foreground", children: y.stakedQty.toLocaleString("nb-NO") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-accent", children: formatPercent(y.annualYieldRate * 100, false) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-xs text-foreground font-semibold", children: formatNOK(y.monthlyYieldNOK) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-xs text-foreground font-semibold", children: formatNOK(y.yearlyYieldNOK) })
                  ]
                },
                y.symbol
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border bg-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: 3,
                    className: "px-4 py-3 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider",
                    children: "Totalt"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-xs font-bold text-accent", children: formatNOK(totalMonthlyNOK) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-xs font-bold text-accent", children: formatNOK(totalYearlyNOK) })
              ] }) })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card overflow-hidden",
          "data-ocid": "yield-chart",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Kumulativ yield — neste 12 måneder" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              BarChart,
              {
                data: projectionData,
                margin: { top: 4, right: 4, left: 0, bottom: 0 },
                barSize: 18,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      stroke: "oklch(var(--border))",
                      vertical: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    XAxis,
                    {
                      dataKey: "month",
                      tick: {
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        fill: "oklch(var(--muted-foreground))"
                      },
                      axisLine: false,
                      tickLine: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      tickFormatter: (v) => {
                        if (v >= 1e3) return `${(v / 1e3).toFixed(0)}k`;
                        return String(v);
                      },
                      tick: {
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        fill: "oklch(var(--muted-foreground))"
                      },
                      axisLine: false,
                      tickLine: false,
                      width: 42
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}),
                      cursor: { fill: "oklch(var(--accent) / 0.06)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "kumulativ",
                      fill: "oklch(var(--accent))",
                      radius: [4, 4, 0, 0],
                      name: "Kumulativ yield"
                    }
                  )
                ]
              }
            ) }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-dashed border-border/60 bg-card/50 p-5",
        "data-ocid": "yield-add-source",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Legg til yield-kilde" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Staking, lending, eller annen passiv inntekt" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: true,
              "aria-label": "Legg til yield-kilde (kommer snart)",
              className: "flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs font-mono text-muted-foreground cursor-not-allowed opacity-50 transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" }),
                "Legg til"
              ]
            }
          )
        ] })
      }
    )
  ] });
}
export {
  Yield as default
};
