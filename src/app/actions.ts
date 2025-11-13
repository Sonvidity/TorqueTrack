"use server";

import { getDynamicServiceIntervals, type DynamicServiceIntervalsInput, type DynamicServiceIntervalsOutput } from "@/ai/flows/dynamic-service-intervals";
import { z } from "zod";
import { formSchema, type FormValues } from "@/lib/schema";
import { saveVehicle as saveVehicleToDb } from "@/firebase/firestore/mutations";
import { auth } from 'firebase-admin';
import { getTokens } from 'next-firebase-auth-edge/lib/next/tokens';
import { cookies } from 'next/headers';
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

export async function saveVehicleAction(values: FormValues): Promise<{success: boolean; error?: string, vehicleId?: string}> {
    const validatedFields = formSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid form data." };
    }

    const tokens = await getTokens(cookies(), {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
        cookieName: 'AuthToken',
        cookieSignatureKeys: [process.env.COOKIE_SECRET_CURRENT!, process.env.COOKIE_SECRET_PREVIOUS!],
        serviceAccount: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }
    });

    if (!tokens) {
        return { success: false, error: "User not authenticated." };
    }

    const vehicleData = {
        id: nanoid(),
        ...validatedFields.data,
        userId: tokens.decodedToken.uid,
    }

    try {
        await saveVehicleToDb(tokens.decodedToken.uid, vehicleData.id, vehicleData);
        return { success: true, vehicleId: vehicleData.id };
    } catch (e) {
        console.error('Failed to save vehicle:', e)
        return { success: false, error: "Failed to save vehicle." };
    }
}


function mapFormToAIInput(data: FormValues): DynamicServiceIntervalsInput {
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
        drivingHabits,
        modifications: {
            ...(stage !== 'none' && { stage }),
            ...(forcedInduction === 'turbo' && { turbo: turboType }),
            ...(forcedInduction === 'supercharger' && { supercharger: superchargerKit }),
            ...(engineSwap !== 'stock' && { engineSwap }),
        },
        ...(engineKms > 0 && { engineKms }),
        ...(chassisKms > 0 && { chassisKms }),
        ...(engineSwapKms && engineSwapKms > 0 && { engineSwapKms }),
        ...(engineKmsAtSwap && engineKmsAtSwap > 0 && { engineKmsAtSwap }),
        ...(lastServiceKms && lastServiceKms > 0 && { lastServiceKms }),
        ...(lastServiceItems && { lastServiceItems }),
      };
}
