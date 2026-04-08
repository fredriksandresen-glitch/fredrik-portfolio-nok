import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, i as cn, b as usePortfolioStore, A as AssetType, d as formatNOK, s as Target, T as TrendingUp } from "./index-BeUVb1Bc.js";
import { u as useComposedRefs, a as Badge, B as Button } from "./button-D-MqWtTN.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardContent, L as LineChart, a as Line, M as Minus, T as TrendingDown } from "./LineChart-D1o4PYUv.js";
import { a as useControllableState, P as Primitive, c as composeEventHandlers, i as usePrevious, h as useSize, e as createContextScope, L as Label } from "./index-DwFEGl36.js";
import { R as ResponsiveContainer, E as CartesianGrid, X as XAxis, Y as YAxis, z as Tooltip, B as Legend, J as ReferenceLine } from "./generateCategoricalChart-De5RRHLJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const GOAL_NOK = 1e7;
const MILESTONES = [1, 3, 5, 10];
const ICP_STAKED_FRACTION = 0.529;
const ICP_YIELD_RATE = 0.077;
const SCENARIOS = [
  {
    key: "bull",
    label: "Bull",
    cryptoGrowth: 40,
    stocksGrowth: 20,
    color: "oklch(75% 0.2 152)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" })
  },
  {
    key: "base",
    label: "Base",
    cryptoGrowth: 15,
    stocksGrowth: 10,
    color: "oklch(72% 0.18 252)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
  },
  {
    key: "bear",
    label: "Bear",
    cryptoGrowth: -10,
    stocksGrowth: 2,
    color: "oklch(65% 0.19 22)",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-4 h-4" })
  }
];
const DEFAULT_INPUTS = {
  monthlySavings: 1e4,
  cryptoGrowth: 15,
  stocksGrowth: 10,
  yieldReinvest: true,
  nokUsdRate: 10.5
};
function projectValue(initialCryptoNOK, initialStocksNOK, inputs, cryptoGrowth, stocksGrowth, years) {
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
function buildProjections(cryptoNOK, stocksNOK, inputs) {
  const points = [];
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
        year
      ),
      bear: projectValue(cryptoNOK, stocksNOK, inputs, -10, 2, year)
    });
  }
  return points;
}
function findGoalYear(points, key) {
  for (const p of points) {
    if (p[key] >= GOAL_NOK) return `År ${p.year}`;
  }
  return "Ikke nådd";
}
function CustomTooltip({
  active,
  payload,
  label
}) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-3 shadow-lg text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-2 font-medium font-mono", children: [
      "År ",
      label
    ] }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 last:mb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "w-2 h-2 rounded-full shrink-0",
          style: { background: p.color }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono font-semibold", children: formatNOK(p.value, true) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: p.name })
    ] }, p.name))
  ] });
}
function SliderInput({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  dataOcid
}) {
  const pct = Math.max(0, Math.min(100, (value - min) / (max - min) * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-primary font-semibold tabular-nums", children: displayValue })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-5 flex items-center group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-primary rounded-full transition-all duration-75",
          style: { width: `${pct}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min,
          max,
          step,
          value,
          onChange: (e) => onChange(Number(e.target.value)),
          "data-ocid": dataOcid,
          className: "absolute inset-0 w-full opacity-0 cursor-pointer h-5",
          "aria-label": label,
          "aria-valuemin": min,
          "aria-valuemax": max,
          "aria-valuenow": value,
          "aria-valuetext": displayValue
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute w-4 h-4 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-all duration-75 group-hover:scale-110",
          style: { left: `calc(${pct}% - 8px)` }
        }
      )
    ] })
  ] });
}
function Simulator() {
  const { summary } = usePortfolioStore();
  const [inputs, setInputs] = reactExports.useState(DEFAULT_INPUTS);
  const { cryptoNOK, stocksNOK } = reactExports.useMemo(() => {
    if (!summary) return { cryptoNOK: 14e5, stocksNOK: 38e4 };
    let crypto = 0;
    let stocks = 0;
    for (const a of summary.assets) {
      if (a.holding.assetType === AssetType.Crypto) crypto += a.valueNOK;
      else stocks += a.valueNOK;
    }
    return { cryptoNOK: crypto || 14e5, stocksNOK: stocks || 38e4 };
  }, [summary]);
  const totalNOK = cryptoNOK + stocksNOK;
  const projections = reactExports.useMemo(
    () => buildProjections(cryptoNOK, stocksNOK, inputs),
    [cryptoNOK, stocksNOK, inputs]
  );
  const milestones = reactExports.useMemo(
    () => MILESTONES.map((y) => {
      const p = projections.find((pt) => pt.year === y) ?? projections[projections.length - 1];
      return {
        year: y,
        label: `${y} år`,
        bull: p.bull,
        base: p.base,
        bear: p.bear
      };
    }),
    [projections]
  );
  const applyScenario = reactExports.useCallback((s) => {
    setInputs((prev) => ({
      ...prev,
      cryptoGrowth: s.cryptoGrowth,
      stocksGrowth: s.stocksGrowth
    }));
  }, []);
  const resetInputs = reactExports.useCallback(() => setInputs(DEFAULT_INPUTS), []);
  const update = reactExports.useCallback(
    (key, val) => {
      setInputs((prev) => ({ ...prev, [key]: val }));
    },
    []
  );
  const isBullActive = inputs.cryptoGrowth === 40 && inputs.stocksGrowth === 20;
  const isBearActive = inputs.cryptoGrowth === -10 && inputs.stocksGrowth === 2;
  const isBaseActive = !isBullActive && !isBearActive;
  const activeMap = {
    bull: isBullActive,
    base: isBaseActive,
    bear: isBearActive
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-5 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight", children: "Simulator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Projiser porteføljens fremtidige verdi" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "font-mono text-xs hidden sm:flex",
            children: [
              "Basis: ",
              formatNOK(totalNOK, true)
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: resetInputs,
            "data-ocid": "simulator-reset",
            className: "gap-1.5 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }),
              "Nullstill"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: SCENARIOS.map((s) => {
        const active = activeMap[s.key];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => applyScenario(s),
            "data-ocid": `scenario-${s.key}`,
            className: [
              "flex flex-col items-center gap-1.5 rounded-xl border p-3 sm:p-4 transition-smooth cursor-pointer",
              active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: { color: active ? "oklch(72% 0.18 252)" : s.color },
                  children: s.icon
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs sm:text-sm font-semibold ${active ? "text-primary" : "text-muted-foreground"}`,
                  children: s.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-[10px] sm:text-xs font-mono ${active ? "text-primary/70" : "text-muted-foreground/70"}`,
                  children: [
                    "K ",
                    s.cryptoGrowth > 0 ? "+" : "",
                    s.cryptoGrowth,
                    "% / A +",
                    s.stocksGrowth,
                    "%"
                  ]
                }
              )
            ]
          },
          s.key
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Parametere" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderInput,
              {
                label: "Månedlig sparing",
                value: inputs.monthlySavings,
                min: 0,
                max: 1e5,
                step: 1e3,
                displayValue: formatNOK(inputs.monthlySavings, true),
                onChange: (v) => update("monthlySavings", v),
                dataOcid: "input-monthly-savings"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderInput,
              {
                label: "Krypto vekst (% per år)",
                value: inputs.cryptoGrowth,
                min: -30,
                max: 100,
                step: 1,
                displayValue: `${inputs.cryptoGrowth > 0 ? "+" : ""}${inputs.cryptoGrowth}%`,
                onChange: (v) => update("cryptoGrowth", v),
                dataOcid: "input-crypto-growth"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderInput,
              {
                label: "Aksjer vekst (% per år)",
                value: inputs.stocksGrowth,
                min: -20,
                max: 50,
                step: 1,
                displayValue: `${inputs.stocksGrowth > 0 ? "+" : ""}${inputs.stocksGrowth}%`,
                onChange: (v) => update("stocksGrowth", v),
                dataOcid: "input-stocks-growth"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderInput,
              {
                label: "NOK/USD kurs",
                value: inputs.nokUsdRate,
                min: 8,
                max: 16,
                step: 0.1,
                displayValue: inputs.nokUsdRate.toFixed(1),
                onChange: (v) => update("nokUsdRate", v),
                dataOcid: "input-nok-usd-rate"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-foreground cursor-pointer", children: "Reinvester ICP-avkastning" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "7.7% p.a. på 9 000 stakede ICP" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: inputs.yieldReinvest,
                  onCheckedChange: (v) => update("yieldReinvest", v),
                  "data-ocid": "toggle-yield-reinvest"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border/50 p-3 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Nåværende portefølje" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-0.5", children: "Krypto" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-foreground text-sm", children: formatNOK(cryptoNOK, true) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-0.5", children: "Aksjer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-foreground text-sm", children: formatNOK(stocksNOK, true) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-1.5 rounded-full overflow-hidden mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "bg-primary",
                    style: { width: `${cryptoNOK / totalNOK * 100}%` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-accent/50" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "10-års projeksjon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-3.5 h-3.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10M NOK mål" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-[320px] sm:h-[380px] w-full",
              "data-ocid": "simulator-chart",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                LineChart,
                {
                  data: projections,
                  margin: { top: 8, right: 16, left: 0, bottom: 0 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CartesianGrid,
                      {
                        strokeDasharray: "3 3",
                        stroke: "oklch(0.24 0 0)",
                        strokeOpacity: 0.6
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "year",
                        tickLine: false,
                        axisLine: false,
                        tick: {
                          fill: "oklch(0.52 0 0)",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)"
                        },
                        tickFormatter: (v) => `${v}y`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        tickLine: false,
                        axisLine: false,
                        tick: {
                          fill: "oklch(0.52 0 0)",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)"
                        },
                        tickFormatter: (v) => formatNOK(v, true),
                        width: 76
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Legend,
                      {
                        iconType: "circle",
                        iconSize: 8,
                        wrapperStyle: {
                          fontSize: "12px",
                          paddingTop: "12px",
                          fontFamily: "var(--font-mono)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ReferenceLine,
                      {
                        y: GOAL_NOK,
                        stroke: "oklch(0.72 0.18 252)",
                        strokeDasharray: "6 3",
                        strokeWidth: 1.5,
                        label: {
                          value: "10M mål",
                          fill: "oklch(0.72 0.18 252)",
                          fontSize: 10,
                          position: "insideTopRight",
                          fontFamily: "var(--font-mono)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "bull",
                        name: "Bull",
                        stroke: SCENARIOS[0].color,
                        strokeWidth: 2,
                        dot: false,
                        activeDot: { r: 4, fill: SCENARIOS[0].color }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "base",
                        name: "Base",
                        stroke: SCENARIOS[1].color,
                        strokeWidth: 2.5,
                        dot: false,
                        activeDot: { r: 4, fill: SCENARIOS[1].color }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "bear",
                        name: "Bear",
                        stroke: SCENARIOS[2].color,
                        strokeWidth: 2,
                        strokeDasharray: "5 3",
                        dot: false,
                        activeDot: { r: 4, fill: SCENARIOS[2].color }
                      }
                    )
                  ]
                }
              ) })
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: SCENARIOS.map((s) => {
        const goalYear = findGoalYear(projections, s.key);
        const reached = goalYear !== "Ikke nådd";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: `bg-card border-border ${reached ? "ring-1 ring-primary/40" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4 px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: s.color }, children: s.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: s.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "10M NOK nås" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-base sm:text-lg font-mono font-bold tabular-nums ${reached ? "text-primary" : "text-muted-foreground"}`,
                  "data-ocid": `goal-year-${s.key}`,
                  children: goalYear
                }
              )
            ] })
          },
          s.key
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Milepæler" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-hidden rounded-b-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-ocid": "milestones-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 sm:px-6 py-3", children: "Tidspunkt" }),
            SCENARIOS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "text-right text-xs font-semibold uppercase tracking-wide px-4 sm:px-6 py-3 font-mono",
                style: { color: s.color },
                children: s.label
              },
              s.key
            ))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: milestones.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: `transition-colors hover:bg-muted/20 ${i < milestones.length - 1 ? "border-b border-border/50" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 sm:px-6 py-3.5 font-medium text-foreground", children: row.label }),
                ["bull", "base", "bear"].map((key) => {
                  const val = row[key];
                  const hitGoal = val >= GOAL_NOK;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: `px-4 sm:px-6 py-3.5 text-right font-mono font-medium tabular-nums ${hitGoal ? "text-primary" : "text-foreground"}`,
                      children: [
                        formatNOK(val, true),
                        hitGoal && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] text-primary/70", children: "✓" })
                      ]
                    },
                    key
                  );
                })
              ]
            },
            row.year
          )) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  Simulator as default
};
