"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { adminNav } from "@/lib/admin-nav"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <span className="hidden sm:inline">$ search</span>
        <span className="rounded border border-border px-1 text-[10px]">⌘K</span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        // portal renders outside .dark wrapper, so force dark terminal palette
        contentClassName="dark bg-zinc-950 text-zinc-100 border-zinc-800"
      >
        <CommandInput placeholder="type a command — e.g. projects, messages..." />
        <CommandList>
          <CommandEmpty className="font-mono text-xs text-zinc-500">
            no results found — try projects or messages
          </CommandEmpty>
          {adminNav.map((group) => (
            <CommandGroup key={group.label} heading={`// ${group.label}`}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.label} ${item.hint}`}
                  onSelect={() => {
                    setOpen(false)
                    router.push(item.href)
                  }}
                >
                  <item.icon className="size-4 text-zinc-400" />
                  <span className="font-mono text-sm">{item.label}</span>
                  <span className="ml-auto font-mono text-xs text-zinc-500">{item.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
