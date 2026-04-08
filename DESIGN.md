# Design Brief

**Purpose & Tone:** Premium investment dashboard for real portfolio tracking. Refined minimalism with calculated precision — no frivolity, high information density with clear visual hierarchy. Dark exclusive aesthetic.

**Palette**

| Token | Light OKLCH | Dark OKLCH | Usage |
|-------|-------------|-----------|-------|
| background | 0.99 0 0 | 0.12 0 0 | Page base |
| card | 0.98 0 0 | 0.16 0 0 | Card containers, elevated |
| foreground | 0.15 0 0 | 0.92 0 0 | Body text |
| muted | 0.88 0 0 | 0.20 0 0 | Tertiary text, disabled |
| border | 0.85 0 0 | 0.24 0 0 | 1px dividers, input borders |
| primary | 0.55 0.12 255 | 0.72 0.18 252 | Links, secondary actions |
| accent | 0.62 0.18 252 | 0.68 0.20 252 | Electric teal — key metrics, live badges, CTAs |
| chart-1 to -5 | Mixed cool/warm | Mixed cool/warm | Multi-asset visualization |
| destructive | 0.55 0.22 25 | 0.65 0.19 22 | Errors, sell actions |

**Typography**

| Layer | Font | Size (px) | Weight | Usage |
|-------|------|----------|--------|-------|
| Display | General Sans | 32–20 | 700, 600 | Tab labels, section heads |
| Body | DM Sans | 16–14 | 400, 500 | Cards, labels, descriptions |
| Mono | JetBrains Mono | 14–12 | 400, 600 | Numbers, live tickers, codes |

**Structural Zones**

| Zone | Background | Border | Height (mobile/desktop) |
|------|-----------|--------|-------------------------|
| Header/Nav | card | border-b | 56px / 64px |
| Content | background | none | full |
| Card section | card + subtle shadow | border 1px | auto |
| Tab indicator | accent (underline) | none | 2px |
| Footer/Links | card | border-t | 48px |

**Shape & Spacing:** Radius 8px (cards), 4px (inputs/buttons), 0px (form elements). Mobile: 16px margins, 12px gap. Desktop: 24px margins, 16px gap. Density increases for data tables.

**Component Patterns**

- **KPI Card:** Number (mono, 24px), label (body), delta (accent if positive, destructive if negative)
- **Live Badge:** Colored dot (fresh=teal, stale=grey, error=red) + status text, mono font
- **Tab Navigation:** Underline indicator (accent), Norwegian labels
- **Chart Container:** Light grey frame, accent legend, clear axis labels
- **Modal/Popover:** card background, 1px border, shadow-lg for elevation

**Motion:** 0.3s cubic-bezier(0.4, 0, 0.2, 1) for all interactive state changes. No bounce, no delays. Status badges pulse subtly (opacity 0.6–1.0, 2s infinite).

**Constraints:** No gradients. No generic blue. Accent is strictly electric teal (h:252°, vibrant). Norwegian language throughout. Mobile-first responsive (sm, md, lg breakpoints). Dark mode primary, light mode secondary.

**Signature Detail:** Teal accent on deep charcoal (dark mode) or teal on near-white (light mode). Live status badges with color-coded dots — immediate visual signal for API freshness. Mono numbers for precision psychology.
