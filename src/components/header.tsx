"use client"

import { Suspense, type ReactNode } from "react"

interface HeaderProps {
  component?: ReactNode
}
export default function Header({ component }: HeaderProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b ">
      <Suspense fallback={<div>Loading...</div>}>{component}</Suspense>
    </header>
  )
}
