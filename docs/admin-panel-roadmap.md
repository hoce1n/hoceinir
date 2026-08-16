# hoce1n.ir — Admin Panel Roadmap

A production-ready admin system for managing every piece of content on the
portfolio without touching code. Keeps the Linux/terminal aesthetic inside the
admin, moves hard-coded content from `lib/content.ts` into PostgreSQL (Prisma),
and ships as a series of small, reviewable pull requests against `main`.

## Status

- **Base branch:** `main`
- **Branch strategy:** one feature branch per PR, merged via GitHub PR
- **Quality gate:** `pnpm build`, `pnpm typecheck`, `pnpm lint` must pass before every PR

---

## 1. Current state analysis

### Tech stack (already in the repo)

| Area | Tooling |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Data | Prisma 7 (`prisma-client` generator), PostgreSQL via `@prisma/adapter-pg` |
| Forms / validation | react-hook-form, Zod |
| Email | Resend |
| UI effects | framer-motion, Lenis, sonner, cmdk (command palette already present) |

### Existing content & where it lives

All public content is hard-coded today:

- `lib/content.ts` — `projects`, `uses`, `articles` (logs + poetry), `socials`
- `components/sections/About.tsx` — hard-coded `lines` (bio.sh) and `stats`
- `components/sections/Hero.tsx` — hard-coded headline, stack, badge
- `components/sections/Contact.tsx` — hard-coded tip text, "reach out" copy
- `components/layout/SiteHeader.tsx` — hard-coded nav links + brand
- `components/layout/SiteFooter.tsx` — hard-coded footer copy
- `lib/content.ts` `socials` — used by both Contact and Footer

### Existing DB surface

- `prisma/schema.prisma` defines only `ContactMessage`.
- `app/actions.ts` (Server Action) validates + saves contact form, emails via Resend.
- `app/api/send/route.ts` wraps the action as a REST endpoint.
- `lib/db.ts` exposes a shared `PrismaClient` (pg pool + `PrismaPg` adapter).

### Notes on the framework version

- Next.js 16 renames Middleware to **Proxy** (`proxy.ts`). Auth gating for the
  admin will use `proxy.ts` (route-level redirects only; real checks live in
  Server Actions / layout).
- `cookies()` is async in this version.
- Params/searchParams are async (Promise-based) in dynamic routes.
- Server Functions/Actions are the preferred mutation layer; use `revalidatePath`
  / `refresh()` after mutations.

### Existing lint debt (baseline)

`pnpm lint` currently reports 13 errors + 2 warnings in pre-existing files
(unescaped entities, JSX comment text nodes, unused imports, two
`react-hooks/set-state-in-effect` cases). These will be cleaned up as part of the
first code PR (or a dedicated chore) so the quality gate is green going forward.

---

## 2. High-level architecture

### Content in the database

Every piece of public content moves into PostgreSQL tables. The public site
becomes a thin presentation layer that reads through a typed data layer
(`lib/data/*`). Public pages that render DB content are marked dynamic so edits
publish instantly.

### Admin panel under `/admin`

- `/admin` is its own route group with a dedicated terminal-themed layout.
- Auth-protected via `proxy.ts` + per-action checks.
- Built on Server Actions + Prisma (no separate API server).
- Admin UI reuses shadcn/ui primitives but restyled for a Linux/terminal feel.

### Design language

Dark background, monospace type, green glow accents (matching the current
`--primary`), command-line wording (`$`, `cat`, `ls -la`, `git push`), terminal
window chrome (traffic-light dots), subtle glow shadows, and a
**command-palette** (Ctrl/Cmd-K) for fast navigation — powered by the `cmdk`
package already in `package.json`.

### Data layer + seed

A seed script (`prisma/seed.ts`) populates the new tables with the current
`lib/content.ts` values so the public site looks identical after migration. The
data layer returns typed records; public components receive them as props from a
server component page.

---

## 3. Prisma schema design

