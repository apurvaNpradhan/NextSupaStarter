import * as z from "zod"

export const validateInput = <T>(schema: z.ZodType<T>, input: unknown) => {
  const { success, data, error } = schema.safeParse(input)
  if (!success) {
    return {
      success: false,
      error: { message: "Invalid input", details: error.issues },
    }
  }
  return { success: true, data }
}

export const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
})

export const CollectionSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Collection name is required",
    })
    .max(255),
  description: z
    .string()
    .min(1, {
      message: "Collection description is required",
    })
    .max(255),
  archived: z.boolean().default(false).optional(),
  parentId: z.string().optional().nullable(),
})
