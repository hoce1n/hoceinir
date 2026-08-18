"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  createSocialLink,
  updateSocialLink,
} from "@/app/admin/(shell)/messages/actions"
import { cn } from "@/lib/utils"
import {
  createSocialLinkSchema,
  type CreateSocialLinkInput,
} from "@/lib/validators/contact-settings"

type SocialLinkFormProps = {
  mode: "create" | "edit"
  socialLink?: {
    id: string
    name: string
    handle: string
    href: string
    order: number
  }
}

export function SocialLinkForm({ mode, socialLink }: SocialLinkFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSocialLinkInput>({
    resolver: zodResolver(createSocialLinkSchema),
    defaultValues: {
      name: socialLink?.name ?? "",
      handle: socialLink?.handle ?? "",
      href: socialLink?.href ?? "",
      order: socialLink?.order ?? 0,
    },
  })

  const onSubmit = async (data: CreateSocialLinkInput) => {
    setServerError(null)
    const result =
      mode === "create"
        ? await createSocialLink(data)
        : await updateSocialLink(socialLink!.id, data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
    router.push("/admin/messages?view=settings")
    router.refresh()
  }

  const submitLabel = mode === "create" ? "create social" : "save changes"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="name" error={errors.name?.message} required>
        <input
          autoFocus
          {...register("name")}
          className={inputClassName(!!errors.name)}
          placeholder="e.g. GitHub"
        />
      </Field>

      <Field label="handle" error={errors.handle?.message} required>
        <input
          {...register("handle")}
          className={inputClassName(!!errors.handle)}
          placeholder="e.g. @hoce1n"
        />
      </Field>

      <Field label="URL" error={errors.href?.message} required>
        <input
          type="url"
          inputMode="url"
          {...register("href")}
          className={inputClassName(!!errors.href)}
          placeholder="https://github.com/hoce1n"
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
            <Save className="size-4" />
          )}
          {isSubmitting ? "writing..." : `$ ${submitLabel}`}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.push("/admin/messages?view=settings")}
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
