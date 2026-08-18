"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNav } from "@/lib/admin-nav"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">hocein@admin</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-accent">~</span>
          <span className="text-muted-foreground">$</span>{" "}
          <span className="text-foreground">./shell</span>
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {adminNav.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-2 font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
              {"//"} {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 font-mono text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {item.href === "/admin" ? (
                        <span className={cn(active && "text-primary")}>./{item.label}</span>
                      ) : (
                        <span className={cn(active && "text-primary")}>{item.label}</span>
                      )}
                      {active && <span className="ml-auto text-primary">*</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3 font-mono text-[10px] text-muted-foreground/60">
        v1 · admin shell
      </div>
    </aside>
  )
}
