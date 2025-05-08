import { rateLimit } from "@/lib/rate-limit"
import { supabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await rateLimit({})

    const token_hash = request.nextUrl.searchParams.get("token_hash")
    const next = request.nextUrl.searchParams.get("next") || "/"

    if (!token_hash) throw new Error("Missing parameters")

    const supabase = supabaseServerClient()

    if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({
        type: "magiclink",
        token_hash: token_hash,
      })

      if (error) throw new Error(error.message)

      return NextResponse.redirect(new URL(next, request.url))
    }
  } catch (_error) {
    return NextResponse.redirect(new URL("/error", request.url))
  }
}
