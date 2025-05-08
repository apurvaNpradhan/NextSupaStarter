import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Hero() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-fit max-w-[620px]">
        <h1 className="mb-6 font-bold text-[56px] text-foreground leading-[61px]">
          NEXTJS STARTER
        </h1>
        <div className="flex items-center space-x-6">
          <Link
            href="/playground"
            className={cn(
              buttonVariants({
                variant: "default",
                size: "sm",
              }),
            )}
          >
            Playground
          </Link>
        </div>
      </div>
    </div>
  )
}
