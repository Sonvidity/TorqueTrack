import { z } from "zod";

export const formSchema = z.object({
  make: z.string().min(1, "Make is required."),
  model: z.string().min(1, "Model is required."),
  year: z.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1, "Invalid year."),
  chassisKms: z.number().min(0, "KMs must be a positive number."),
  hasSwappedEngine: z.boolean().default(false),
  engineKms: z.number().min(0, "KMs must be a positive number.").optional(),
  drivingHabits: z.string().min(1, "Driving habits are required."),
  stage: z.string(),
  forcedInduction: z.string(),
  turboType: z.string().optional(),
  superchargerKit: z.string().optional(),
  engineSwap: z.string(),
  engineSwapKms: z.number().min(0, "KMs must be a positive number.").optional(),
  engineKmsAtSwap: z.number().min(0, "KMs must be a positive number.").optional(),
  lastServiceKms: z.number().min(0, "KMs must be a positive number.").optional(),
  lastServiceItems: z.string().optional(),
}).refine(data => {
    if (data.hasSwappedEngine) {
        // If engine is swapped, we need the swap history to calculate engine KMs.
        return data.engineSwapKms !== undefined && data.engineKmsAtSwap !== undefined;
    }
    return true;
}, {
    message: "Chassis KMs and Engine KMs at the time of swap are required when engine is swapped.",
    path: ["engineSwapKms"], // You can point to a relevant field
});

export type FormValues = z.infer<typeof formSchema>;

export type Vehicle = FormValues & {
    id: string;
    userId: string;
};
