
"use server";

import { getStandardServiceIntervals } from "@/lib/service-data";
import { z } from "zod";
import { formSchema, type FormValues } from "@/lib/schema";
import { saveVehicle as saveVehicleToDb } from "@/firebase/firestore/mutations";
import { nanoid } from "nanoid";
import { getRuleBasedServiceIntervals, type RuleBasedIntervalsInput } from "@/lib/rule-based-intervals";

export type ActionResponse = {
  success: boolean;
  data?: { serviceSchedule: any[] };
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
  
  try {
    // Step 1: Get the baseline service intervals first.
    const standardIntervals = getStandardServiceIntervals({
      make: validatedFields.data.make,
      model: validatedFields.data.model,
    });

    const ruleInput = mapFormToRuleInput(validatedFields.data, standardIntervals.intervals);

    // Step 2: Get the adjusted schedule from the new rule-based engine.
    const result = getRuleBasedServiceIntervals(ruleInput);
    
    return { success: true, data: { serviceSchedule: result } };

  } catch (error: any) {
    console.error("Error in getServiceScheduleAction:", error);
    
    const finalErrorMessage = `An unexpected error occurred: ${error.message || 'Please check the server logs.'}`;
    
    return { 
      success: false, 
      error: finalErrorMessage
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


function mapFormToRuleInput(data: FormValues, standardIntervals: any[]): RuleBasedIntervalsInput {
    const {
        drivingHabits,
        stage,
        forcedInduction,
      } = data;

      return {
        drivingHabits,
        modifications: {
            stage,
            forcedInduction,
        },
        standardIntervals,
      };
}
