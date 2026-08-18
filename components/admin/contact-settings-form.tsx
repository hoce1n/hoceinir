"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateContactSettings } from "@/app/admin/(shell)/messages/actions"
import { cn } from "@/lib/utils"
import {
  updateContactSettingsSchema,
  type UpdateContactSettingsInput,
} from "@/lib/validators/contact-settings"

type ContactSettingsFormProps = {
  settings: UpdateContactSettingsInput
}

export function ContactSettingsForm({ settings }: ContactSettingsFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateContactSettingsInput>({
    resolver: zodResolver(updateContactSettingsSchema),
    defaultValues: settings,
  })

  const onSubmit = async (data: UpdateContactSettingsInput) => {
    setServerError(null)
    const result = await updateContactSettings(data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
          {isSubmitting ? "writing..." : "$ save contact copy"}
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
