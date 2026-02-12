import * as z from "zod";

export const createUserInput = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed"),
  email: z.email(),
  password: z
    .string()
    .min(6)
    .max(15)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),
});

export const userOutput = z.object({
  id: z.number(),
  username: z.string(),
});

export const updateUserInput = createUserInput
  .partial()
  .refine((object) =>
    Object.values(object).some((value) => value !== undefined),
  );

export type UpdateUserInput = z.infer<typeof updateUserInput>;
