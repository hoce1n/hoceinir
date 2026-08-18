"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { updateAbout } from "@/app/admin/(shell)/about/actions"
import { cn } from "@/lib/utils"
import {
  updateAboutSchema,
  type UpdateAboutInput,
} from "@/lib/validators/about"

type AboutFormProps = {
  about: UpdateAboutInput
}

export function AboutForm({ about }: AboutFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAboutInput>({
    resolver: zodResolver(updateAboutSchema),
    defaultValues: about,
  })

  const paragraphs = useWatch({ control, name: "paragraphs" }) ?? []
  const stats = useWatch({ control, name: "stats" }) ?? []

  const addParagraph = () => {
    setValue("paragraphs", [...paragraphs, ""], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const removeParagraph = (index: number) => {
    setValue(
      "paragraphs",
      paragraphs.filter((_, paragraphIndex) => paragraphIndex !== index),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const addStat = () => {
    setValue("stats", [...stats, { k: "", v: "" }], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const removeStat = (index: number) => {
    setValue(
      "stats",
      stats.filter((_, statIndex) => statIndex !== index),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const onSubmit = async (data: UpdateAboutInput) => {
    setServerError(null)
    const result = await updateAbout(data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            {"// bio.sh fields"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            These values are printed by the public terminal profile.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="name" error={errors.name?.message} required>
            <input
              {...register("name")}
              className={inputClassName(!!errors.name)}
              placeholder="e.g. hocein"
            />
          </Field>
          <Field label="role" error={errors.role?.message} required>
            <input
              {...register("role")}
              className={inputClassName(!!errors.role)}
              placeholder="e.g. Full-Stack Dev / Linux SysAdmin"
            />
          </Field>
        </div>

        <Field label="loves" error={errors.loves?.message} required>
          <input
            {...register("loves")}
            className={inputClassName(!!errors.loves)}
            placeholder="e.g. Next.js, TypeScript, Tailwind"
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="currently" error={errors.currently?.message} required>
            <textarea
              rows={3}
              {...register("currently")}
              className={cn(
                inputClassName(!!errors.currently),
                "resize-y leading-relaxed"
              )}
              placeholder="What are you currently building or learning?"
            />
          </Field>
          <Field label="philosophy" error={errors.philosophy?.message} required>
            <textarea
              rows={3}
              {...register("philosophy")}
              className={cn(
                inputClassName(!!errors.philosophy),
                "resize-y leading-relaxed"
              )}
              placeholder="A short working philosophy"
            />
          </Field>
        </div>
      </section>

      <section className="border-t border-border pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              {"// paragraphs"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Long-form profile text shown alongside the public bio terminal.
            </p>
          </div>
          <button
            type="button"
            onClick={addParagraph}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="size-3.5" /> add paragraph
          </button>
        </div>

        {errors.paragraphs?.message ? (
          <p className="mt-3 font-mono text-xs text-destructive">
            ! {errors.paragraphs.message}
          </p>
        ) : null}

        <div className="mt-4 space-y-3">
          {paragraphs.map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-border bg-muted/15 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  paragraph {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  disabled={paragraphs.length === 1}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-destructive transition-colors hover:text-destructive/80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="size-3" /> remove
                </button>
              </div>
              <textarea
                rows={4}
                {...register(`paragraphs.${index}`)}
                className={inputClassName(!!errors.paragraphs?.[index])}
                placeholder="Write a profile paragraph."
              />
              {errors.paragraphs?.[index]?.message ? (
                <p className="mt-1.5 font-mono text-xs text-destructive">
                  ! {errors.paragraphs[index].message}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              {"// stats"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Compact key-value metrics rendered under the profile copy.
            </p>
          </div>
          <button
            type="button"
            onClick={addStat}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="size-3.5" /> add stat
          </button>
        </div>

        {errors.stats?.message ? (
          <p className="mt-3 font-mono text-xs text-destructive">
            ! {errors.stats.message}
          </p>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {stats.map((_, index) => (
            <div
              key={index}
              className="rounded-md border border-border bg-muted/15 p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  stat {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  disabled={stats.length === 1}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-destructive transition-colors hover:text-destructive/80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="size-3" /> remove
                </button>
              </div>
              <div className="grid gap-2">
                <input
                  {...register(`stats.${index}.k`)}
                  className={inputClassName(!!errors.stats?.[index]?.k)}
                  placeholder="label"
                />
                <input
                  {...register(`stats.${index}.v`)}
                  className={inputClassName(!!errors.stats?.[index]?.v)}
                  placeholder="value"
                />
              </div>
              {errors.stats?.[index]?.k?.message ? (
                <p className="mt-1.5 font-mono text-xs text-destructive">
                  ! {errors.stats[index].k?.message}
                </p>
              ) : null}
              {errors.stats?.[index]?.v?.message ? (
                <p className="mt-1.5 font-mono text-xs text-destructive">
                  ! {errors.stats[index].v?.message}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {serverError ? (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
          ! {serverError}
        </p>
      ) : null}

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "writing..." : "$ save profile"}
        </button>
        <span className="font-mono text-[11px] text-muted-foreground">
          Changes publish to the homepage after save.
        </span>
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
