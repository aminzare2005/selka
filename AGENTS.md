<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Selka (سلکا) — agent guide

Persian multi-tenant storefront builder. Repo folder and npm package name are `selka`.

## Stack

- Next.js `16.2.10` App Router, React `19.2.4`, TypeScript
- Tailwind CSS v4 — design tokens in `src/app/globals.css`
- Prisma 7 + PostgreSQL (`@prisma/adapter-pg`), client generated to `src/generated/prisma`
- better-auth (phone + password; OTP-ready via phoneNumber plugin), TanStack Query, Zod v4, Radix + CVA UI
- Local theme package `@selka/theme-sdk` (`file:./packages/theme-sdk`)

Path alias: `@/*` → `src/*`. Root layout is `lang="fa" dir="rtl"`.

## Local runtime (two processes)

Always keep **database** and **Next** running separately:

1. `npm run db:dev -- --detach --name selka` — local Prisma Postgres
2. Put the printed TCP URL into `.env` as `DATABASE_URL` (port changes per start unless you reuse the same named server)
3. `npm run db:push` then `npm run db:seed` when schema/data is empty
4. `npm run dev` — Next on http://localhost:3000

Full operator docs: `README.md` § راه‌اندازی توسعه.

Stop DB: `npx prisma dev stop selka`. List: `npx prisma dev ls`.

## Directory map

```
themes.config.ts          theme registry (default, modern, classic)
next.config.ts            /@slug ↔ /s/[slug] rewrites, transpilePackages
src/proxy.ts              session cookie gate for /dashboard, /admin
prisma/                   schema.prisma, seed.ts
packages/theme-sdk/       ThemePackage contract
src/
  app/
    (auth)/               login, register
    dashboard/            merchant panel (flat routes)
    admin/                PLATFORM_ADMIN
    s/[slug]/             storefront filesystem routes (public URL is /@slug)
    api/                  Route Handlers
  components/
    ui/                   design system
    layout/               AppShell, AppSidebar, dashboard-nav, dashboard-page-meta
    dashboard/            merchant features
    storefront/           shared storefront pieces
  themes/default|modern|classic|shared/
  lib/                    auth, db, store-access, payments, storage, themes, api helpers
  generated/prisma/       DO NOT hand-edit
```

## Auth

| Piece | Path |
|--------|------|
| Config | `src/lib/auth.ts` — `phoneNumber` plugin + internal credential email |
| Phone helpers | `src/lib/phone.ts` (UI `09…` ↔ DB `+98…`), `src/lib/auth-phone.ts` |
| Register API | `src/app/api/auth/phone-register/route.ts` |
| API | `src/app/api/auth/[...all]/route.ts` |
| Server | `src/lib/auth-server.ts` — `getSession`, `requireSession`, `requirePlatformAdmin` |
| Client | `src/lib/auth-client.ts` — `phoneNumberClient()` |
| Gate | `src/proxy.ts` — cookies `better-auth.session_token` / `__Secure-…` |

Identifier is Iranian mobile (required). UI uses `09XXXXXXXXX`; DB stores E.164 `+989XXXXXXXXX`. better-auth still keeps a hidden email `{digits}@phone.selka.local` — never show it in UI. Future OTP: implement SMS in `sendOTP`, then `authClient.phoneNumber.sendOtp` / `verify` (wrappers in `auth-phone.ts`).

Roles: `USER` | `PLATFORM_ADMIN`. Seed accounts: `09000000000` / `09000000001` — see README.

## Multi-tenant stores

- Store has unique `slug`, `ownerId`, `themeId`, `settings` JSON.
- Access: `src/lib/store-access.ts` — `getPrimaryStoreForUser`, `requireStoreAccess`, memberships `OWNER|ADMIN|STAFF`.
- Public URLs: `src/lib/storefront-url.ts` — `storePath(slug)` → `/@${slug}`. Never link to `/s/...` (redirects to `/@...`).
- Dashboard is single-store primary UX via `getPrimaryStoreForUser` unless building explicit multi-store switching.
- Nested `dashboard/stores/[storeId]/…` may still exist; nav uses flat `/dashboard/*`.

### Buyer (customer) surface

- Global `User` auth; per-store profile in `StoreCustomer` (`src/lib/store-customer.ts`)
- Routes: `/@slug/login`, `/@slug/register`, `/@slug/dashboard`, `/orders`, `/profile`
- APIs: `/api/s/[slug]/me`, `/me/orders`, `/me/orders/[orderId]`
- Guest checkout remains; logged-in checkout prefills + upserts `StoreCustomer`
- Cart guest→user merge in `getOrCreateCart`
- Default theme: `default` (`src/themes/default/`, `DEFAULT_THEME_ID` in `themes.config.ts`). Legacy `nova` aliases to `default`.
- Shared storefront UX (product/cart): `ProductPageView` / `CartPageView` in `src/components/storefront/` — themes skin via `classNames`, do not fork purchase flow

