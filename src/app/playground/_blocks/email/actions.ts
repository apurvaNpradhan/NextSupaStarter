"use server"

import { TestEmail } from "@/components/emails/test-email"
import { env } from "@/env"
import { catchError } from "@/lib/errors"
import { rateLimit } from "@/lib/rate-limit"
import { unstable_noStore as noStore } from "next/cache"
import { headers } from "next/headers"
import { Resend } from "resend"

interface SendEmailProps {
  email: string
}

const resend = new Resend(env.RESEND_API_KEY)

export async function sendEmail({ email }: SendEmailProps) {
  noStore()
  const headersList = headers()
  const ip = headersList.get("x-real-ip") || "127.0.0.1"

  try {
    await rateLimit({
      actionType: "sendEmail",
      identifier: ip,
    })

    const { error } = await resend.emails.send({
      from: "Starter <noreply@email.sujjeee.com>",
      to: email,
      subject: "Test Email",
      headers: {
        "X-Entity-Ref-ID": `${new Date().getTime()}`,
      },
      react: TestEmail(),
    })

    if (error) throw new Error(error.message)

    return {
      data: null,
      error: null,
    }
  } catch (error) {
    return catchError(error)
  }
}
