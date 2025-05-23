"use client"

import { Icons } from "@/components/icons"
import { Spinner } from "@/components/icons/spinner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Shell } from "@/components/ui/shell"
import { showErrorToast } from "@/lib/errors"
import { supabaseClient } from "@/lib/supabase/client"
import { emailSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@supabase/supabase-js"
import { Command, LockIcon } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { loginWithEmail } from "./actions"

export function Login({ user }: { user: User | null }) {
  return (
    <Shell
      header={{
        icon: <LockIcon className="size-3.5" />,
        title: "Login",
      }}
    >
      <div className="h-fit max-w-[500px] sm:p-8 ">
        <div
          className="flexflex-col mx-auto w-full justify-center space-y-6 "
          style={{ scale: 0.9 }}
        >
          {user ? (
            <LogOut />
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <Command className="mx-auto size-6" />
                <h1 className="font-semibold text-2xl tracking-tight">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email to sign in to your account
                </p>
              </div>
              <LoginOptions />
            </>
          )}
        </div>
      </div>
    </Shell>
  )
}

export function LoginOptions() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(formData: z.infer<typeof emailSchema>) {
    try {
      setIsLoading(true)

      const { error } = await loginWithEmail({
        email: formData.email,
      })

      if (error) throw new Error(error)

      toast("Email sent! Please check your inbox to verify.")
      form.reset()
    } catch (error) {
      showErrorToast(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleAuth() {
    startTransition(async () => {
      await supabaseClient.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${location.origin}/api/callbacks/github?next=/playground`,
        },
      })
    })
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Continue with Email
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center ">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button variant="outline" disabled={isPending} onClick={handleGoogleAuth}>
        {isPending ? <Spinner /> : <Icons.github className="mr-2 size-4" />}
        Continue with Github
      </Button>
    </div>
  )
}

export function LogOut() {
  return (
    <Button
      className="w-full"
      onClick={async () => {
        await supabaseClient.auth.signOut()
        window.location.reload()
      }}
    >
      Log out
    </Button>
  )
}
