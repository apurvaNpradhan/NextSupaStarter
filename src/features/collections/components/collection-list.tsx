import type { Collection } from "@/db/schemas"
import CollectionListItem from "./collection-list-item"
import CollectionDialog from "./collection-dialog"
import { Button } from "@/components/ui/button"

interface CollectionListProps {
  userId: string
  collections: Collection[]
}

export default function CollectionList({
  userId,
  collections,
}: CollectionListProps) {
  const topLevelCollections = collections.filter(
    (collection) => !collection.parentId,
  )
  if (!collections || collections.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        No collections found
        <CollectionDialog
          userId={userId}
          collections={collections}
          trigger={
            <Button size="sm" variant={"ghost"}>
              <span>Add a new Collection</span>
            </Button>
          }
        />
      </div>
    )
  }
  return (
    <div className="mt-8">
      <header className="flex flex-row items-center justify-between border-border/50 border-b pb-3">
        <h2 className="font-semibold text-foreground text-lg">
          {collections.length} Collections
        </h2>
        <CollectionDialog
          userId={userId}
          collections={collections}
          trigger={
            <Button size="sm">
              <span>Add Collection</span>
            </Button>
          }
        />
      </header>

      <div className="mt-5 space-y-1">
        {topLevelCollections.map((collection) => (
          <CollectionListItem
            key={collection.id}
            collection={collection}
            collections={collections}
            userId={userId}
          />
        ))}
      </div>
    </div>
  )
}
