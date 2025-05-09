import { revalidateTag, unstable_cache } from "next/cache"
import { cache } from "react"

// Add more tags specific to your application
export const CACHE_TAGS = {
  collections: "collections",
  collection: "collection",
} as const

export type CacheTag = keyof typeof CACHE_TAGS

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const
}

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>

export function clearFullCache() {
  console.info("Clearing full cache with wildcard tag '*'")
  revalidateTag("*")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] },
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }))
}

export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS
  userId?: string
  id?: string
}) {
  revalidateTag(getGlobalTag(tag))
  if (userId != null) {
    revalidateTag(getUserTag(userId, tag))
  }
  if (id != null) {
    revalidateTag(getIdTag(id, tag))
  }
}
export const getCacheTags = (
  tag: keyof typeof CACHE_TAGS,
  { userId, id }: { userId?: string; id?: string } = {},
) => [
  ...(userId ? [getUserTag(userId, tag)] : []),
  ...(id ? [getIdTag(id, tag)] : []),
]

// Reusable revalidation function
export const revalidateCache = (
  tag: keyof typeof CACHE_TAGS,
  {
    userId,
    id,
    relatedId,
  }: { userId?: string; id?: string; relatedId?: string } = {},
) => {
  revalidateDbCache({ tag, userId, id })
  if (relatedId)
    revalidateDbCache({ tag: CACHE_TAGS.collections, userId, id: relatedId })
}
