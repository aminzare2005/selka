# Default Theme — Design System

White-cube storefront with Apple-inspired materials: soft continuous corners, translucent chrome, breathing space. Photography and type carry the brand; chrome stays quiet.

## Tokens

| Role | Value | Maps to |
|------|-------|---------|
| Carbon | `#222222` | `--color-primary`, `--color-foreground` |
| Paper | `#ffffff` | `--color-background` |
| Graphite | `#727272` | `--color-muted`, `--color-secondary` |
| Stone | `#f5f5f5` | `--color-accent` |
| Smoke | soft hairlines / `black/4` | chrome edges |

**Radius:** `16px` theme token; large surfaces `22–28px`; CTAs `rounded-full`.  
**Elevation:** prefer fill + blur over hard borders; no heavy shadows.

## Typography

- Body: Vazirmatn 400–500, comfortable leading (~1.6–1.8)
- Display: 700–800, tight tracking (`-0.02em` to `-0.03em`) on large sizes
- Captions: 13px

## Layout

- Max width ~1280px
- Soft section gaps; hero/trust as rounded stone panels
- Product grid: 2 / 3 / 4 columns with rounded media
- Header: frosted material (`backdrop-blur`) — content can breathe under it
- Footer: inverted carbon

## Interactions (Apple-aligned)

- Links: color / opacity — never underline
- Feedback on press: `active:scale-[0.97]`, ~150ms
- Primary CTA: solid carbon pill
- Secondary: stone fill pill
- Prefer materials over 1px hard dividers
- Reduced motion: keep opacity/color; avoid large slides when `prefers-reduced-motion`

## Shared storefront UX

Product/cart IA lives in `src/components/storefront/*-page-view.tsx`.  
This theme skins via `classNames` (soft radius, pill CTAs).  
Do not fork product purchase flows inside the theme.
