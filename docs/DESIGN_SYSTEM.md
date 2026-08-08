# admin-dashboard — UI Design Plan & Design System

This is the design plan for SliceOps' tenant-facing admin dashboard. It exists so that every page built from here on — by a human or by Claude via the `generate-ui` skill — looks like it came from the same product, instead of accumulating a fourth visual style every time someone adds a screen.

Keep this file honest: when a decision here changes (a token, a library swap, a phase completes), update it in the same change, the same way `ROADMAP.md` is kept honest at the platform level.

## 1. What this product actually is

SliceOps is a multi-tenant commerce platform: one deployment, many independent tenants (pizza shops, restaurants, electronics stores, general retail), each with their own catalog, store settings, inventory, and orders. **This dashboard is the tenant-facing admin UI** — the tool a restaurant owner or an electronics store manager uses to run their business. It is not a customer-facing storefront; no storefront project exists yet.

Two roles use it today (see `src/pages/HomePage.tsx` / `Dashboard.tsx`):
- **`platform-admin`** — SliceOps' own staff, manages tenants and platform users across the whole system.
- **`tenant-admin` / manager / employee** — a single tenant's staff, manages their own store, products, promos, orders.

"Target it at e-commerce" means: this should feel like the admin tools people already trust for running a shop — Shopify admin, Stripe dashboard, Linear — calm, data-dense where it needs to be, fast, and with enough warmth that it doesn't read as generic enterprise software. It does **not** mean building a customer-facing shopping cart UI; that's a different, not-yet-started product.

## 2. Design principles

1. **Data-dense, not cluttered.** Owners check this between orders — stats, tables, and lists need to scan fast. Favor compact rows and clear hierarchy over whitespace for its own sake.
2. **Warm, not sterile.** The existing brand accent (`#ff5533`, coral/orange) and the pizza-emoji greeting on `HomePage.tsx` are good instincts — keep the personality, just make it systematic instead of one-off inline styles.
3. **Motion with restraint.** Hover lifts, skeleton loaders, and smooth number transitions make the product feel alive; nothing should animate just to prove it can. Every animation should communicate state (loading, success, change), not decorate.
4. **Multi-vertical by construction.** A pizza shop and an electronics retailer use the same screens with different data. Never hardcode "pizza" language or imagery into a shared component — the existing `PizzaLogo`/🍕 greeting are tenant-context placeholders, not the platform identity. Tenant branding (logo, and eventually a brand color) comes from the Store service and should be able to reskin accent usage per tenant later.
5. **Responsive is not optional.** Store owners check this from a phone at the counter. Every page needs a real mobile layout, not just a squeezed desktop one.
6. **Accessible by default.** Real focus states, real contrast ratios, real semantic markup — not just for compliance, but because a keyboard-only or screen-reader user is a real tenant employee too.

## 3. Visual identity — design tokens

These are the tokens `generate-ui` and any hand-written component should pull from. Once Tailwind is set up (Phase A below), these become `tailwind.config` theme extensions and CSS variables — not hardcoded hex values in component files, which is today's problem (see `HomePage.tsx`'s inline `#ff5533` scattered through the file).

### Color

| Token | Value | Use |
|---|---|---|
| `brand-50`…`brand-900` | ramp from `#fff5f2` → `#ff5533` (500) → `#7a1f0f` | primary accent, CTAs, active nav state, chart lines |
| `neutral-0`…`neutral-950` | white → `#0b0d10`, gray-blue ramp (reuse the `#1f2937`/`#4b5563`/`#6b7280`/`#9ca3af`/`#f3f4f6` values already in `index.css`) | text, borders, surfaces |
| `success` | `#16a34a` (already used for "System Live") | delivered/active/positive states |
| `warning` | `#f59e0b` | expiring promos, low stock, pending |
| `danger` | `#dc2626` | errors, deactivated, destructive actions |
| `info` | `#2563eb` | informational badges ("on the way") |

Semantic status colors should be defined **once** (a `statusColor(status: string)` mapping or a `<StatusBadge status=... />` component) instead of re-deriving `tagColor` ternaries per page, which is the current pattern in `HomePage.tsx`'s `ordersList` rendering.

### Typography

