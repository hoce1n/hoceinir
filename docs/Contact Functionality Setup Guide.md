# Contact Functionality Setup Guide

**Project:** [hoce1n/hoceinir](https://github.com/hoce1n/hoceinir)  
**Reviewed commit:** `673be28`  
**Prepared by:** Manus AI

## Purpose

The Contact section is already wired end to end. A visitor submits their name, email address, and message; the server validates the input, saves it to PostgreSQL through Prisma, and sends a notification email through Resend. To activate the flow in development or production, you need to provide a PostgreSQL connection string, configure Resend, and expose the same variables to the environment in which Next.js runs.

> The application does not require Supabase specifically. It requires a reachable PostgreSQL database. Supabase, Neon, Railway, a self-hosted PostgreSQL instance, or another PostgreSQL provider can be used.

## What you need to provide

| Variable | Required value | Where it is used | Secret? |
|---|---|---|---|
| `DATABASE_URL` | A PostgreSQL connection string for the database that will store contact messages | Prisma configuration and the runtime PostgreSQL pool | Yes |
| `RESEND_API_KEY` | An API key created in the Resend dashboard | `app/actions.ts`, when sending the notification | Yes |
| `RESEND_FROM_EMAIL` | A sender address, or `Name <address>` value, using a domain verified in Resend | The `from` field of the outgoing email | Treat as configuration; do not expose client-side |
| `CONTACT_TO_EMAIL` | The inbox where new contact messages should arrive | The `to` field of the outgoing email | Usually not secret, but keep it server-side |

The template for these values is [`.env.example`](./.env.example). Copy it to `.env` locally; do not commit `.env` to Git.

## Step 1: Provision PostgreSQL

Create a PostgreSQL database with your preferred provider. Record the host, database name, username, password, port, and SSL requirements. The connection string normally follows this shape:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
```

Some hosted providers append SSL parameters, for example `sslmode=require`. Use the exact connection string supplied by the provider rather than manually guessing the provider-specific options.

The only database table currently required by the Contact flow is `ContactMessage`, with fields for an ID, sender name, sender email, message body, and creation timestamp. This table is defined in [`prisma/schema.prisma`](./prisma/schema.prisma), and the initial SQL migration is in [`prisma/migrations/20260616180120_init/migration.sql`](./prisma/migrations/20260616180120_init/migration.sql).

## Step 2: Configure Resend

Create or use a [Resend](https://resend.com) account and create an API key at [Resend API Keys](https://resend.com/api-keys). Copy the key into `RESEND_API_KEY`.

Before using a custom sender address, add and verify the sending domain in Resend. For example, if you want to send from `contact@yourdomain.com`, Resend may require DNS records such as SPF and DKIM. Complete the verification shown in the Resend dashboard before testing production delivery.

Then set the sender and destination values:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="hoceinir <contact@yourdomain.com>"
CONTACT_TO_EMAIL="you@yourdomain.com"
```

`RESEND_FROM_EMAIL` is the address visitors will see as the sender. `CONTACT_TO_EMAIL` is the inbox that receives the notification. The visitor’s submitted email is placed in `replyTo`, so replying to the notification should address the visitor directly.

## Step 3: Create the local environment file

From the project root, run:

```bash
cp .env.example .env
```

Edit `.env` and replace every placeholder with a real value. A complete local file should resemble the following, but the values below are examples only:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
RESEND_API_KEY="re_actual_key_here"
RESEND_FROM_EMAIL="hoceinir <contact@yourdomain.com>"
CONTACT_TO_EMAIL="you@yourdomain.com"
```

Do not place these values in `NEXT_PUBLIC_*` variables. They are server-side configuration and should never be bundled into browser JavaScript. Do not paste live secrets into source files, screenshots, issues, or chat logs.

## Step 4: Install dependencies and initialize Prisma

Run the following commands from the repository root:

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
```

`pnpm prisma generate` creates the generated Prisma client under `lib/generated/prisma`. `pnpm prisma migrate deploy` applies the committed migration to the database named by `DATABASE_URL`. Run the migration command once for each new environment, including staging and production.

For a development database where you are actively changing the schema, use the normal Prisma development migration workflow and commit any resulting migration directory. Do not use a production database for experimental schema changes.

## Step 5: Run and test locally

Start the application:

```bash
pnpm dev
```

Open the local URL printed by Next.js, scroll to the Contact section, and submit a test message. Confirm all three outcomes:

| Check | Expected result |
|---|---|
| Form validation | Empty or malformed values are rejected in the UI, and the message must be between 4 and 1,000 characters. |
| Database persistence | A new row appears in the `ContactMessage` table. |
| Email notification | A message arrives at `CONTACT_TO_EMAIL` from `RESEND_FROM_EMAIL`, and replying addresses the visitor’s submitted email. |

The endpoint is also available as `POST /api/send`, although the current Contact component calls the server action in [`app/actions.ts`](./app/actions.ts) directly. The endpoint delegates to the same server action.

If the database write succeeds but Resend fails, the application reports that the message was saved but email delivery failed. In that case, inspect the server logs and the Resend dashboard; the saved database row should still be available for follow-up.

## Step 6: Configure deployment

In your hosting provider’s project settings, add all four variables to the server/runtime environment. Do not rely on your local `.env` file being uploaded automatically. The deployment must be able to reach the PostgreSQL host from its server runtime, and the Resend sender domain must remain verified.

A typical deployment sequence is:

```bash
pnpm install --frozen-lockfile
pnpm prisma generate
pnpm prisma migrate deploy
pnpm build
pnpm start
```

If the platform has a separate build step and runtime step, make sure the Prisma client is generated during the build and that migrations run against the intended database before the application receives traffic. Use a separate database for local development, staging, and production when possible.

## Security and operational checklist

Keep `DATABASE_URL` and `RESEND_API_KEY` in the hosting provider’s encrypted secret store. Limit access to the PostgreSQL database to the application and administrators, and enable the provider’s SSL option when required. Do not expose a database-management URL or credentials in the browser.

The current Contact flow has input validation and basic error handling, but it does not include CAPTCHA, rate limiting, abuse throttling, or an administrative message viewer. If the site will be public, consider adding rate limiting and spam protection before launch. Also decide how long contact messages should be retained and who is authorized to access them.

## Important repository notes

The README describes the Contact flow accurately at a high level, but the implementation details are worth keeping in mind:

1. The database insert occurs before the email is sent. A delivery failure therefore does not necessarily mean the message was lost.
2. `app/actions.ts` contains fallback Resend addresses (`onboarding@resend.dev`) when sender or recipient variables are absent. Treat those fallbacks as development safeguards, not production configuration. Set all four variables explicitly.
3. The current Prisma schema has one migration, `20260616180120_init`, which creates `ContactMessage`. There is no separate migration required beyond applying the committed migration.
4. The repository’s production build completed successfully with placeholder environment values, and TypeScript type checking passed. The repository-wide lint command currently reports unrelated existing JSX escaping/comment-style issues and two React effect warnings; these are code-quality issues rather than missing Contact environment variables.
5. The project README mentions an API route at `app/api/send/route.ts`; that route is present and returns the same structured result as the server action.

## Final checklist

Before considering the Contact flow ready, verify that you have completed the following:

- [ ] Created a PostgreSQL database and copied its complete connection string.
- [ ] Set `DATABASE_URL` in local and deployment environments.
- [ ] Applied `pnpm prisma migrate deploy` to the intended database.
- [ ] Created a Resend API key and set `RESEND_API_KEY`.
- [ ] Verified the sending domain in Resend.
- [ ] Set `RESEND_FROM_EMAIL` to an address on that verified domain.
- [ ] Set `CONTACT_TO_EMAIL` to the inbox that should receive submissions.
- [ ] Submitted a real test message and confirmed the database row.
- [ ] Confirmed receipt and reply behavior for the notification email.
- [ ] Added spam protection or rate limiting before public launch if the form is expected to receive significant traffic.

## References

[1]: https://github.com/hoce1n/hoceinir "hoce1n/hoceinir repository"
[2]: https://resend.com/docs "Resend documentation"
[3]: https://resend.com/api-keys "Resend API keys"
[4]: ./README.md "Project README"
[5]: ./app/actions.ts "Contact server action"
[6]: ./components/sections/Contact.tsx "Contact form UI"
[7]: ./prisma/schema.prisma "Prisma schema"
[8]: ./prisma/migrations/20260616180120_init/migration.sql "Initial database migration"
