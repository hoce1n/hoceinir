# Hoceinir Portfolio

A polished personal portfolio and developer workspace for Hocein. The site presents selected projects, writing, tools, and a contact flow in a terminal-inspired interface built with the Next.js App Router.

## Overview

Hoceinir is designed as a production-ready portfolio application rather than a starter template. It combines a modern frontend stack with database-backed contact submissions and transactional email delivery.

### Key features

- **Portfolio landing page** with hero, about, articles, projects, uses, and contact sections.
- **Terminal-inspired UI** using Tailwind CSS, shadcn/ui primitives, Radix UI, and custom motion components.
- **Database-backed contact form** that validates submissions with Zod and stores messages through Prisma.
- **Email notifications** via Resend with a reusable React email template.
- **Typed application structure** with TypeScript, ESLint, Prettier, and dedicated configuration files.
- **Dark-first presentation** with accessible skip navigation, global error handling, and not-found handling.

## Tech stack

| Area               | Technology                                 |
| ------------------ | ------------------------------------------ |
| Framework          | Next.js 16 App Router, React 19            |
| Language           | TypeScript                                 |
| Styling            | Tailwind CSS 4, shadcn/ui, Radix UI        |
| Data               | Prisma 7, PostgreSQL, `@prisma/adapter-pg` |
| Forms & validation | React Hook Form, Zod                       |
| Email              | Resend                                     |
| Animation & UX     | Framer Motion, Lenis, Sonner               |
| Tooling            | pnpm, ESLint, Prettier                     |

## Project structure

```text
app/                  Next.js routes, layout, server actions, and API handlers
components/           Layout, section, terminal, effect, provider, and UI components
lib/                  Shared utilities, content, validation, database, and config helpers
prisma/               Prisma schema and migration metadata
public/               Static assets
```

Notable files:

- `app/page.tsx` composes the main portfolio sections.
- `app/actions.ts` validates, persists, and sends contact form submissions.
- `app/api/send/route.ts` exposes the contact submission endpoint.
- `lib/content.ts` owns project, article, uses, and social profile content.
- `prisma/schema.prisma` defines the `ContactMessage` model.

## Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm
- A PostgreSQL database
- A Resend API key and verified sender address for email delivery

### Installation

```bash
pnpm install
```

### Environment configuration

Copy the example environment file and fill in the required values:

```bash
cp .env.example .env
```

Required variables:

| Variable            | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`      | PostgreSQL connection string used by Prisma and the PG adapter. |
| `RESEND_API_KEY`    | API key used to send contact notifications.                     |
| `RESEND_FROM_EMAIL` | Verified sender address for Resend.                             |
| `CONTACT_TO_EMAIL`  | Destination inbox for contact form messages.                    |

### Database setup

After configuring `DATABASE_URL`, generate the Prisma client and apply migrations:

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

For local development, use your preferred Prisma migration workflow if you need to create or modify schema migrations.

### Development server

```bash
pnpm dev
```

Open the local URL printed by Next.js in your browser.

## Available scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `pnpm dev`       | Start the Next.js development server.          |
| `pnpm build`     | Create a production build.                     |
| `pnpm start`     | Serve the production build on port `4173`.     |
| `pnpm lint`      | Run ESLint.                                    |
| `pnpm typecheck` | Run TypeScript without emitting files.         |
| `pnpm format`    | Format TypeScript and TSX files with Prettier. |

## Content management

Most public-facing portfolio content is stored in `lib/content.ts`:

- Add or update featured work in `projects`.
- Manage articles and poetry entries in `articles`.
- Update stack and setup details in `uses`.
- Edit social links in `socials`.

This keeps the page sections focused on presentation while making content updates straightforward.

## Contact flow

The contact workflow is implemented as follows:

1. User input is validated with `contactSchema`.
2. Valid submissions are stored as `ContactMessage` records in PostgreSQL.
3. A notification email is sent through Resend.
4. The API returns a structured success or error response for the UI.

If email delivery fails after a message is saved, the server returns a clear partial-failure message so the saved record can still be followed up manually.

## Quality checks

Run these checks before shipping changes:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deployment notes

- Provide all required environment variables in the hosting platform.
- Run Prisma generation and migrations as part of the deployment pipeline.
- Use `pnpm build` for production builds and `pnpm start` when serving the built app directly.
- Ensure the Resend sender domain is verified before enabling contact email delivery in production.

## License

No license file is currently included. Add one before distributing or reusing this project publicly.
