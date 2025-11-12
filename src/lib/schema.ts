import { z } from "zod";

export const formSchema = z.object({
  make: z.string().min(1, "Make is required."),
  model: z.string().min(1, "Model is required."),
  year: z.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1, "Invalid year."),
  chassisKms: z.number().min(0, "KMs must be a positive number."),
  engineKms: z.number().min(0, "KMs must be a positive number."),
  drivingHabits: z.string().min(1, "Driving habits are required."),
  stage: z.string(),
  forcedInduction: z.string(),
  turboType: z.string().optional(),
  superchargerKit: z.string().optional(),
  engineSwap: z.string(),
});
