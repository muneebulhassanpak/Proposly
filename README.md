# Proposly

Internal quoting and proposal tool for creative and marketing agencies. Replaces the Excel-and-email workflow with a structured web app where reps build quotes, managers approve them, and clients review branded proposals through a public link.

Not SaaS. The agency runs it for their own team. Clients only ever see a read-only proposal page.

## Tech Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Radix UI · TanStack Query · Supabase (Postgres, Auth, Storage) · Recharts · Resend · Vercel

## Architecture

```
app/                    Thin route shells — each re-exports from features/
features/               All domain logic, grouped by feature
  auth/                 Login, forgot/reset password, session management
  shell/                Sidebar, nav, app shell
  dashboard/            Rep dashboard
  quotes/               Quote builder, preview, detail, versioning
  products/             Product catalog (admin)
  settings/             Company settings (admin)
  approvals/            Approval inbox + detail (manager)
  manager/              Manager dashboard
  analytics/            Charts + metrics
  templates/            Quote templates
  notifications/        Notification bell + panel
  proposal/             Public proposal page (unauthenticated)
components/ui/          shadcn primitives
lib/                    Supabase clients, utilities, constants
```

Each feature follows a strict separation: `pages/` and `components/` are stateless — all hooks, effects, and data fetching live in `hooks/`. Server actions in `actions/`, Supabase queries in `services/`, validation in `schemas/`.

## Roles

| Role | Access |
|---|---|
| **Admin** | Company settings, product catalog, discount rules, user management |
| **Manager** | Approval inbox, pipeline overview, analytics |
| **Rep** | Create and send quotes, track own deals, use templates |

Clients are not users. They receive a public link and interact through it.

## Features

**Quote lifecycle** — Reps build quotes from the product catalog. Line items snapshot the product name and price at creation time, so catalog changes never affect existing quotes. Each quote supports multiple immutable versions: once a version is sent, it locks. Creating a new version supersedes the old one automatically.

**Public proposals** — Every sent quote gets a unique public link (`/p/{token}`). Clients can view the proposal and accept or decline it without logging in. The public token is only generated when the quote is first sent — drafts are never publicly accessible.

**Approval workflow** — Discount rules define a threshold. Any quote with a discount above that threshold automatically triggers a manager approval before it can be sent. Discount exactly at the threshold does not trigger approval.

**Dashboards** — Reps see their own quotes with status tracking. Managers see the full pipeline across all reps, an approval inbox, and analytics with charts and metrics.

**User management** — Admins create and deactivate users. Deactivation is enforced at four layers: login action, middleware, server-side auth utility, and database RLS policies. A deactivated user gets zero rows from every table.

**Notifications and activity** — In-app notification panel. Activity log tracks every quote event (created, sent, viewed, accepted, declined, version created). The activity log is immutable — no role can delete entries.

## Security

### Four-layer auth enforcement

1. **Login action** — Checks `is_active` after password auth; signs out deactivated users
2. **Middleware** — Queries profile on every navigation; blocks and signs out inactive users
3. **Server auth utility** — `requireAuth()` / `requireRole()` verify active status and role before rendering any page
4. **Row Level Security** — Every table has RLS enabled. All authenticated policies enforce `is_active = true`

### Row Level Security

15 tables, 27 policies. Every table has RLS enabled with no exceptions.

**Company isolation** — All authenticated policies scope data by `company_id` via the user's profile. A user from Company A cannot read, write, or delete any data belonging to Company B.

**Rep isolation** — The `rep_own_quotes` policy is RESTRICTIVE (AND logic with company isolation). Reps see only their own quotes. Managers and admins see all company quotes.

**Deactivation** — The `get_my_company_id()` helper returns NULL for inactive users. Since every policy depends on this, a deactivated user matches zero rows across all 15 tables.

**Anon access** — Unauthenticated visitors can only read data tied to quotes with a `public_token`. Products, discount rules, templates, approvals, notifications, and email logs are completely invisible. Activity log inserts are scoped to public quotes only.

**Audit trail** — `activity_log_no_delete` policy uses `USING (false)` — no role, including admin, can delete audit entries.

### RLS test results

71 tests executed against the live database using `SET LOCAL role` to impersonate users. All tests pass.

| Category | Tests | Result |
|---|---|---|
| Cross-company isolation (all 15 tables, both directions) | 20 | Pass |
| Rep isolation (rep vs rep, manager override, admin override) | 11 | Pass |
| Deactivated user (zero rows on all 14 data tables) | 14 | Pass |
| Anon access (public data scoped, private data blocked) | 15 | Pass |
| Write attacks (cross-company, anon, deactivated user, audit deletion) | 11 | Pass |

One bug found and fixed during audit: `public_token` column had `DEFAULT uuid_generate_v4()`, making every draft publicly accessible. Changed to `DEFAULT NULL` with token generation on first send.

## Database

15 tables: `companies`, `profiles`, `products`, `product_price_history`, `clients`, `quotes`, `quote_versions`, `quote_line_items`, `approvals`, `discount_rules`, `quote_templates`, `quote_template_items`, `activity_log`, `notifications`, `email_log`.

## Getting Started

```bash
cp .env.example .env.local    # Fill in Supabase + Resend credentials
npm install
npm run dev                   # http://localhost:3000
```

## Scripts

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier
```
