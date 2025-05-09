"use client"
import type { Collection } from "@/db/schemas"
import { useState, useTransition } from "react"
import {
  deleteCollection,
  updateCollection,
} from "../server/actions/collections"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Ellipsis } from "lucide-react"
import { Button } from "@/components/ui/button"
import CollectionForm from "./form/collection-form"

export default function CollectionListItem({
  collection,
  collections,
  level = 0,
  userId,
}: {
  collection: Collection
  collections: Collection[]
  userId: string
  level?: number
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleArchiveToggle = async () => {
    startTransition(async () => {
      try {
        const data = await updateCollection(collection.id, userId, {
          name: collection.name,
          description: collection.description ?? "",
          parentId: collection.parentId,
          archived: !collection.archived,
        })
        if (data.error) {
          toast.error(data.message)
        } else {
          toast.success(
            collection.archived
              ? "Collection unarchived"
              : "Collection archived",
          )
        }
      } catch (error) {
        toast.error("Error updating collection", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        })
      }
    })
  }

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const data = await deleteCollection(collection.id, userId)
        if (data.error) {
          toast.error(data.message)
        } else {
          toast.success("Collection deleted")
        }
      } catch (error) {
        toast.error("Error deleting collection", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        })
      }
    })
  }

  const childCollections = collections.filter(
    (c) => c.parentId === collection.id,
  )

  return (
    <div>
      <article
        className={cn(
          " group flex items-center justify-between rounded-sm rounded-b-none border-b px-2 py-2 transition-colors hover:bg-accent/80",
          collection.archived && "opacity-75",
        )}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/collections/${collection.id}`}
            className="min-w-0 truncate font-medium text-base hover:underline"
            title={collection.name}
          >
            {collection.name}
            {collection.archived && (
              <Badge variant="outline" className="ml-2">
                Archived
              </Badge>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="sr-only">More options</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className=" text-muted-foreground"
              disabled={isPending}
            >
              <Ellipsis className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" rounded-lg" sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/collections/${collection.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchiveToggle}>
                {collection.archived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      <span className="font-semibold">{collection.name}</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isPending}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </article>

      {childCollections.map((child) => (
        <CollectionListItem
          key={child.id}
          collection={child}
          collections={collections}
          userId={userId}
          level={level + 1} // Increase nesting level for children
        />
      ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <CollectionForm
            collection={collection}
            userId={userId}
            collections={collections}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
