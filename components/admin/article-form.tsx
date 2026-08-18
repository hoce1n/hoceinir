"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2, Plus, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import {
  createArticle,
  updateArticle,
} from "@/app/admin/(shell)/articles/actions"
import { cn } from "@/lib/utils"
import {
  createArticleSchema,
  slugify,
  type CreateArticleInput,
} from "@/lib/validators/article"

type ArticleFormProps = {
  mode: "create" | "edit"
  article?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    kind: CreateArticleInput["kind"]
    tags: string[]
    readTime: string | null
    closer: string | null
    published: boolean
    publishedAt: string | null
    order: number
  }
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter()
  const [tagInput, setTagInput] = useState("")
  const [serverError, setServerError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(mode === "edit")
  const titleBeforeSlugEdit = useRef(article?.title ?? "")
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      kind: article?.kind ?? "LOG",
      tags: article?.tags ?? [],
      readTime: article?.readTime ?? "",
      closer: article?.closer ?? "",
      published: article?.published ?? true,
      publishedAt:
        article?.publishedAt ?? new Date().toISOString().slice(0, 10),
      order: article?.order ?? 0,
    },
  })

  const title = useWatch({ control, name: "title" }) ?? ""
  const tags = useWatch({ control, name: "tags" }) ?? []

  useEffect(() => {
    if (slugEdited || title === titleBeforeSlugEdit.current) return
    setValue("slug", slugify(title), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [setValue, slugEdited, title])

  const addTags = (rawValue: string) => {
    const candidates = rawValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (candidates.length === 0) return

    setValue("tags", Array.from(new Set([...tags, ...candidates])), {
      shouldDirty: true,
      shouldValidate: true,
    })
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((value) => value !== tag),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const resetSlugFromTitle = () => {
    setSlugEdited(false)
    titleBeforeSlugEdit.current = ""
    setValue("slug", slugify(title), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: CreateArticleInput) => {
    setServerError(null)
    const result =
      mode === "create"
        ? await createArticle(data)
        : await updateArticle(article!.id, data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
    router.push("/admin/articles")
    router.refresh()
  }

  const submitLabel = mode === "create" ? "create article" : "save changes"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_13rem]">
        <Field label="title" error={errors.title?.message} required>
          <input
            autoFocus
            placeholder="e.g. Deploy notes from the edge"
            {...register("title")}
            className={inputClassName(!!errors.title)}
          />
        </Field>

        <Field label="kind" error={errors.kind?.message} required>
          <select
            {...register("kind")}
            className={inputClassName(!!errors.kind)}
          >
            <option value="LOG">LOG · dev notes</option>
            <option value="POETRY">POETRY · terminal verse</option>
          </select>
        </Field>
      </div>

      <Field label="slug" error={errors.slug?.message} required>
        <div className="flex gap-2">
          <input
            placeholder="deploy-notes-from-the-edge"
            {...register("slug", {
              onChange: () => setSlugEdited(true),
            })}
            className={inputClassName(!!errors.slug)}
          />
          <button
            type="button"
            onClick={resetSlugFromTitle}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            title="Generate a slug from the current title"
          >
            <Sparkles className="size-3.5" /> generate
          </button>
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
          Auto-generated from the title until you edit it. Used in the public
          URL.
        </p>
      </Field>

      <Field label="excerpt" error={errors.excerpt?.message}>
        <textarea
          rows={3}
          placeholder="A short preview used by dev log cards. Poetry uses the Markdown content in the scroll."
          {...register("excerpt")}
          className={cn(
            inputClassName(!!errors.excerpt),
            "resize-y leading-relaxed"
          )}
        />
      </Field>

      <Field
        label="content · Markdown"
        error={errors.content?.message}
        required
      >
        <textarea
          rows={18}
          spellCheck={false}
          placeholder={
            "# A terminal heading\n\nWrite **Markdown** here. GFM tables, lists, code fences, links, and blockquotes are supported."
          }
          {...register("content")}
          className={cn(
            inputClassName(!!errors.content),
            "min-h-96 resize-y leading-relaxed"
          )}
        />
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
          <span className="text-primary">$</span> rendered with Markdown + GFM
          on the public article page.
        </p>
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
        <Field label="read time" error={errors.readTime?.message}>
          <input
            placeholder="e.g. 4 min read"
            {...register("readTime")}
            className={inputClassName(!!errors.readTime)}
          />
        </Field>

        <Field label="closer" error={errors.closer?.message}>
          <input
            placeholder="Optional final line for the article or poem"
            {...register("closer")}
            className={inputClassName(!!errors.closer)}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="published at" error={errors.publishedAt?.message}>
          <input
            type="date"
            {...register("publishedAt")}
            className={inputClassName(!!errors.publishedAt)}
          />
        </Field>

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
      </div>

      <div className="rounded-md border border-border bg-muted/20 px-4 py-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            {...register("published")}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>
            <span className="block font-mono text-sm text-foreground">
              <span className="text-primary">$</span> publish article
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              Published logs become homepage cards and public Markdown pages.
              Published poetry appears in the poetry scroll.
            </span>
          </span>
        </label>
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
          ) : mode === "create" ? (
            <Plus className="size-4" />
          ) : (
            <FileText className="size-4" />
          )}
          {isSubmitting ? "writing..." : `$ ${submitLabel}`}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
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
