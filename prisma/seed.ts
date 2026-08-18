import { db } from "../lib/db"
import { ArticleKind, ProjectStatus } from "@/lib/generated/prisma/enums"

async function ensureProject(data: {
  title: string
  blurb: string
  tags: string[]
  status: (typeof ProjectStatus)[keyof typeof ProjectStatus]
  repo?: string | null
  url?: string | null
  order: number
}) {
  const existing = await db.project.findFirst({ where: { title: data.title } })
  if (existing) return
  await db.project.create({ data })
}

async function ensureUsesGroup(data: {
  group: string
  cmd: string
  items: string[]
  order: number
}) {
  const existing = await db.usesGroup.findFirst({
    where: { group: data.group },
  })
  if (existing) return
  await db.usesGroup.create({ data })
}

async function ensureSocialLink(data: {
  name: string
  handle: string
  href: string
  order: number
}) {
  const existing = await db.socialLink.findFirst({ where: { name: data.name } })
  if (existing) return
  await db.socialLink.create({ data })
}

const poetrySeed = [
  {
    slug: "oop.tragedy",
    title: "oop.tragedy",
    content:
      "Encapsulation taught me to hide my vulnerabilities inside. Inheritance taught me to carry the heavy weight of expectations. Polymorphism taught me to wear a different face for every environment. Abstraction taught me to overlook the painful details of my reality. Life taught me that no matter how perfectly I compile, none of it was enough.",
    closer: "// Compilation successful. System hollow.",
    order: 0,
  },
  {
    slug: "chmod.777",
    title: "chmod.777",
    content:
      "I changed my permissions to chmod 777 just for you, tearing down every single wall so you would have unrestricted read, write, and execute access to my life. After your betrayal, I am forcing a chmod 000 and shutting down the ports. It hurts to lock myself in the dark, but good luck finding another server that will open its entire architecture just to keep you safe.",
    closer: "// Permission denied. Connection permanently closed.",
    order: 1,
  },
  {
    slug: "root.access",
    title: "root.access",
    content:
      "Not everyone deserves root access to your operating system. Some people should stay in a sandbox. Some should have restricted user shells. But I handed you the master password to my core binaries. You modified configurations I never wanted changed. And when you logged out, you left the system permanently compromised.",
    closer: "Kernel Panic: Core dependency corrupted by root user.",
    order: 2,
  },
  {
    slug: "backup.gateway",
    title: "backup.gateway",
    content:
      "I dropped my own network speed trying to route her traffic. I stayed up late clearing her packet loss, configuring my own servers to handle her overflow. In the end, I was just a Backup Gateway. The moment her main link came back online, she updated her routing tables and pointed her data to a different destination.",
    closer: "// Session timed out. Default route modified.",
    order: 3,
  },
  {
    slug: "detached.env",
    title: "detached.env",
    content:
      "I broke my own code trying to fix hers. I stayed up late resolving every conflict, treating her bugs as my absolute priority. In the end, I was just a temporary environment. The moment she stabilized, she linked her code to a different developer.",
    closer: "// Execution terminated. Memories left in cache.",
    order: 4,
  },
]

