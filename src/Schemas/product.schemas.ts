import * as z from "zod";

export const createProductInput = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.number().int().positive(),
});

export const updateProductInput = createProductInput
  .partial()
  .refine((object) => Object.values(object).some((value) => value !== undefined));

export const productOutput = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  createdAt: z.date(),
  categoryId: z.number(),
});

export type CreateProductInput = z.infer<typeof createProductInput>;
export type UpdateProductInput = z.infer<typeof updateProductInput>;
