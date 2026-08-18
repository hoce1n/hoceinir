"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import {
  createProject,
  updateProject,
} from "@/app/admin/(shell)/projects/actions"
import { cn } from "@/lib/utils"
import {
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validators/project"

type ProjectFormProps = {
  mode: "create" | "edit"
  project?: {
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

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter()
  const [tagInput, setTagInput] = useState("")
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: project?.title ?? "",
      blurb: project?.blurb ?? "",
      tags: project?.tags ?? [],
      status: project?.status ?? "WIP",
      repo: project?.repo ?? "",
      url: project?.url ?? "",
      order: project?.order ?? 0,
      published: project?.published ?? true,
    },
  })

  const tags = useWatch({ control, name: "tags" }) ?? []

  const addTags = (rawValue: string) => {
    const candidates = rawValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (candidates.length === 0) return

    const nextTags = Array.from(new Set([...tags, ...candidates]))
    setValue("tags", nextTags, { shouldDirty: true, shouldValidate: true })
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((value) => value !== tag),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const onSubmit = async (data: CreateProjectInput) => {
    setServerError(null)
    const result =
      mode === "create"
        ? await createProject(data)
        : await updateProject(project!.id, data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
    router.push("/admin/projects")
    router.refresh()
  }

  const submitLabel = mode === "create" ? "create project" : "save changes"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="title" error={errors.title?.message} required>
          <input
            autoFocus
            placeholder="e.g. dotfiles"
            {...register("title")}
            className={inputClassName(!!errors.title)}
          />
        </Field>

        <Field label="status" error={errors.status?.message} required>
          <select
            {...register("status")}
            className={inputClassName(!!errors.status)}
          >
            <option value="LIVE">LIVE · deployed and available</option>
            <option value="WIP">WIP · work in progress</option>
            <option value="ARCHIVED">ARCHIVED · no longer active</option>
          </select>
        </Field>
      </div>

      <Field label="blurb" error={errors.blurb?.message} required>
        <textarea
          rows={5}
          placeholder="A concise description of the project and the problem it solves."
          {...register("blurb")}
          className={cn(
            inputClassName(!!errors.blurb),
            "resize-y leading-relaxed"
          )}
        />
      </Field>

      <Field label="tags" error={errors.tags?.message ?? ""}>
        <div
          className={cn(
            "rounded-md border bg-background px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-primary/40",
            errors.tags
              ? "border-destructive"
              : "border-border focus-within:border-primary/60"
          )}
        >
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-xs text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag} tag`}
                  className="rounded-sm text-primary/75 transition-colors hover:text-primary focus:outline-none"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(event) => {
                const value = event.target.value
                if (value.includes(",")) {
                  addTags(value)
                  return
                }
                setTagInput(value)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addTags(tagInput)
                }
              }}
              onBlur={() => addTags(tagInput)}
              placeholder={tags.length ? "add another" : "next.js, postgres"}
              className="min-w-36 flex-1 bg-transparent py-1 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
          Press Enter or comma to add a tag. Maximum 16 tags.
        </p>
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="repo URL" error={errors.repo?.message}>
          <input
            type="url"
            inputMode="url"
            placeholder="https://github.com/user/repo"
            {...register("repo")}
            className={inputClassName(!!errors.repo)}
          />
        </Field>

        <Field label="live URL" error={errors.url?.message}>
          <input
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            {...register("url")}
            className={inputClassName(!!errors.url)}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Field label="order" error={errors.order?.message} required>
          <input
            type="number"
            min="0"
            max="10000"
            step="1"
            {...register("order", { valueAsNumber: true })}
            className={inputClassName(!!errors.order)}
          />
        </Field>

        <div className="rounded-md border border-border bg-muted/20 px-4 py-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              {...register("published")}
              className="mt-0.5 size-4 accent-primary"
            />
            <span>
              <span className="block font-mono text-sm text-foreground">
                <span className="text-primary">$</span> publish project
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                Published projects appear in the public projects section.
              </span>
            </span>
          </label>
        </div>
      </div>

      {serverError ? (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
          ! {serverError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {isSubmitting ? "writing..." : `$ ${submitLabel}`}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          disabled={isSubmitting}
          className="rounded-md border border-border px-4 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
        >
          cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  required = false,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="block space-y-1.5">
      <span className="font-mono text-xs text-muted-foreground">
        <span className="text-primary">$</span> {label}
        {required ? <span className="text-primary"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="block font-mono text-xs text-destructive">
          ! {error}
        </span>
      ) : null}
    </div>
  )
}

function inputClassName(invalid: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40 focus:outline-none",
    invalid ? "border-destructive" : "border-border focus:border-primary/60"
  )
}
