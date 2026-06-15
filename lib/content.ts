export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  status: "live" | "wip" | "archived";
  repo?: string;
  url?: string;
};

export const projects: Project[] = [
  {
    title: "studyhall.saas",
    blurb: "Realtime study-hall management with live seating maps, attendance scans, and session analytics.",
    tags: ["Next.js", "Prisma", "Postgres", "WebSockets"],
    status: "live",
    repo: "https://github.com/hoce1n",
    url: "#",
  },
  {
    title: "deploy-orchestrator",
    blurb: "Tiny Go service that watches git tags, rebuilds container images, and rolls them out behind a REST gateway.",
    tags: ["Go", "REST API", "Git"],
    status: "wip",
    repo: "https://github.com/hoce1n",
  },
  {
    title: "prisma-audit-log",
    blurb: "Open-source Prisma extension that streams diffed mutations into an append-only audit table.",
    tags: ["Prisma", "TypeScript", "OSS"],
    status: "live",
    repo: "https://github.com/hoce1n",
  },
  {
    title: "better-auth-kit",
    blurb: "Drop-in Better-Auth starter with HTTP-only cookie sessions, edge cache, and Prisma adapters for Postgres & MySQL.",
    tags: ["Better-Auth", "Next.js", "Prisma"],
    status: "archived",
    repo: "https://github.com/hoce1n",
  },
];

export const uses: { group: string; cmd: string; items: string[] }[] = [
  {
    group: "OS & Environment",
    cmd: "uname -a",
    items: ["Linux Server Administration", "Ubuntu 22.04 LTS", "Git + GitHub CLI"],
  },
  {
    group: "Web & Frontend",
    cmd: "ls ~/web",
    items: ["Next.js (App Router)", "Tailwind CSS", "TypeScript"],
  },
  {
    group: "Backend & API",
    cmd: "ls ~/api",
    items: ["Go (Golang)", "REST API Routes", "Better-Auth · Sessions · Cookies"],
  },
  {
    group: "Database & Cache",
    cmd: "ls ~/db",
    items: ["Prisma ORM", "PostgreSQL / MySQL / SQLite", "Edge KV · Cache Layers"],
  },
];

export type Article = {
  kind: "log" | "poetry";
  title?: string;
  date?: string;
  tags?: string[];
  readTime?: string;
  body: string;
  closer?: string;
};

export const articles: Article[] = [
  {
    kind: "poetry",
    title: "chmod.777",
    body: "I changed my permissions to chmod 777 just for you, tearing down every single wall so you would have unrestricted read, write, and execute access to my life... After your betrayal, I am forcing a chmod 000 and shutting down the ports.",
    closer: "// Permission denied. Connection permanently closed.",
  },
  {
    kind: "poetry",
    title: "root.access",
    body: "Not everyone deserves root access to your operating system. Some people should stay in a sandbox... But I handed you the master password to my core binaries.",
    closer: "Kernel Panic: Core dependency corrupted by root user.",
  },
  {
    kind: "log",
    title: "Designing Session Cookies That Don't Leak",
    date: "2025-11-04",
    tags: ["better-auth", "cookies"],
    readTime: "6 min",
    body: "A field report on building Better-Auth sessions with HTTP-only cookies, rotating tokens, and a cache layer that survives deploys.",
  },
  {
    kind: "log",
    title: "The Magic of Next.js App Router Optimization",
    date: "2025-10-18",
    tags: ["next", "perf"],
    readTime: "8 min",
    body: "Server components, partial prerendering, and the small dance of streaming UI without paying for hydration twice.",
  },
  {
    kind: "log",
    title: "Prisma Migrations Without Tears",
    date: "2025-09-30",
    tags: ["prisma", "db"],
    readTime: "5 min",
    body: "A safe playbook for shadow databases, expand-and-contract schemas, and rollbacks you'll actually trust.",
  },
];

export const socials = [
  { name: "GitHub", href: "https://github.com/hoce1n", handle: "@hoce1n" },
  { name: "X", href: "https://x.com/hoce1n", handle: "@hoce1n" },
  { name: "Telegram", href: "https://t.me/hoce1n", handle: "@hoce1n" },
  { name: "Instagram", href: "https://instagram.com/hoce1n", handle: "@hoce1n" },
] as const;
