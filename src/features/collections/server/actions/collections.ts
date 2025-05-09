"use server"
import { CollectionSchema, validateInput } from "@/lib/validations"
import type { z } from "zod"
import { collectionService } from "@/features/collections/server/db/collections"
// Standardized response type
type ServiceResponse = { error: boolean; message: string }
export async function createCollection(
  input: z.infer<typeof CollectionSchema>,
  { userId }: { userId: string },
): Promise<ServiceResponse> {
  const validation = validateInput(CollectionSchema, input)
  if ((!validation.success && validation.error) || !validation.data) {
    return { error: true, message: validation.error.message }
  }
  try {
    await collectionService.create({ ...validation.data, createdBy: userId })
    return { error: false, message: "Successfully created collection" }
  } catch (_error) {
    return { error: true, message: "Error creating collection" }
  }
}
export async function updateCollection(
  id: string,
  userId: string,
  input: z.infer<typeof CollectionSchema>,
): Promise<ServiceResponse> {
  const validation = validateInput(CollectionSchema, input)
  if ((!validation.success && validation.error) || !validation.data) {
    return { error: true, message: validation.error.message }
  }
  try {
    const result = await collectionService.update(
      { id, userId },
      validation.data,
    )
    return {
      error: !result,
      message: result
        ? "Successfully updated collection"
        : "Error updating collection",
    }
  } catch (_error) {
    return { error: true, message: "Error updating collection" }
  }
}

export async function deleteCollection(
  id: string,
  userId: string,
): Promise<ServiceResponse> {
  try {
    const result = await collectionService.delete({ id, userId })
    return {
      error: !result,
      message: result
        ? "Successfully deleted collection"
        : "Error deleting collection",
    }
  } catch (_error) {
    return { error: true, message: "Error deleting collection" }
  }
}