## Themes

1. Implement `ThemePackage` (`packages/theme-sdk`)
2. Register loader in `themes.config.ts`
3. Add package to `transpilePackages` in `next.config.ts` if external
4. Runtime: `src/lib/themes/registry.ts`, `resolve.ts`; pages under `src/app/s/[slug]/`

## Payments (Zibal)

- `src/lib/payments/` — provider registry + `providers/zibal.ts`
- Callback: `src/app/api/payments/zibal/callback/route.ts`
- Credentials encrypted with `src/lib/encryption.ts` (`ENCRYPTION_KEY`)
- Platform enables gateway; merchant sets Merchant ID in dashboard gateways UI

## Media / storage

- `STORAGE_DRIVER=local|minio` → `src/lib/storage/`
- MinIO adapter is implemented (`minio@8`); full ops guide: `docs/MINIO.md`
- Local Docker: `docker compose -f docker-compose.minio.yml up -d`
- Smoke test: `npm run storage:minio:test`
- Prefer `POST/GET /api/media` over deprecated `/api/upload`
- Images only, max 5MB; UI: `media-gallery`, `media-uploader`, `media-picker-dialog`
- On Vercel always use `minio` (local disk is ephemeral)

## API conventions

Typical authenticated store route:

1. `getSession()` → 401 Persian message
2. `await params` — **params are `Promise<>` in this Next version**
3. `requireStoreAccess(storeId, userId, roles?)`
4. Zod in `src/lib/validations.ts`
5. Prisma via `db` from `src/lib/db.ts` (import client from `@/generated/prisma/client`)
6. `apiSuccess` / `apiError` from `src/lib/api.ts`
7. After mutations, revalidate with the **current** `revalidateTag` signature from local Next docs (do not invent from older Next)

## Dashboard UI (current design language)

Preserve this look; do not regress to generic SaaS chrome.

- Tokens: `--brand-*`, `--mint-*`, `--sun-*`, `--ocean-*`, `--coral-*` in `src/app/globals.css`
- Shared tone tiles: `src/components/ui/tone.ts` → `toneSurface`
- Empty states: `src/components/ui/empty-state.tsx`
- Page titles: `dashboardPageMeta` + `PageHeader` (keep `loading.tsx` in sync)
- `Card variant="interactive"` — soft hover only (`translate-y-px`), no harsh scale/lift
- Desktop sidebar: fixed **right**, glass/brand wash, soft active (`bg-brand-100 text-brand-700`), not solid primary fill
- User footer: **name + phone only** — no avatar / initials placeholder
- Mobile nav: fixed header; hamburger on the **right** (first in RTL flex); menu is a **full-height panel under the header** `h-[calc(100dvh-4rem)]` — not a side drawer (`src/components/layout/app-sidebar.tsx`)
- Copy is conversational Persian; LTR for phones/URLs (`dir="ltr"`)
- Settings identity block uses a tinted brand surface; address input is a combined `/@` + slug control

## Scripts

```bash
npm run dev                # prisma generate && next dev
npm run build
npm run vercel-build       # generate + migrate deploy + next build (Vercel)
npm run postinstall        # prisma generate (Vercel install)
npm run lint
npm run db:dev             # local Prisma Postgres server
npm run db:push            # apply schema (prototyping)
npm run db:migrate         # migrate dev
npm run db:migrate:deploy  # migrate deploy (production/CI)
npm run db:seed            # tsx prisma/seed.ts
npm run db:studio
npm run db:generate
```

Production deploy (Vercel + external Postgres): see `docs/DEPLOYMENT.md`.

## Pitfalls agents hit

1. **Do not invent Next APIs from training data** — read `node_modules/next/dist/docs/` (and `…/02-guides/ai-agents.md`).
2. Request gate lives in `src/proxy.ts` (Next 16 Proxy convention; `middleware.ts` is deprecated).
3. `params` / `searchParams` are async.
4. `@selka/theme-sdk` is a local `file:` package; keep `transpilePackages`.
5. No `window` / `matchMedia` during SSR render — follow `src/hooks/use-is-mobile.ts` pattern.
6. Do not reintroduce sidebar avatar placeholders or a mobile side-drawer primary nav.
7. Never hand-edit `src/generated/prisma`.
8. Don’t commit secrets; `.env` is local-only.

## Where to put new code

| Kind | Location |
|------|----------|
| UI primitive | `src/components/ui/` |
| Merchant feature UI | `src/components/dashboard/` |
| Shell / nav | `src/components/layout/` |
| Domain logic | `src/lib/` |
| Route Handlers | `src/app/api/` |
| Dashboard page | `src/app/dashboard/<feature>/` + matching `loading.tsx` |
| Theme | `src/themes/<id>/` + `themes.config.ts` |

Prefer existing helpers (`getSession`, `requireStoreAccess`, `storePath`, `getStorage`, `getPaymentProvider`, theme registry) over new parallel abstractions.