```prisma
model AdminUser {
  id           String        @id @default(cuid())
  email        String        @unique
  passwordHash String
  name         String
  role         Role          @default(EDITOR)   // OWNER | ADMIN | EDITOR
  active       Boolean       @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  sessions     AdminSession[]
  logs         ActivityLog[]
}

model AdminSession {
  id        String    @id @default(cuid())
  userId    String
  tokenHash String    @unique
  expiresAt DateTime
  createdAt DateTime  @default(now())
  lastUsedAt DateTime @default(now())
  ip        String?
  userAgent String?
  user      AdminUser @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Project {
  id        String     @id @default(cuid())
  title     String
  blurb     String
  tags      String[]
  status    ProjectStatus @default(WIP)   // LIVE | WIP | ARCHIVED
  repo      String?
  url       String?
  order     Int        @default(0)
  published Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Article {
  id        String       @id @default(cuid())
  kind      ArticleKind  // LOG | POETRY
  title     String?
  date      String?
  tags      String[]
  readTime  String?
  body      String
  closer    String?
  order     Int          @default(0)
  published Boolean      @default(true)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

model UsesGroup {
  id        String   @id @default(cuid())
  group     String
  cmd       String
  items     String[]
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SocialLink {
  id     String @id @default(cuid())
  name   String
  handle String
  href   String
  order  Int    @default(0)
}

model AboutSection {            // singleton
  id     String @id @default("about")
  name   String
  role   String
  loves  String
  currently String
  philosophy String
  paragraphs String[]
  stats   Json   // [{ k, v }]
  updatedAt DateTime @updatedAt
}

model SiteSettings {            // singleton — header, footer, contact settings
  id              String @id @default("site")
  version         String
  heroTitle       String
  heroSubtitle    String
  stack           String
  badgeText       String
  headerBrandLeft String
  headerBrandRight String
  footerLeft      String
  footerRight     String
  nav             Json   // [{ label, href }]
  tip             String
  contactIntro    String
  updatedAt       DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  status    MessageStatus @default(NEW)  // NEW | READ | ARCHIVED
  createdAt DateTime @default(now())
  readAt    DateTime?
}

model ActivityLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String
  entityId  String?
  detail    Json?
  ip        String?
  createdAt DateTime @default(now())
}
```

Enums: `Role`, `ProjectStatus`, `ArticleKind`, `MessageStatus`.

**Decision notes**

- Singleton tables (`AboutSection`, `SiteSettings`) use a fixed id so there is
  always exactly one row; upsert everywhere.
- `Json` fields for stats/nav keep the schema small while staying type-safe via
  Zod parsers in the data layer.
- Tags stored as `String[]` (native Postgres array) — matches current shape.
- `order` drives stable section ordering; `published` allows drafts.

---

## 4. Phased PR plan

Each phase is one PR. The public site remains fully functional at every step.

### PR 0 — Roadmap + housekeeping

- This document (`docs/admin-panel-roadmap.md`).
- (Optional, folded into PR 1 if not here) baseline lint fixes.

### PR 1 — Data model, migrations, seed, data layer

**Goal:** content is queryable in Postgres; public site unchanged visually.

- Extend `prisma/schema.prisma` with all models above (keep `ContactMessage`,
  add `status`/`readAt`).
- Create migration(s) via `prisma migrate dev`.
- `prisma/seed.ts` — seeds projects, articles, uses, socials, about, site
  settings from current `lib/content.ts` values.
- `lib/data/*` — typed read layer: `getProjects()`, `getArticles()`,
  `getUsesGroups()`, `getSocials()`, `getAbout()`, `getSiteSettings()`.
- Update `app/page.tsx` to a server component that fetches data and passes it to
  the existing client sections; sections become prop-driven (defaults kept).
- Update `lib/content.ts` to re-export from the DB layer (keeps imports working)
  or remove it and update all importers.
- Fix baseline lint errors in touched files.
- Update `.env.example` with `ADMIN_*` vars.
- Gate: `pnpm build`, `typecheck`, `lint` pass; homepage renders from DB.

### PR 2 — Authentication (credentials)

**Goal:** only the owner can reach `/admin`.

- Add `AdminUser`, `AdminSession`, `ActivityLog` models + migration.
- Password hashing with `scrypt`/argon2-style util in `lib/auth/password.ts`
  (no plaintext ever).
- `lib/auth/session.ts` — create/verify/rotate session token (httpOnly, secure,
  sameSite cookie), session expiry, activity logging.
