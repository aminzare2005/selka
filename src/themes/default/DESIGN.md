# Default Theme — Design System

White-cube storefront. Interface is near-total absence of color; photography and product imagery carry visual weight. Typography does the structural work.

## Tokens

| Role | Value | Maps to |
|------|-------|---------|
| Carbon | `#222222` | `--color-primary`, `--color-foreground` |
| Paper | `#ffffff` | `--color-background` |
| Graphite | `#727272` | `--color-muted`, `--color-secondary` |
| Stone | `#f5f5f5` | `--color-accent` |
| Smoke | `#e6e6e6` | hairlines |
| Ash | `#b6b6b6` | placeholders / quiet icons |

**Radius:** `0` everywhere. **Elevation:** none — no shadows on tiles.

## Typography

- Body / UI: Vazirmatn 400
- Wordmark only: Vazirmatn 700
- Section titles: 400 at ~22–30px (anti-bold)
- Captions: 13px

## Layout

- Max width ~1280px
- Section breathing 48–72px
- Product grid: 2 / 3 / 4 columns, 24px gap
- Header: three-zone (nav · wordmark · utilities)
- Footer: inverted carbon surface

## Functional surfaces (built)

Home: hero, trust-strip, product-grid  
Shell: header, footer  
Pages: product, cart, checkout, checkout-result

## Shared storefront UX

Product/cart IA lives in `src/components/storefront/*-page-view.tsx`.
This theme only skins via `classNames` (sharp corners, carbon CTA).
Do not fork product purchase flows inside the theme.
