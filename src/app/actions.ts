
"use server";

import { getDynamicServiceIntervals, type DynamicServiceIntervalsInput, type DynamicServiceIntervalsOutput } from "@/ai/flows/dynamic-service-intervals";
import { z } from "zod";
import { formSchema, type FormValues } from "@/lib/schema";
import { saveVehicle as saveVehicleToDb } from "@/firebase/firestore/mutations";
import { nanoid } from "nanoid";

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
  
  const aiInput = mapFormToAIInput(validatedFields.data);

  try {
    const result = await getDynamicServiceIntervals(aiInput);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting service intervals:", error);
    return { success: false, error: "An unexpected error occurred while generating the service schedule. Please try again." };
  }
}

export async function saveVehicleAction(userId: string, values: FormValues): Promise<{success: boolean; error?: string, vehicleId?: string}> {
    if (!userId) {
        return { success: false, error: "User not authenticated." };
    }

    const validatedFields = formSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid form data." };
    }

    const vehicleId = nanoid();
    
    // Calculate engineKms before saving
    let currentEngineKms = validatedFields.data.chassisKms;
    if (validatedFields.data.hasSwappedEngine && validatedFields.data.engineSwapKms && validatedFields.data.engineKmsAtSwap) {
      currentEngineKms = (validatedFields.data.chassisKms - validatedFields.data.engineSwapKms) + validatedFields.data.engineKmsAtSwap;
    }

    const vehicleData = {
        ...validatedFields.data,
        id: vehicleId,
        userId: userId,
        engineKms: currentEngineKms, // Save the calculated engine KMs
    }

    try {
        saveVehicleToDb(userId, vehicleId, vehicleData);
        return { success: true, vehicleId: vehicleId };
    } catch (e) {
        console.error('Failed to save vehicle:', e)
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        return { success: false, error: `Failed to save vehicle: ${errorMessage}` };
    }
}


function mapFormToAIInput(data: FormValues): DynamicServiceIntervalsInput {
    const {
        make,
        model,
        year,
        drivingHabits,
        stage,
        forcedInduction,
        turboType,
        superchargerKit,
        engineSwap,
      } = data;

      return {
        year: year.toString(),
        make,
        model,
        drivingHabits,
        modifications: {
            ...(stage !== 'none' && { stage }),
            ...(forcedInduction === 'turbo' && { turbo: turboType }),
            ...(forcedInduction === 'supercharger' && { supercharger: superchargerKit }),
            ...(engineSwap !== 'stock' && { engineSwap }),
        },
      };
}
