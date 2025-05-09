import { relations } from "drizzle-orm"
import { index, pgSchema, text, uuid } from "drizzle-orm/pg-core"
import { collections } from "./collections"
const authSchema = pgSchema("auth")
export const users = authSchema.table(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
  },
  (table) => ({
    idx_users_email: index("idx_users_email").on(table.email),
  }),
)
export const userRelations = relations(users, ({ many }) => ({
  collections: many(collections),
}))
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
