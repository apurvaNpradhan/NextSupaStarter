import {
  type AnyPgColumn,
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { relations, sql } from "drizzle-orm"
export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    archived: boolean("archived").default(false).notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => collections.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    idx_collection_name: index("idx_collection_name").on(table.name),
  }),
)
export const collectionRelations = relations(collections, ({ many, one }) => ({
  parent: one(collections, {
    fields: [collections.parentId],
    references: [collections.id],
    relationName: "nested_collections",
  }),
  subCollections: many(collections, {
    relationName: "nested_collections",
  }),
  createdBy: one(users, {
    fields: [collections.createdBy],
    references: [users.id],
  }),
}))

export type Collection = typeof collections.$inferSelect
export type NewCollection = typeof collections.$inferInsert
