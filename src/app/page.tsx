import { Hero } from "@/components/sections/hero"
import { getUser } from "@/lib/supabase/server"

export default async function HomePage() {
  const user = await getUser()
  if (!user) {
    return <div> Not Logged In</div>
  }

  return (
    <div className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 flex w-full flex-col items-center justify-center">
      <Hero />
    </div>
  )
}
