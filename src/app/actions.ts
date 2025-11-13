
"use server";

import { getDynamicServiceIntervals, type DynamicServiceIntervalsInput, type DynamicServiceIntervalsOutput } from "@/ai/flows/dynamic-service-intervals";
import { getStandardServiceIntervals } from "@/ai/tools/service-data-tool";
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
      error: "Invalid form data. Please check the fields for errors.",
      issues: validatedFields.error.issues,
    };
  }

  // Pre-flight validation
  if (validatedFields.data.lastServiceKms && validatedFields.data.lastServiceKms > validatedFields.data.chassisKms) {
    return {
      success: false,
      error: "Validation Error: KMs at last service cannot be greater than current chassis KMs."
    }
  }

  if (validatedFields.data.hasSwappedEngine && validatedFields.data.engineSwapKms && validatedFields.data.engineSwapKms > validatedFields.data.chassisKms) {
    return {
        success: false,
        error: "Validation Error: Chassis KMs at engine swap cannot be greater than current chassis KMs."
    }
  }
  
  // Step 1: Get the baseline service intervals first.
  const standardIntervals = await getStandardServiceIntervals({
    make: validatedFields.data.make,
    model: validatedFields.data.model,
  });

  const aiInput = mapFormToAIInput(validatedFields.data, standardIntervals.intervals);

  try {
    const result = await getDynamicServiceIntervals(aiInput);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in getServiceScheduleAction:", error);
    // Provide more specific feedback if the AI fails
    const errorMessage = error.message?.includes('SAFETY') 
      ? "The AI model refused to generate a schedule due to safety concerns with the provided inputs. Please adjust and try again."
      : "I'm still getting constant errors when inputting my cars details. Why? What is occurring?";
    
    return { 
      success: false, 
      error: errorMessage
    };
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


function mapFormToAIInput(data: FormValues, standardIntervals: any[]): DynamicServiceIntervalsInput {
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
        standardIntervals,
      };
}
