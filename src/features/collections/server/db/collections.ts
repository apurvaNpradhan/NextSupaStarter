import { db } from "@/db"
import { collections, type NewCollection } from "@/db/schemas"
import { CACHE_TAGS, dbCache, getCacheTags, revalidateCache } from "@/lib/cache"
import { and, eq } from "drizzle-orm"

type QueryOptions = { limit?: number }

export const collectionService = {
  async getByUser(createdBy: string, options: QueryOptions = {}) {
    const cacheFn = dbCache(
      () =>
        db.query.collections.findMany({
          where: (collections, { eq }) => eq(collections.createdBy, createdBy),
          orderBy: (collections, { desc }) => desc(collections.createdAt),
          limit: options.limit,
        }),
      { tags: getCacheTags(CACHE_TAGS.collections, { userId: createdBy }) },
    )
    return cacheFn()
  },

  async getById({ id, userId }: { id: string; userId: string }) {
    const cacheFn = dbCache(
      () =>
        db.query.collections.findFirst({
          where: (collection, { eq, and }) =>
            and(eq(collection.id, id), eq(collection.createdBy, userId)),
          with: {
            createdBy: true,
          },
        }),
      { tags: getCacheTags(CACHE_TAGS.collections, { id }) },
    )
    return cacheFn()
  },

  async create(data: NewCollection) {
    const [newCollection] = await db
      .insert(collections)
      .values(data)
      .returning({
        id: collections.id,
        createdBy: collections.createdBy,
      })
    revalidateCache(CACHE_TAGS.collections, {
      userId: newCollection?.createdBy,
      id: newCollection?.id,
    })
    return newCollection
  },

  async update(
    { id, userId }: { id: string; userId: string },
    data: Partial<NewCollection>,
  ) {
    const [updatedCollection] = await db
      .update(collections)
      .set(data)
      .where(and(eq(collections.id, id), eq(collections.createdBy, userId)))
      .returning()
    revalidateCache(CACHE_TAGS.collections, { userId, id })
    return updatedCollection
  },

  async delete({ id, userId }: { id: string; userId: string }) {
    const [deletedCollection] = await db
      .delete(collections)
      .where(and(eq(collections.id, id), eq(collections.createdBy, userId)))
      .returning()
    revalidateCache(CACHE_TAGS.collections, { userId, id })
    return deletedCollection
  },
}

// import { db } from "@/db"
// import { Collection } from "@/db/schemas"
// import { sql } from "drizzle-orm"
// import type { z } from "zod"

// export async function getCollectionsInternal(createdBy: string) {
//   try {
//     const query = sql`
//       WITH RECURSIVE collection_hierarchy AS (
//         SELECT
//           id,
//           name,
//           description,
//           created_by,
//           archived,
//           parent_id,
//           0 AS level
//         FROM collections
//         WHERE created_by = ${createdBy} AND parent_id IS NULL
//         UNION ALL
//         -- Recursive case: Select sub-collections
//         SELECT
//           c.id,
//           c.name,
//           c.description,
//           c.created_by,
//           c.archived,
//           c.parent_id,
//           ch.level + 1
//         FROM collections c
//         INNER JOIN collection_hierarchy ch
//         ON c.parent_id = ch.id
//       )
//       SELECT
//         id,
//         name,
//         description,
//         created_by,
//         archived,
//         parent_id,
//         level
//       FROM collection_hierarchy
//     `

//     const result = await db.execute(query)
//     return result as Collection[]
//   } catch (error) {
//     console.error("Error fetching collections:", error)
//     throw new Error("Failed to fetch collections")
//   }
// }