const logSeed = [
  {
    slug: "designing-session-cookies-that-dont-leak",
    title: "Designing Session Cookies That Don't Leak",
    publishedAt: new Date("2025-11-04T00:00:00.000Z"),
    tags: ["better-auth", "cookies"],
    readTime: "6 min",
    excerpt:
      "A field report on building Better-Auth sessions with HTTP-only cookies, rotating tokens, and a cache layer that survives deploys.",
    content:
      "A field report on building Better-Auth sessions with HTTP-only cookies, rotating tokens, and a cache layer that survives deploys.\n\n## Why cookies?\n\nSessions live in an HTTP-only cookie so the browser owns the token and JavaScript never touches it. The server stores a hash of the session token — never the raw value — so a leaked database never hands over live sessions.\n\n## Rotation\n\nEvery read of a session rotates its token, invalidating the previous one. A stolen token is only useful until the next request, which dramatically shrinks the window an attacker can operate in.\n\n## Surviving deploys\n\nSession state lives in a shared cache layer so restarts and rolling deploys don't drop every logged-in user. The cache is the source of truth; the cookie is just the key.",
    order: 0,
  },
  {
    slug: "the-magic-of-next-js-app-router-optimization",
    title: "The Magic of Next.js App Router Optimization",
    publishedAt: new Date("2025-10-18T00:00:00.000Z"),
    tags: ["next", "perf"],
    readTime: "8 min",
    excerpt:
      "Server components, partial prerendering, and the small dance of streaming UI without paying for hydration twice.",
    content:
      "Server components, partial prerendering, and the small dance of streaming UI without paying for hydration twice.\n\n## Server components\n\nComponents run on the server and send finished HTML to the client. No JavaScript ships for the parts of the page that are purely presentational — the browser renders what the server already computed.\n\n## Partial prerendering\n\nStatic shells are prerendered at build time while dynamic slots stream in on request. Users see a full layout instantly instead of a spinner, and the interactive pieces fill in as they arrive.\n\n## The hydration dance\n\nThe trick is knowing exactly which subtree needs to be interactive. Everything above the fold that never changes stays server-rendered; only the truly dynamic islands hydrate, so you never pay for hydration twice.",
    order: 1,
  },
  {
    slug: "prisma-migrations-without-tears",
    title: "Prisma Migrations Without Tears",
    publishedAt: new Date("2025-09-30T00:00:00.000Z"),
    tags: ["prisma", "db"],
    readTime: "5 min",
    excerpt:
      "A safe playbook for shadow databases, expand-and-contract schemas, and rollbacks you'll actually trust.",
    content:
      "A safe playbook for shadow databases, expand-and-contract schemas, and rollbacks you'll actually trust.\n\n## Shadow databases\n\nPrisma spins up a shadow database to diff the migration against the actual schema, so a broken migration is caught before it touches production data.\n\n## Expand and contract\n\nAdditive changes ship first: create the new column or table, backfill it, then deploy. Destructive changes wait — drop the old column only after nothing references it anymore.\n\n## Trustworthy rollbacks\n\nEvery migration is a versioned, inspectable file. Rolling back means applying the previous file, not reverse-engineering a state you can no longer see.",
    order: 2,
  },
]

async function seedArticles() {
  for (const p of poetrySeed) {
    await db.article.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        content: p.content,
        kind: ArticleKind.POETRY,
        closer: p.closer,
        published: true,
        order: p.order,
      },
      create: {
        slug: p.slug,
        title: p.title,
        content: p.content,
        kind: ArticleKind.POETRY,
        closer: p.closer,
        published: true,
        order: p.order,
      },
    })
  }

  for (const l of logSeed) {
    await db.article.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        excerpt: l.excerpt,
        content: l.content,
        kind: ArticleKind.LOG,
        tags: l.tags,
        readTime: l.readTime,
        published: true,
        publishedAt: l.publishedAt,
        order: l.order,
      },
      create: {
        slug: l.slug,
        title: l.title,
        excerpt: l.excerpt,
        content: l.content,
        kind: ArticleKind.LOG,
        tags: l.tags,
        readTime: l.readTime,
        published: true,
        publishedAt: l.publishedAt,
        order: l.order,
      },
    })
  }
}

