import {
  LayoutDashboard,
  FolderGit2,
  Newspaper,
  UserRound,
  Cpu,
  Mail,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  hint: string
}

export type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

export const adminNav: AdminNavGroup[] = [
  {
    label: "content",
    items: [
      {
        label: "dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        hint: "overview",
      },
      {
        label: "projects",
        href: "/admin/projects",
        icon: FolderGit2,
        hint: "manage ./projects",
      },
      {
        label: "articles",
        href: "/admin/articles",
        icon: Newspaper,
        hint: "manage ./articles",
      },
      {
        label: "about",
        href: "/admin/about",
        icon: UserRound,
        hint: "manage ./about",
      },
      { label: "uses", href: "/admin/uses", icon: Cpu, hint: "manage ./uses" },
    ],
  },
  {
    label: "system",
    items: [
      {
        label: "messages",
        href: "/admin/messages",
        icon: Mail,
        hint: "inbox ./messages",
      },
      {
        label: "logs",
        href: "/admin/logs",
        icon: ScrollText,
        hint: "journalctl -f",
      },
      {
        label: "settings",
        href: "/admin/settings",
        icon: Settings,
        hint: "system settings",
      },
    ],
  },
]

export const adminNavFlat = adminNav.flatMap((group) => group.items)
