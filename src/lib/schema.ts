
import { z } from "zod";

const numberOrEmptyString = z.union([z.number().min(0, "KMs must be a positive number."), z.string().length(0)]).optional().transform(e => e === "" ? undefined : e);

export const formSchema = z.object({
  make: z.string().min(1, "Make is required."),
  model: z.string().min(1, "Model is required."),
  year: z.number().min(1900, "Invalid year.").max(new Date().getFullYear() + 1, "Invalid year."),
  transmission: z.string().min(1, "Transmission is required."),
  chassisKms: numberOrEmptyString.transform(val => val ?? 0).pipe(z.number().min(0)),
  hasSwappedEngine: z.boolean().default(false),
  engineKms: z.number().min(0, "KMs must be a positive number.").optional(),
  drivingHabits: z.string().min(1, "Driving habits are required."),
  stage: z.string(),
  forcedInduction: z.string(),
  turboType: z.string().optional(),
  superchargerKit: z.string().optional(),
  engineSwap: z.string(),
  engineSwapKms: numberOrEmptyString,
  engineKmsAtSwap: numberOrEmptyString,
  lastServiceKms: numberOrEmptyString,
  lastServiceItems: z.array(z.string()).optional(),
}).refine(data => {
    if (data.hasSwappedEngine) {
        // If engine is swapped, these fields are necessary for accurate calculation.
        return data.engineSwapKms !== undefined && data.engineSwapKms !== null &&
               data.engineKmsAtSwap !== undefined && data.engineKmsAtSwap !== null;
    }
    return true;
}, {
    // This message will appear if the logic returns false
    message: "Chassis KMs and Engine KMs at the time of swap are required if the engine has been replaced.",
    path: ["engineSwapKms"], // You can associate the error with a specific field
});

export type FormValues = z.infer<typeof formSchema>;

export type Vehicle = FormValues & {
    id: string;
    userId: string;
};
