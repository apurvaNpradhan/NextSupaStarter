"use client"

import type { Collection } from "@/db/schemas"
import { CollectionSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useTransition } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import debounce from "lodash.debounce"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  createCollection,
  updateCollection,
} from "../../server/actions/collections"
type CollectionFormValues = z.infer<typeof CollectionSchema>

interface CollectionFormProps {
  collection?: Collection
  userId: string
  collections: Collection[]
  onSuccess?: () => void
}

export default function CollectionForm({
  collections,
  userId,
  collection,
  onSuccess,
}: CollectionFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(CollectionSchema),
    defaultValues: {
      name: collection?.name ?? "",
      description: collection?.description ?? "",
      parentId: collection?.parentId ?? null,
      archived: collection?.archived ?? false,
    },
    mode: "onChange",
  })
  const handleSubmit = useCallback(
    debounce(async (values: CollectionFormValues) => {
      startTransition(async () => {
        try {
          const action = collection
            ? await updateCollection(collection.id, userId, values)
            : await createCollection(values, { userId })
          if (action.error) {
            toast.error(action.message)
            return
          }
          toast.success(
            collection ? "Collection updated" : "Collection created",
          )

          onSuccess?.()
          form.reset(values)
        } catch (error) {
          toast.error("Failed to save collection", {
            description:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          })
        }
      })
    }, 500),
    [collection, userId, onSuccess, form],
  )
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Collection Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter collection name"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your collection..."
                  className="resize-none"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Parent Collection</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? ""}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent collection" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {collections?.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {collection && (
          <FormField
            control={form.control}
            name="archived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Archived</FormLabel>
                  <FormDescription>
                    Archive this collection to hide it from active views.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? collection
                ? "Updating..."
                : "Creating..."
              : collection
                ? "Update Collection"
                : "Create Collection"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
