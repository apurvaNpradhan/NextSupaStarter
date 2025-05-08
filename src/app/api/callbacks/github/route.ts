import { supabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    const supabase = supabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/signup?error=${encodeURIComponent(error.message)}`,
          request.url,
        ),
      )
    }

    return NextResponse.redirect(new URL(next, request.url))
  } catch (_error) {
    return NextResponse.redirect(
      new URL("/signup?error=ServerError", request.url),
    )
  }
}
