"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { updateSiteSettings } from "@/app/admin/(shell)/settings/actions"
import { cn } from "@/lib/utils"
import {
  updateSiteSettingsSchema,
  type UpdateSiteSettingsInput,
} from "@/lib/validators/site-settings"

type SiteSettingsFormProps = {
  settings: UpdateSiteSettingsInput
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSiteSettingsInput>({
    resolver: zodResolver(updateSiteSettingsSchema),
    defaultValues: settings,
  })

  const nav = useWatch({ control, name: "nav" }) ?? []

  const addNavItem = () => {
    setValue("nav", [...nav, { label: "", href: "#" }], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const removeNavItem = (index: number) => {
    setValue(
      "nav",
      nav.filter((_, navIndex) => navIndex !== index),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const moveNavItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= nav.length) return

    const nextNav = [...nav]
    ;[nextNav[index], nextNav[nextIndex]] = [nextNav[nextIndex], nextNav[index]]
    setValue("nav", nextNav, { shouldDirty: true, shouldValidate: true })
  }

  const onSubmit = async (data: UpdateSiteSettingsInput) => {
    setServerError(null)
    const result = await updateSiteSettings(data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <EditorSection
        command="// hero"
        description="Control the public introduction, badge, and terminal stack output."
      >
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_13rem]">
          <Field label="version" error={errors.version?.message} required>
            <input
              {...register("version")}
              className={inputClassName(!!errors.version)}
              placeholder="e.g. v1.0.0"
            />
          </Field>
          <Field label="badge text" error={errors.badgeText?.message} required>
            <input
              {...register("badgeText")}
              className={inputClassName(!!errors.badgeText)}
              placeholder="e.g. online"
            />
          </Field>
        </div>
        <Field label="hero title" error={errors.heroTitle?.message} required>
          <input
            {...register("heroTitle")}
            className={inputClassName(!!errors.heroTitle)}
            placeholder="e.g. Learning by building."
          />
        </Field>
        <Field
          label="hero subtitle"
          error={errors.heroSubtitle?.message}
          required
        >
          <textarea
            rows={4}
            {...register("heroSubtitle")}
            className={cn(
              inputClassName(!!errors.heroSubtitle),
              "resize-y leading-relaxed"
            )}
            placeholder="The long-form introduction shown beneath the hero title."
          />
        </Field>
        <Field label="stack" error={errors.stack?.message} required>
          <input
            {...register("stack")}
            className={inputClassName(!!errors.stack)}
            placeholder="e.g. next · ts · tailwind · prisma"
          />
        </Field>
      </EditorSection>

      <EditorSection
        command="// header"
        description="Configure the terminal brand and primary navigation in the sticky public header."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="header brand left"
            error={errors.headerBrandLeft?.message}
            required
          >
            <input
              {...register("headerBrandLeft")}
              className={inputClassName(!!errors.headerBrandLeft)}
              placeholder="e.g. ~/hocein"
            />
          </Field>
          <Field
            label="header brand right"
            error={errors.headerBrandRight?.message}
            required
          >
            <input
              {...register("headerBrandRight")}
              className={inputClassName(!!errors.headerBrandRight)}
              placeholder="e.g. portfolio.exe"
            />
          </Field>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs tracking-widest text-primary uppercase">
                {"// nav links"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fragments, internal paths, and fully-qualified URLs are
                supported. Use arrows to change display order.
              </p>
            </div>
            <button
              type="button"
              onClick={addNavItem}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" /> add link
            </button>
          </div>

          {errors.nav?.message ? (
            <p className="mt-3 font-mono text-xs text-destructive">
              ! {errors.nav.message}
            </p>
          ) : null}

          <div className="mt-4 space-y-3">
            {nav.map((_, index) => (
              <div
                key={index}
                className="rounded-md border border-border bg-muted/15 p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    link {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveNavItem(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move navigation link ${index + 1} up`}
                      className="inline-flex size-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNavItem(index, 1)}
                      disabled={index === nav.length - 1}
                      aria-label={`Move navigation link ${index + 1} down`}
                      className="inline-flex size-7 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNavItem(index)}
                      disabled={nav.length === 1}
                      aria-label={`Remove navigation link ${index + 1}`}
                      className="ml-1 inline-flex size-7 items-center justify-center rounded border border-destructive/40 text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
                  <div>
                    <input
                      {...register(`nav.${index}.label`)}
                      className={inputClassName(!!errors.nav?.[index]?.label)}
                      placeholder="label"
                    />
                    {errors.nav?.[index]?.label?.message ? (
                      <p className="mt-1.5 font-mono text-xs text-destructive">
                        ! {errors.nav[index].label?.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <input
                      {...register(`nav.${index}.href`)}
                      className={inputClassName(!!errors.nav?.[index]?.href)}
                      placeholder="#section or /path"
                    />
                    {errors.nav?.[index]?.href?.message ? (
                      <p className="mt-1.5 font-mono text-xs text-destructive">
                        ! {errors.nav[index].href?.message}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EditorSection>

      <EditorSection
        command="// footer"
        description="Maintain the status line and secondary text rendered below the public content."
      >
        <Field label="footer left" error={errors.footerLeft?.message} required>
          <textarea
            rows={2}
            {...register("footerLeft")}
            className={cn(
              inputClassName(!!errors.footerLeft),
              "resize-y leading-relaxed"
            )}
            placeholder={'e.g. echo "© {year} your name"'}
          />
          <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
            Use <span className="text-primary">{"{year}"}</span> to insert the
            current year.
          </p>
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="footer status"
            error={errors.footerStatus?.message}
            required
          >
            <input
              {...register("footerStatus")}
              className={inputClassName(!!errors.footerStatus)}
              placeholder="e.g. healthy"
            />
          </Field>
          <Field label="footer right" error={errors.footerRight?.message}>
            <input
              {...register("footerRight")}
              className={inputClassName(!!errors.footerRight)}
              placeholder="Optional secondary footer line"
            />
          </Field>
        </div>
      </EditorSection>

      <EditorSection
        command="// contact"
        description="This supersedes the contact-copy subset editor and keeps all public SiteSettings in one place."
      >
        <Field
          label="contact intro"
          error={errors.contactIntro?.message}
          required
        >
          <textarea
            rows={4}
            {...register("contactIntro")}
            className={cn(
              inputClassName(!!errors.contactIntro),
              "resize-y leading-relaxed"
            )}
            placeholder="The introductory copy above the public contact form."
          />
        </Field>
        <Field label="tip" error={errors.tip?.message} required>
          <textarea
            rows={3}
            {...register("tip")}
            className={cn(
              inputClassName(!!errors.tip),
              "resize-y leading-relaxed"
            )}
            placeholder="The terminal tip beneath public social links."
          />
        </Field>
      </EditorSection>

      {serverError ? (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
          ! {serverError}
        </p>
      ) : null}

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/95 p-4 shadow-lg shadow-black/30 backdrop-blur">
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
          {isSubmitting ? "writing..." : "$ save site settings"}
        </button>
        <span className="font-mono text-[11px] text-muted-foreground">
          Header, hero, footer, and contact copy update on the homepage after
          save.
        </span>
      </div>
    </form>
  )
}

function EditorSection({
  command,
  description,
  children,
}: {
  command: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5 border-t border-border pt-7 first:border-t-0 first:pt-0">
      <div>
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          {command}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
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
