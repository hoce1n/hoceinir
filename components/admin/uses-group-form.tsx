"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ListPlus, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import {
  createUsesGroup,
  updateUsesGroup,
} from "@/app/admin/(shell)/uses/actions"
import { cn } from "@/lib/utils"
import {
  createUsesGroupSchema,
  type CreateUsesGroupInput,
} from "@/lib/validators/uses"

type UsesGroupFormProps = {
  mode: "create" | "edit"
  usesGroup?: {
    id: string
    group: string
    cmd: string
    items: string[]
    order: number
  }
}

export function UsesGroupForm({ mode, usesGroup }: UsesGroupFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUsesGroupInput>({
    resolver: zodResolver(createUsesGroupSchema),
    defaultValues: {
      group: usesGroup?.group ?? "",
      cmd: usesGroup?.cmd ?? "",
      items: usesGroup?.items ?? [""],
      order: usesGroup?.order ?? 0,
    },
  })

  const items = useWatch({ control, name: "items" }) ?? []

  const addItem = () => {
    setValue("items", [...items, ""], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const removeItem = (index: number) => {
    setValue(
      "items",
      items.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  const onSubmit = async (data: CreateUsesGroupInput) => {
    setServerError(null)
    const result =
      mode === "create"
        ? await createUsesGroup(data)
        : await updateUsesGroup(usesGroup!.id, data)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    toast.success(result.message)
    router.push("/admin/uses")
    router.refresh()
  }

  const submitLabel = mode === "create" ? "create group" : "save changes"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_13rem]">
        <Field label="group name" error={errors.group?.message} required>
          <input
            autoFocus
            {...register("group")}
            className={inputClassName(!!errors.group)}
            placeholder="e.g. Web & Frontend"
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

      <Field label="command" error={errors.cmd?.message} required>
        <input
          {...register("cmd")}
          className={inputClassName(!!errors.cmd)}
          placeholder="e.g. ls ~/web"
        />
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
          Displayed as the terminal prompt in the public Uses card.
        </p>
      </Field>

      <section className="border-t border-border pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              {"// items"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the tools, systems, or skills displayed within this group.
            </p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ListPlus className="size-3.5" /> add item
          </button>
        </div>

        {errors.items?.message ? (
          <p className="mt-3 font-mono text-xs text-destructive">
            ! {errors.items.message}
          </p>
        ) : null}

        <div className="mt-4 space-y-2">
          {items.map((_, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-2.5 font-mono text-sm text-primary">▸</span>
              <div className="min-w-0 flex-1">
                <input
                  {...register(`items.${index}`)}
                  className={inputClassName(!!errors.items?.[index])}
                  placeholder="e.g. Next.js"
                />
                {errors.items?.[index]?.message ? (
                  <p className="mt-1.5 font-mono text-xs text-destructive">
                    ! {errors.items[index].message}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                aria-label={`Remove uses item ${index + 1}`}
                className="mt-1 inline-flex size-9 items-center justify-center rounded-md border border-destructive/40 text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

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
          onClick={() => router.push("/admin/uses")}
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
