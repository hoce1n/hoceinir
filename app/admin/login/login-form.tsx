"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginInput } from "@/lib/validators/auth"
import { login } from "@/app/admin/actions"

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const result = await login(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">$</span> email
        </span>
        <input
          type="email"
          autoComplete="username"
          placeholder="admin@hocein.ir"
          {...register("email")}
          className={inputCls(!!errors.email)}
        />
        {errors.email ? (
          <span className="block font-mono text-xs text-destructive">
            ! {errors.email.message}
          </span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          <span className="text-primary">$</span> passwd
        </span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          {...register("password")}
          className={inputCls(!!errors.password)}
        />
        {errors.password ? (
          <span className="block font-mono text-xs text-destructive">
            ! {errors.password.message}
          </span>
        ) : null}
      </label>

      {serverError ? (
        <p className="font-mono text-xs text-destructive">! {serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? "authenticating..." : "$ ssh connect"}
      </button>
    </form>
  )
}

function inputCls(invalid: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40 focus:outline-none",
    invalid ? "border-destructive" : "border-border focus:border-primary/60"
  )
}
