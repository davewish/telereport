import { z } from "zod";

export const createReportSchema = z.object({
  patientId: z.string().uuid(),
  heartRate: z.number().int().min(30).max(220),
  systolicBP: z.number().int().min(70).max(200),
  diastolicBP: z.number().int().min(40).max(130),
  oxygenLevel: z.number().min(50).max(100),
  temperature: z.number().min(34).max(42),
  symptoms: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