- `app/(admin)/login/page.tsx` — terminal-themed login screen (`$ ssh admin@hocein`).
- `proxy.ts` — redirect unauthenticated requests to `/admin/login` for `/admin/*`.
- Server actions: `login`, `logout`.
- `scripts/create-admin.ts` (or seed path) — bootstrap initial admin from
  `ADMIN_EMAIL` / `ADMIN_PASSWORD` env.
- Update `.env.example`.

### PR 3 — Admin shell + navigation

**Goal:** a terminal-grade dashboard layout everything else hangs off.

- `app/admin/layout.tsx` — sidebar (`$ ls -la` nav tree), top terminal window
  chrome, status bar, glow accents.
- `app/admin/page.tsx` — dashboard/overview (counts via `ls`-style stat cards).
- Command palette (Ctrl/Cmd-K) using `cmdk` to jump to any admin route.
- Auth-guard helper `requireAdmin()` used by every admin layout/page.
- Placeholder pages for each resource with `coming soon` terminal styling.

### PR 4 — Projects CRUD

- Server actions: `createProject`, `updateProject`, `deleteProject`.
- `lib/validators/project.ts` (Zod).
- List page (`ls -la ~/projects` table), create/edit form page, delete confirm.
- Live status badges, publish toggle, ordering.
- Activity log entries on create/update/delete.

### PR 5 — Articles & Tech Poetry CRUD

- Server actions + Zod validators for `Article`.
- Split views for `log` vs `poetry` (tabs or `ls ~/articles` + `ls ~/poetry`).
- Terminal-window style editor with title/date/tags/readTime/body/closer fields.
- Tag input component (comma/enter separated).
- Draft/publish toggle and ordering.

### PR 6 — About + Uses CRUD

- About singleton editor: name/role/loves/currently/philosophy, paragraphs,
  stats (key-value list editor).
- Uses: list/group editor for `UsesGroup` (group, cmd, items[]).
- Server actions + Zod validators + activity logging.

### PR 7 — Contact messages + contact settings

- Inbox page: `tail -f /var/log/messages` styled table of `ContactMessage`.
- Detail view, mark read, archive, delete.
- Contact settings editor (from `SiteSettings`: tip, contact intro, socials CRUD).
- Keep public form writing to DB untouched.

### PR 8 — Header & Footer management

- `SiteSettings` editor for header brand/nav + footer copy.
- Nav link list editor (label + href).
- Version/badge/hero title/subtitle/stack editing (hero data from settings).
- Public Header/Footer/Hero read from `SiteSettings`.

### PR 9 — Polish, permissions, activity log, final UX

- Activity log viewer page (filterable `journalctl`-style).
- Role-based guards (OWNER can manage users; ADMIN/EDITOR content-only).
- Admin user management page (change password, create/disable editors).
- Session management (list/revoke sessions).
- Empty states, loading skeletons, optimistic UI where easy.
- Keyboard shortcuts, final glow/terminal polish, README updates.

---

## 5. Key design decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Auth | Credentials (email + password), session cookie | Zero external dependency; owner-controlled; magic-link later |
| Session storage | DB-backed token (hashed) in `AdminSession` | Revocable, auditable, survives redeploys |
| Mutations | Server Actions + Prisma | Native Next.js 16 pattern, no extra API surface |
| Public reads | Server component page + typed `lib/data/*` layer | Fast, type-safe, cached via Next.js |
| Admin UI | shadcn/ui restyled to terminal | Reuses battle-tested primitives, keeps visual language |
| Content singletons | Fixed-id rows + upsert | Guarantees exactly-one-row |
| Validation | Zod schemas shared between server actions and forms | Single source of truth |

---

## 6. Non-goals / deferred

- Public reader accounts / comments.
- Full-text search on articles.
- Media uploads (repo/images stored as URLs only).
- Localization/i18n.

---

## 7. Verification checklist (per PR)

- [ ] `pnpm typecheck` clean
- [ ] `pnpm lint` clean
- [ ] `pnpm build` succeeds (prisma generate + migrate deploy + next build)
- [ ] Public site renders and matches previous behavior on the touched sections
- [ ] Admin routes are auth-gated
- [ ] Server actions re-validate affected public paths after mutations
- [ ] New migration files committed
