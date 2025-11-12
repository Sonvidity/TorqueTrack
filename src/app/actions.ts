"use server";

import { getDynamicServiceIntervals, type DynamicServiceIntervalsInput, type DynamicServiceIntervalsOutput } from "@/ai/flows/dynamic-service-intervals";
import { z } from "zod";
import { formSchema } from "@/lib/schema";

type FormValues = z.infer<typeof formSchema>;

export type ActionResponse = {
  success: boolean;
  data?: DynamicServiceIntervalsOutput;
  error?: string;
  issues?: z.ZodIssue[];
}

export async function getServiceScheduleAction(values: FormValues): Promise<ActionResponse> {
  const validatedFields = formSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data.",
      issues: validatedFields.error.issues,
    };
  }
  
  const {
    make,
    model,
    year,
    chassisKms,
    engineKms,
    drivingHabits,
    stage,
    forcedInduction,
    turboType,
    superchargerKit,
    engineSwap,
  } = validatedFields.data;

  const aiInput: DynamicServiceIntervalsInput = {
    year: year.toString(),
    make,
    model,
    kms: chassisKms,
    drivingHabits,
    modifications: {
        ...(stage !== 'none' && { stage }),
        ...(forcedInduction === 'turbo' && { turbo: turboType }),
        ...(forcedInduction === 'supercharger' && { supercharger: superchargerKit }),
        ...(engineSwap !== 'stock' && { engineSwap }),
    },
    ...(engineKms > 0 && { engineKms }),
    ...(chassisKms > 0 && { chassisKms }),
  };

  try {
    const result = await getDynamicServiceIntervals(aiInput);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting service intervals:", error);
    return { success: false, error: "An unexpected error occurred while generating the service schedule. Please try again." };
  }
}
