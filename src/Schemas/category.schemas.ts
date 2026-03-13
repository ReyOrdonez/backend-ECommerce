import * as z from "zod";

export const createCategoryInput = z.object({
  name: z.string().min(1).max(50),
});

export const updateCategoryInput = createCategoryInput.partial();

export const categoryOutput = z.object({
  id: z.number(),
  name: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategoryInput>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryInput>;
