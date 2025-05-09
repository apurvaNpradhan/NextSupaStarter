"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Collection } from "@/db/schemas"
import { useState } from "react"
import CollectionForm from "./form/collection-form"

interface CollectionDialogProps {
  collection?: Collection
  collections: Collection[]
  userId: string
  trigger: React.ReactNode
}
export default function CollectionDialog({
  collection,
  collections,
  userId,
  trigger,
}: CollectionDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {collection ? "Edit collection" : "Add collection"}
          </DialogTitle>
        </DialogHeader>
        <CollectionForm
          userId={userId}
          collections={collections}
          collection={collection}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
