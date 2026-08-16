# Prisma 7 + Supabase + Vercel
## Database Setup, Architecture, and Prisma Concepts

---

## 1. Overview

This document explains how a Next.js application deployed on Vercel can use PostgreSQL hosted by Supabase through Prisma 7.

The architecture used in this project is:

```text
                    Internet
                       │
                       ▼
                ┌──────────────┐
                │    Vercel    │
                │   Next.js    │
                └──────┬───────┘
                       │
                       │ Prisma Client
                       ▼
                ┌──────────────┐
                │   Supabase   │
                │  PostgreSQL  │
                └──────────────┘
```

Prisma is the ORM layer between the Next.js application and PostgreSQL.

Supabase provides and manages the PostgreSQL database.

Vercel runs the Next.js application.

---

# 2. The Main Components

There are four major components involved:

```text
Next.js
   │
   ▼
Prisma Client
   │
   ▼
PostgreSQL
   │
   ▼
Supabase
```

### Next.js

Next.js is the application framework.

It contains:

- React components
- Server Components
- Server Actions
- API routes
- Application logic

It does not directly manage the database connection.

Instead, application code uses Prisma Client.

---

### Prisma

Prisma is an ORM and database toolkit.

It provides several important tools:

- Prisma Schema
- Prisma Client
- Prisma Migrate
- Prisma CLI
- Prisma Config
- Prisma Adapters

These components have different responsibilities.

---

### PostgreSQL

PostgreSQL is the actual relational database.

It stores:

- tables
- rows
- columns
- indexes
- constraints
- relations
- database schemas

Prisma does not replace PostgreSQL.

Prisma provides a developer-friendly way to work with PostgreSQL from TypeScript.

---

### Supabase

Supabase provides a managed PostgreSQL database.

Instead of running PostgreSQL ourselves inside Docker, Supabase manages:

- PostgreSQL infrastructure
- database availability
- backups
- networking
- connection pooling
- database management tools

For a Vercel-hosted application, this is convenient because the database is accessible remotely.

---

# 3. Prisma Schema

The Prisma schema is the main definition of the application's database structure.

Typical location:

```text
prisma/
└── schema.prisma
```

A simplified example:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

The schema describes what the database should look like.

It contains things such as:

- generators
- models
- fields
- field types
- relations
- indexes
- constraints

---

# 4. What Is a Prisma Model?

A `model` represents a database entity.

For example:

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
}
```

This model conceptually represents a database table:

```text
User
┌──────────────┐
│ id           │
│ email        │
│ name         │
└──────────────┘
```

The model is also used by Prisma Client to generate a type-safe API.

For example:

```ts
const users = await prisma.user.findMany();
```

The `user` API exists because the schema contains:

```prisma
model User
```

### Important distinction

A Prisma model is not itself a database table.

It is Prisma's representation of the database entity.

During migration, Prisma translates schema changes into SQL operations that modify the actual PostgreSQL database.

---

# 5. What Is the `generator`?

The `generator` tells Prisma what code or artifacts should be generated from the schema.

Example:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}
```

The important parts are:

```text
generator client
        │
        ├── provider
        │
        └── output
```

### `provider`

The provider specifies which Prisma generator should be used.

In this project:

```prisma
provider = "prisma-client"
```

This is the newer Prisma Client generator.

---

### `output`

The output specifies where the generated Prisma Client should be placed.

For this project:

```prisma
output = "../lib/generated/prisma"
```

Therefore Prisma generates files such as:

```text
lib/
└── generated/
    └── prisma/
        ├── client.ts
        ├── prismaNamespace.ts
        └── ...
```

The application can then import the generated client:

```ts
import { PrismaClient } from "@/lib/generated/prisma/client";
```

---

# 6. What Is Prisma Client?

Prisma Client is the TypeScript/JavaScript database client generated from the Prisma schema.

It allows application code to interact with the database using TypeScript instead of writing raw SQL for every operation.

For example:

```ts
const users = await prisma.user.findMany();
```

Instead of:

```sql
SELECT * FROM "User";
```

Prisma Client provides:

- Type safety
- Autocomplete
- Query APIs
- Relation APIs
- Create/update/delete operations
- Transaction APIs

---

## 6.1 Prisma Client Is Generated

Prisma Client is not normally written manually.

It is generated from:

```text
schema.prisma
       │
       ▼
prisma generate
       │
       ▼
Generated Prisma Client
```

Therefore, whenever the Prisma schema changes, Prisma Client should be regenerated.

Command:

```bash
pnpm prisma generate
```

---

# 7. What Is Prisma Migrate?

Prisma Migrate manages changes to the database schema.

Suppose we add:

```prisma
model Post {
  id    String @id @default(cuid())
  title String
}
```

We can create a migration:

```bash
pnpm prisma migrate dev --name add_post
```

