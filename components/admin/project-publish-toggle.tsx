"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { updateProject } from "@/app/admin/(shell)/projects/actions"
import type { CreateProjectInput } from "@/lib/validators/project"

type ProjectPublishToggleProps = {
  project: {
    id: string
    title: string
    blurb: string
    tags: string[]
    status: CreateProjectInput["status"]
    repo: string | null
    url: string | null
    order: number
    published: boolean
  }
}

export function ProjectPublishToggle({ project }: ProjectPublishToggleProps) {
  const [published, setPublished] = useState(project.published)
  const [isPending, startTransition] = useTransition()

  const handleCheckedChange = (nextPublished: boolean) => {
    const previousPublished = published
    setPublished(nextPublished)

    startTransition(() => {
      void (async () => {
        const result = await updateProject(project.id, {
          title: project.title,
          blurb: project.blurb,
          tags: project.tags,
          status: project.status,
          repo: project.repo ?? "",
          url: project.url ?? "",
          order: project.order,
          published: nextPublished,
        })

        if (!result.success) {
          setPublished(previousPublished)
          toast.error(result.error)
          return
        }

        toast.success(
          nextPublished
            ? `${project.title} is now published.`
            : `${project.title} is now a draft.`
        )
      })()
    })
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch
        checked={published}
        onCheckedChange={handleCheckedChange}
        disabled={isPending}
        aria-label={`Set ${project.title} to ${published ? "draft" : "published"}`}
      />
      <span
        className={`font-mono text-[10px] tracking-wider uppercase ${
          published ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {isPending ? "saving" : published ? "live" : "draft"}
      </span>
    </div>
  )
}
