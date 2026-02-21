import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  age: z.number().int().min(0).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  condition: z.string(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