Prisma generates migration files:

```text
prisma/
└── migrations/
    └── 20260816_add_post/
        └── migration.sql
```

The migration contains SQL instructions required to change the database.

---

# 8. `migrate dev` vs `migrate deploy`

These commands have different purposes.

## Development

Use:

```bash
pnpm prisma migrate dev
```

during development.

It can:

- create migrations
- apply migrations
- update the development database
- regenerate Prisma Client

---

## Production

Use:

```bash
pnpm prisma migrate deploy
```

in production.

It applies existing migration files to the production database.

It does not create new migrations.

The intended flow is:

```text
Development

schema.prisma
     │
     ▼
prisma migrate dev
     │
     ▼
prisma/migrations/
```

Then:

```text
Production

prisma/migrations/
     │
     ▼
prisma migrate deploy
     │
     ▼
Production PostgreSQL
```

---

# 9. What Is a Prisma Pool?

There are two different concepts that are easy to confuse:

1. Prisma Client
2. PostgreSQL connection pool

Prisma Client is the database API.

A connection pool manages PostgreSQL connections.

In this project, the pool comes from the `pg` package:

```ts
import { Pool } from "pg";
```

Example:

```ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

The pool maintains reusable database connections.

Instead of creating a completely new PostgreSQL connection for every query, the application can reuse connections from the pool.

Conceptually:

```text
Next.js
   │
   ▼
Prisma Client
   │
   ▼
PrismaPg Adapter
   │
   ▼
pg Pool
   │
   ▼
PostgreSQL
```

---

# 10. What Is `PrismaPg`?

With Prisma 7, this project uses the PostgreSQL adapter:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
```

The adapter connects Prisma Client to the PostgreSQL driver.

Conceptually:

```text
Prisma Client
      │
      ▼
PrismaPg Adapter
      │
      ▼
pg Pool
      │
      ▼
PostgreSQL
```

Example:

```ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
```

This means Prisma Client is using the `pg` PostgreSQL driver through the Prisma PostgreSQL adapter.

---

# 11. What Is a PostgreSQL Connection Pool?

A connection pool is a collection of reusable database connections.

Without pooling, an application could repeatedly do:

```text
Request
  ↓
Open PostgreSQL connection
  ↓
Execute query
  ↓
Close connection
```

With pooling:

```text
Application
    │
    ▼
Connection Pool
 ┌────┬────┬────┬────┐
 │ C1 │ C2 │ C3 │ C4 │
 └────┴────┴────┴────┘
    │
    ▼
PostgreSQL
```

Connections can be reused by different requests.

This becomes particularly important in serverless environments such as Vercel, where many application instances can exist.

---

# 12. Supabase Connection Pooling

Supabase provides PostgreSQL connection pooling.

For this project, Supabase provides two relevant connection URLs:

```text
DATABASE_URL
DIRECT_URL
```

The provided configuration is:

```text
DATABASE_URL
→ Transaction-mode pooler
→ port 6543

DIRECT_URL
→ Session-mode pooler
→ port 5432
→ used for migrations
```

The exact connection strings are stored as environment variables and should never be committed to Git.

---

# 13. Why Are There Two Database URLs?

The application and migration system have different requirements.

### Runtime

The application can use the transaction-mode pooler:

```text
DATABASE_URL
       │
       ▼
Supabase Transaction Pooler
       │
       ▼
PostgreSQL
```

This is useful for application traffic.

### Migrations

Prisma migrations use:

```text
DIRECT_URL
       │
       ▼
Supabase Session Pooler
       │
       ▼
PostgreSQL
```

The migration connection is configured separately in `prisma.config.ts`.

---

# 14. Prisma Config

Prisma 7 can use a `prisma.config.ts` file for Prisma configuration.

Current project structure:

```text
prisma.config.ts
prisma/
├── schema.prisma
└── migrations/
```

The configuration contains:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
```

The important part is:

```ts
datasource: {
  url: process.env["DIRECT_URL"],
}
```

This means Prisma CLI operations such as:

```bash
prisma migrate deploy
```

use `DIRECT_URL`.

---

# 15. Runtime Database Connection

The application runtime uses `DATABASE_URL`.

Conceptually:

```text
process.env.DATABASE_URL
          │
          ▼
       pg Pool
          │
          ▼
     PrismaPg
          │
          ▼
    Prisma Client
          │
          ▼
      Supabase
```

Example:

```ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
```

This is separate from Prisma CLI migrations.

---

# 16. Environment Variables

Production environment variables should be configured in Vercel.

Example:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

Never commit real credentials:

```text
.env
.env.local
```

should generally not be committed to Git.

The password must also never appear in:

- source code
- Git commits
- public documentation
- screenshots
- logs

---

# 17. Vercel Build Process

The project's current build script is:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start -p 4173",
    "lint": "eslint",
    "format": "prettier --write \"**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

Therefore Vercel performs:

```text
pnpm build
     │
     ├── prisma generate
     │
     ├── prisma migrate deploy
     │
     └── next build
