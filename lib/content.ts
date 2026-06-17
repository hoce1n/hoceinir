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
      repo: "https://github.com/hoce1n/minimal-saas",
      url: "https://studivo.ir",
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
      items: ["Next.js", "Tailwind CSS", "TypeScript"],
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
      title: "oop.tragedy",
      body: "Encapsulation taught me to hide my vulnerabilities inside. Inheritance taught me to carry the heavy weight of expectations. Polymorphism taught me to wear a different face for every environment. Abstraction taught me to overlook the painful details of my reality. Life taught me that no matter how perfectly I compile, none of it was enough.",
      closer: "// Compilation successful. System hollow.",
    },
    {
      kind: "poetry",
      title: "chmod.777",
      body: "I changed my permissions to chmod 777 just for you, tearing down every single wall so you would have unrestricted read, write, and execute access to my life. After your betrayal, I am forcing a chmod 000 and shutting down the ports. It hurts to lock myself in the dark, but good luck finding another server that will open its entire architecture just to keep you safe.",
      closer: "// Permission denied. Connection permanently closed.",
    },
    {
      kind: "poetry",
      title: "root.access",
      body: "Not everyone deserves root access to your operating system. Some people should stay in a sandbox. Some should have restricted user shells. But I handed you the master password to my core binaries. You modified configurations I never wanted changed. And when you logged out, you left the system permanently compromised.",
      closer: "Kernel Panic: Core dependency corrupted by root user.",
    },
    {
      kind: "poetry",
      title: "backup.gateway",
      body: "I dropped my own network speed trying to route her traffic. I stayed up late clearing her packet loss, configuring my own servers to handle her overflow. In the end, I was just a Backup Gateway. The moment her main link came back online, she updated her routing tables and pointed her data to a different destination.",
      closer: "// Session timed out. Default route modified.",
    },
    {
      kind: "poetry",
      title: "detached.env",
      body: "I broke my own code trying to fix hers. I stayed up late resolving every conflict, treating her bugs as my absolute priority. In the end, I was just a temporary environment. The moment she stabilized, she linked her code to a different developer.",
      closer: "// Execution terminated. Memories left in cache.",
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