async function main() {
  const projects = [
    {
      title: "studyhall.saas",
      blurb:
        "Realtime study-hall management with live seating maps, attendance scans, and session analytics.",
      tags: ["Next.js", "Prisma", "Postgres", "WebSockets"],
      status: ProjectStatus.LIVE,
      repo: "https://github.com/hoce1n/minimal-saas",
      url: "https://studivo.ir",
      order: 0,
    },
    {
      title: "deploy-orchestrator",
      blurb:
        "Tiny Go service that watches git tags, rebuilds container images, and rolls them out behind a REST gateway.",
      tags: ["Go", "REST API", "Git"],
      status: ProjectStatus.WIP,
      repo: "https://github.com/hoce1n",
      url: null,
      order: 1,
    },
    {
      title: "prisma-audit-log",
      blurb:
        "Open-source Prisma extension that streams diffed mutations into an append-only audit table.",
      tags: ["Prisma", "TypeScript", "OSS"],
      status: ProjectStatus.LIVE,
      repo: "https://github.com/hoce1n",
      url: null,
      order: 2,
    },
    {
      title: "better-auth-kit",
      blurb:
        "Drop-in Better-Auth starter with HTTP-only cookie sessions, edge cache, and Prisma adapters for Postgres & MySQL.",
      tags: ["Better-Auth", "Next.js", "Prisma"],
      status: ProjectStatus.ARCHIVED,
      repo: "https://github.com/hoce1n",
      url: null,
      order: 3,
    },
  ]

  for (const p of projects) await ensureProject(p)

  const usesGroups = [
    {
      group: "OS & Environment",
      cmd: "uname -a",
      items: [
        "Linux Server Administration",
        "Ubuntu 22.04 LTS",
        "Git + GitHub CLI",
      ],
      order: 0,
    },
    {
      group: "Web & Frontend",
      cmd: "ls ~/web",
      items: ["Next.js", "Tailwind CSS", "TypeScript"],
      order: 1,
    },
    {
      group: "Backend & API",
      cmd: "ls ~/api",
      items: [
        "Go (Golang)",
        "REST API Routes",
        "Better-Auth · Sessions · Cookies",
      ],
      order: 2,
    },
    {
      group: "Database & Cache",
      cmd: "ls ~/db",
      items: [
        "Prisma ORM",
        "PostgreSQL / MySQL / SQLite",
        "Edge KV · Cache Layers",
      ],
      order: 3,
    },
  ]

  for (const g of usesGroups) await ensureUsesGroup(g)

  const socials = [
    {
      name: "GitHub",
      handle: "@hoce1n",
      href: "https://github.com/hoce1n",
      order: 0,
    },
    { name: "X", handle: "@hoce1n", href: "https://x.com/hoce1n", order: 1 },
    {
      name: "Telegram",
      handle: "@hoce1n",
      href: "https://t.me/hoce1n",
      order: 2,
    },
    {
      name: "Instagram",
      handle: "@hoce1n",
      href: "https://instagram.com/hoce1n",
      order: 3,
    },
  ]

  for (const s of socials) await ensureSocialLink(s)

  await seedArticles()

  await db.aboutSection.upsert({
    where: { id: "about" },
    update: {},
    create: {
      id: "about",
      name: "hocein",
      role: "Full-Stack Dev / Linux SysAdmin",
      loves: "Next.js, TS, Tailwind, Go, Prisma, Better-Auth",
      currently: "tuning REST APIs, session cookies & cache layers",
      philosophy: "ship neat, configure deeply, document later",
      paragraphs: [
        "I'm a software developer with a strong passion for the `Next.js` ecosystem (TypeScript + Tailwind), Go-powered API routes, and database orchestration via `Prisma` across SQLite, MySQL, and PostgreSQL.",
        "I obsess over auth done right — `Better-Auth` sessions, HTTP-only cookies, and caching layers that keep REST endpoints fast without leaking state.",
      ],
      stats: [
        { k: "stack pillars", v: "5+" },
        { k: "servers tamed", v: "30+" },
        { k: "coffee.lock", v: "held" },
      ],
    },
  })

  await db.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      version: "v1.0.0",
      heroTitle: "Learning by building.",
      heroSubtitle:
        "Hi, I'm `hocein` — a Full-Stack Developer who enjoys building modern applications with Next.js, React, TypeScript, PostgreSQL, and Prisma.",
      stack: "next · ts · tailwind · go · prisma · postgres · better-auth",
      badgeText: "online",
      headerBrandLeft: "~/hocein",
      headerBrandRight: "portfolio.exe",
      nav: [
        { href: "#about", label: "about" },
        { href: "#articles", label: "articles" },
        { href: "#projects", label: "projects" },
        { href: "#uses", label: "uses" },
        { href: "#contact", label: "contact" },
      ],
      footerLeft: 'echo "© {year} hocein — built with caffeine and chmod"',
      footerRight: "",
      footerStatus: "healthy",
      tip: "I usually reply within 24h. If urgent, ping on Telegram.",
      contactIntro:
        "Got an idea, a server on fire, or just want to nerd out? Drop a message.",
    },
  })

  console.log("seed complete")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