```

---

# 18. What Happens During `prisma generate`?

The process is:

```text
schema.prisma
      │
      ▼
Prisma Generator
      │
      ▼
lib/generated/prisma
```

The generated client can then be imported:

```ts
import { PrismaClient } from "@/lib/generated/prisma/client";
```

If the generated client does not exist during the Next.js build, the build can fail with:

```text
Module not found:
Can't resolve '@/lib/generated/prisma/client'
```

Therefore `prisma generate` must happen before `next build`.

---

# 19. What Happens During `prisma migrate deploy`?

The process is:

```text
prisma/migrations/
       │
       ▼
prisma migrate deploy
       │
       ▼
DIRECT_URL
       │
       ▼
Supabase PostgreSQL
```

Prisma checks which migrations have already been applied and applies the missing migrations.

It does not simply recreate the entire database every time.

---

# 20. Full Production Architecture

The complete system looks like this:

```text
                         VERCEL
                    ┌──────────────┐
                    │   Next.js    │
                    └──────┬───────┘
                           │
                           │ Runtime
                           ▼
                    ┌──────────────┐
                    │ Prisma Client│
                    └──────┬───────┘
                           │
                       PrismaPg
                           │
                        pg Pool
                           │
                           ▼
              DATABASE_URL :6543
                           │
                           ▼
                    Supabase Pooler
                           │
                           ▼
                    PostgreSQL


              Deployment / Migration
                           │
                           ▼
                 prisma migrate deploy
                           │
                           ▼
                     DIRECT_URL :5432
                           │
                           ▼
                  Supabase Session Pooler
                           │
                           ▼
                     PostgreSQL
```

---

# 21. Important Prisma Concepts at a Glance

| Component | Purpose |
|---|---|
| `schema.prisma` | Defines the database structure for Prisma |
| `model` | Represents a database entity/table |
| `generator` | Defines what Prisma should generate |
| `Prisma Client` | Type-safe API used by application code |
| `prisma generate` | Generates Prisma Client |
| `Prisma Migrate` | Manages database schema changes |
| `migrate dev` | Creates/applies migrations during development |
| `migrate deploy` | Applies existing migrations in production |
| `prisma.config.ts` | Configures Prisma CLI behavior |
| `pg` | PostgreSQL Node.js driver |
| `Pool` | Manages reusable PostgreSQL connections |
| `PrismaPg` | Prisma adapter for the `pg` driver |
| `DATABASE_URL` | Runtime database connection |
| `DIRECT_URL` | Migration database connection |
| Supabase | Managed PostgreSQL infrastructure |
| Vercel | Hosts the Next.js application |

---

# 22. Mental Model

A useful way to remember the architecture is:

```text
                 DEFINITION
                     │
                     ▼
              schema.prisma
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
     Prisma Client          Migrations
          │                     │
          │                     ▼
          │              prisma migrate deploy
          │                     │
          ▼                     ▼
       pg Pool              DIRECT_URL
          │                     │
          ▼                     ▼
     DATABASE_URL         Supabase PostgreSQL
          │
          ▼
   Supabase PostgreSQL
```

The key distinction is:

```text
Prisma Schema
     ≠
Prisma Client
     ≠
Prisma Migration
     ≠
PostgreSQL
     ≠
Supabase
```

They work together, but they are different layers.

---

# 23. Common Commands

### Generate Prisma Client

```bash
pnpm prisma generate
```

### Create a development migration

```bash
pnpm prisma migrate dev --name migration_name
```

### Deploy existing migrations

```bash
pnpm prisma migrate deploy
```

### Inspect the database

```bash
pnpm prisma studio
```

### Check Prisma version

```bash
pnpm prisma -v
```

---

# 24. Final Architecture Summary

For this project:

```text
Next.js
   │
   ▼
Prisma Client
   │
   ▼
PrismaPg
   │
   ▼
pg Pool
   │
   ▼
DATABASE_URL
   │
   ▼
Supabase PostgreSQL
```

For migrations:

```text
prisma/migrations
       │
       ▼
prisma migrate deploy
       │
       ▼
prisma.config.ts
       │
       ▼
DIRECT_URL
       │
       ▼
Supabase PostgreSQL
```

And for deployment:

```text
Git Push
   │
   ▼
Vercel
   │
   ▼
pnpm build
   │
   ├── prisma generate
   │
   ├── prisma migrate deploy
   │
   └── next build
```

This separation makes the roles of Next.js, Prisma, PostgreSQL, Supabase, Vercel, connection pooling, Prisma Client, and migrations much easier to understand.