
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
    const vehicleData = {
        ...validatedFields.data,
        id: vehicleId,
        userId: userId,
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
        chassisKms,
        hasSwappedEngine,
        engineKms,
        drivingHabits,
        stage,
        forcedInduction,
        turboType,
        superchargerKit,
        engineSwap,
        engineSwapKms,
        engineKmsAtSwap,
        lastServiceKms,
        lastServiceItems,
      } = data;

      return {
        year: year.toString(),
        make,
        model,
        kms: chassisKms,
        hasSwappedEngine,
        drivingHabits,
        modifications: {
            ...(stage !== 'none' && { stage }),
            ...(forcedInduction === 'turbo' && { turbo: turboType }),
            ...(forcedInduction === 'supercharger' && { supercharger: superchargerKit }),
            ...(engineSwap !== 'stock' && { engineSwap }),
        },
        ...(engineKms && engineKms > 0 && { engineKms }),
        ...(chassisKms > 0 && { chassisKms }),
        ...(engineSwapKms && engineSwapKms > 0 && { engineSwapKms }),
        ...(engineKmsAtSwap && engineKmsAtSwap > 0 && { engineKmsAtSwap }),
        ...(lastServiceKms && lastServiceKms > 0 && { lastServiceKms }),
        ...(lastServiceItems && { lastServiceItems }),
      };
}