- Font: system stack for now (`Inter` if/when a webfont is added later — don't add one speculatively).
- Scale: `text-xs` (12px) → `text-4xl` (36px) on a 1.25 ratio, matching Tailwind's default scale — no need to invent a custom one.
- Weight: 400 body, 500 labels/emphasis, 600 headings/stat values, 700 only for hero numbers (matches the existing `fontWeight: 700` stat values).

### Spacing & radius

- Spacing: Tailwind's default 4px base scale. Card padding 16–24px, page gutters 16px mobile / 24px+ desktop — matches current `Row gutter={[16,16]}`.
- Radius: `8px` for inputs/buttons/menu items, `12px` for cards, `16px` for hero/banner surfaces, `9999px` (pill) for badges/status tags — this already matches `.dashboard-card` / `.gradient-banner` / `.pulse-badge` in `index.css`, keep it.

### Elevation & motion

- Elevation via soft, colored-tinted shadows on hover only (`.dashboard-card:hover` is a good reference), not resting shadows everywhere — keeps the UI calm.
- Motion durations: 150ms for micro-interactions (button/hover), 200–300ms for layout changes (sidebar collapse, panel open), `cubic-bezier(0.25, 0.8, 0.25, 1)` easing (already used) for card lifts.
- Loading states: skeletons, not spinners, for anything that populates a layout (tables, cards, charts) — spinners only for button-level async actions.

## 4. Tech stack: migrate from Ant Design to Tailwind + shadcn/ui

**Decision:** move off Ant Design's component set, onto Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (Radix primitives + `class-variance-authority`), incrementally, not as a big-bang rewrite.

**Why:** antd's defaults read as generic enterprise-admin (its own README literally still says "Ant Design ©2025 Created by Ant UED" in the footer). shadcn/ui components are copied into the repo as owned source, not an opaque dependency — every token above becomes real, editable Tailwind config instead of fighting antd's theme algorithm with `!important` overrides (which `index.css` is already full of, e.g. `.ant-menu-light.ant-menu-inline .ant-menu-item { ... !important }`). That override pattern is itself a signal antd's defaults are being fought, not used.

**Additions:**
- `tailwindcss` + `@tailwindcss/vite`
- `shadcn/ui` CLI (adds Radix-based components into `src/components/ui/`) — pull in: button, input, select, dialog, sheet, dropdown-menu, tabs, table, badge, card, avatar, popover, command (for ⌘K), skeleton, toast/sonner, calendar, form (with `react-hook-form` + `zod`, see below)
- `lucide-react` — replaces the hand-drawn SVG icon files under `src/icons/` (`BarChartIcon.tsx`, `BasketIcon.tsx`, etc. are fine as one-offs like `PizzaLogo`, but generic icons like Home/Users/Orders/Products should come from a real icon set instead of being hand-maintained)
- `recharts` (or `tremor`, which is shadcn-flavored and built for exactly this kind of admin analytics) for charts — the current hand-rolled SVG line chart in `HomePage.tsx` (lines ~104–345) works but is ~240 lines to maintain per chart; not worth hand-rolling again for the next one
- `@tanstack/react-table` (pairs with shadcn's table primitives) for the Products/Orders/Users data tables that don't exist yet
- `react-hook-form` + `zod` for forms (product create/edit, store settings) — replaces antd's `Form` API
- `framer-motion` (or the lighter `motion` package) for the layout/transition animations described in §3 — CSS transitions are enough for hover states, reach for this only for orchestrated things (page transitions, staggered list entrances)
- Keep: `@tanstack/react-query` (already the right choice for server state), `zustand` (already the right choice for the thin `auth` store), `axios`, `react-router-dom`

**What NOT to do:** don't run antd and the new stack side-by-side for more than the migration window in §6, and don't let a page mix antd components with shadcn components — pick one per page, migrate the whole page in one pass.

## 5. Layout architecture

- **App shell**: collapsible sidebar (keep the collapse behavior from `Dashboard.tsx`), topbar with tenant context badge (platform-admin sees "Platform Control", tenant roles see their tenant name — already correct logic, just needs a restyle), notification bell, avatar/logout menu.
- **Add**: a command palette (⌘K / Ctrl+K, shadcn's `command` component) for jumping to Products/Orders/Users/Settings — cheap to add once shadcn is in, high value in a data-heavy admin tool.
- **Responsive nav**: sidebar collapses to icon-only ≥768px (already implemented), becomes a slide-over drawer <768px (not yet implemented — currently just a fixed `Sider`, needs a mobile breakpoint check).
- **Breakpoints**: follow Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) instead of antd's `xs/sm/lg` grid breakpoints used today, so there's one breakpoint vocabulary across the app.

## 6. Page inventory — grounded in what the backend actually supports

Only list pages here that a real service can back today or that are clearly on the roadmap — no speculative screens for Notification/Payment, which per `ROADMAP.md` haven't been started.

| Page | Backend | Status |
|---|---|---|
| Login / forgot password | Auth | exists (`pages/login`), needs restyle |
| Home / KPI overview | Order (stats), Store | exists (`HomePage.tsx`), good bones, needs token/library migration |
| Tenants list/detail (platform-admin only) | Auth | exists (`pages/restaurants`, arguably should be renamed `tenants`), needs restyle |
| Users list/create/roles | Auth | partially exists (`pages/users`), needs restyle + table migration |
| Store settings (identity, address, hours, delivery, branding) | Store | **does not exist yet** — Store's API surface is done (README: core slice + 10 handlers wired), UI is new build |
| Products / Categories / Variants / Modifiers | Catalog | `pages/Category.tsx` exists as a stub; Products list/detail/create **does not exist yet** — Catalog is the most complete backend service and has no admin UI at all yet |
| Orders list / detail / status board | Order | **does not exist yet** — Order's HTTP transport isn't wired per `ROADMAP.md` Phase 3, so this page has no API to call until that phase lands. Design it, don't wire data fetching, until Phase 3 ships. |
| Promos / Coupons | Order | same dependency as Orders above |
| Inventory / stock levels | Inventory | not started on either side — do not build UI ahead of Phase 2 |

This means the highest-value *new* UI work (Store settings, Products/Categories) is gated on nothing — those backends are ready today. Orders/Promos/Inventory UI should wait for their backend phases, or be built as static/mocked screens explicitly marked as such if the user wants to preview them early.

## 7. Component inventory to standardize

Build these once in `src/components/ui/` (shadcn-generated) and `src/components/` (SliceOps-specific), then reuse everywhere instead of re-deriving per page:

- `<StatTile />` — replaces the four repeated `Card`+`Statistic` blocks in `HomePage.tsx`
- `<StatusBadge status={...} />` — replaces per-page `tagColor` ternaries
- `<DataTable />` — TanStack Table + shadcn table, with sort/filter/pagination built once, used by Users/Products/Orders
- `<EmptyState />`, `<LoadingSkeleton />`, `<ErrorState />` — every list/table page needs all three; today only the happy path is built anywhere
- `<PageHeader title breadcrumbs actions />` — consistent per-page header instead of ad hoc `Title`/`Flex` blocks
- `<ConfirmDialog />` — for destructive actions (deactivate store, delete product, remove user)

## 8. Rollout plan

Phased so each step is independently shippable and testable, matching how `ROADMAP.md` phases the backend work.

- ✅ **Phase A — Foundations.** Tailwind v4 + Radix/shadcn-style primitives installed (`src/components/ui/`), tokens from §3 wired into `src/index.css` as an `@theme` block, `components.json` set up for `npx shadcn add`. antd kept running unchanged for not-yet-migrated pages (Tailwind preflight is deliberately excluded until Phase H so the two don't fight over base element styles).
- ✅ **Phase B — App shell.** `layouts/Dashboard.tsx`, `layouts/Root.tsx`, `layouts/NonAuth.tsx`, and the login page rebuilt on the new stack: responsive sidebar with a mobile `Sheet` drawer, ⌘K command palette (`src/components/layout/CommandPalette.tsx`), avatar dropdown.
- ✅ **Phase C — Home/KPI dashboard.** `HomePage.tsx` migrated to `StatTile`/`StatusBadge` + `recharts`, replacing the ~240-line hand-rolled inline SVG chart.
- **Phase D — Existing pages.** Migrate Users and Tenants/Restaurants pages onto `DataTable`.
- **Phase E — New: Store settings.** Build against Store's already-complete API — identity, address, business hours, delivery settings, logo upload.
- **Phase F — New: Catalog.** Products list/detail/create, Categories, Variants/Modifiers — Catalog's API is the most complete in the platform and has zero UI today.
- **Phase G — Orders/Promos.** Only start once Order's HTTP transport is wired (`ROADMAP.md` Phase 3), or build as an explicitly-mocked preview if wanted sooner.
- **Phase H — Cleanup.** Remove `antd`, `@ant-design/icons`, and the `!important` overrides in `index.css`; delete now-redundant hand-rolled icons superseded by `lucide-react`.

Each phase should end in a build/lint check (`npm run build`, `npm run lint`) before moving to the next — same "verify incrementally" discipline the backend skills already enforce.

## 9. Accessibility & responsiveness checklist (apply to every new page)

- Keyboard: every interactive element reachable via Tab, visible focus ring (don't rely on antd/shadcn defaults uncritically — check contrast against `brand-500`)
- Color contrast: text vs. background meets WCAG AA (4.5:1 body text) — verify status badge text/background pairs specifically, since colored pill badges are the easiest place to fail this
- Touch targets ≥ 44px on mobile layouts
- Every data table/list has a tested empty state, loading state, and error state — not just the happy path
- Every page tested at 375px (phone), 768px (tablet), 1440px (desktop) before calling it done
