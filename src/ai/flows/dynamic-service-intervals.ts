
'use server';

/**
 * @fileOverview Dynamically adjusts service intervals based on vehicle modifications and driving habits.
 *
 * - `getDynamicServiceIntervals` - A function that generates a dynamic service schedule.
 * - `DynamicServiceIntervalsInput` - The input type for the `getDynamicServiceIntervals` function.
 * - `DynamicServiceIntervalsOutput` - The return type for the `getDynamicServiceIntervals` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { getStandardServiceIntervals } from '@/ai/tools/service-data-tool';

const DynamicServiceIntervalsInputSchema = z.object({
  year: z.string().describe('The year of the vehicle.'),
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  kms: z.number().describe('The current kilometers of the vehicle chassis.'),
  modifications: z
    .object({
      turbo: z.string().optional().describe('The type of turbo installed, if any.'),
      supercharger: z
        .string()
        .optional()
        .describe('The type of supercharger kit installed, if any.'),
      engineSwap: z
        .string()
        .optional()
        .describe('The engine that was swapped in, if any.'),
      stage: z.string().optional().describe('The stage of modification (1, 2, or 3).'),
    })
    .optional()
    .describe('Modifications made to the vehicle.'),
  drivingHabits: z
    .string()
    .describe(
      'Description of the ariving habits, e.g., daily driving, track days, driven hard.'
    ),
  engineKms: z.number().optional().describe('The current kilometers on the engine. This is only different from chassis KMs if the engine has been swapped.'),
  chassisKms: z.number().optional().describe('The current kilometers on the chassis.'),
  hasSwappedEngine: z.boolean().optional().describe('True if the engine has been swapped or is not original.'),
  engineSwapKms: z.number().optional().describe('Chassis KMs when the engine was swapped.'),
  engineKmsAtSwap: z.number().optional().describe('KMs on the new engine at the time of the swap.'),
  lastServiceKms: z.number().optional().describe('The kilometers at the time of the last service.'),
  lastServiceItems: z.string().optional().describe('A comma-separated list of items that were serviced last time (e.g., Oil Change, Spark Plugs).'),
});

export type DynamicServiceIntervalsInput = z.infer<
  typeof DynamicServiceIntervalsInputSchema
>;

const DynamicServiceIntervalsOutputSchema = z.object({
  serviceSchedule: z.array(
    z.object({
      item: z.string().describe('The service item.'),
      intervalKms: z.number().describe('The recommended interval in kilometers.'),
      intervalMonths: z.number().describe('The recommended interval in months.'),
      reason: z.string().describe('The reasoning behind the adjusted interval.'),
      isDue: z.boolean().describe('Whether this service item is currently due based on the last service history provided. If no last service history is provided, this should be based on standard intervals from current KMs.'),
    })
  ),
});

export type DynamicServiceIntervalsOutput = z.infer<
  typeof DynamicServiceIntervalsOutputSchema
>;

export async function getDynamicServiceIntervals(
  input: DynamicServiceIntervalsInput
): Promise<DynamicServiceIntervalsOutput> {
  return dynamicServiceIntervalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicServiceIntervalsPrompt',
  input: {schema: DynamicServiceIntervalsInputSchema},
  output: {schema: DynamicServiceIntervalsOutputSchema},
  tools: [getStandardServiceIntervals],
  prompt: `You are an expert mechanic who provides dynamic service intervals based on vehicle information, modifications, and driving habits.

  You MUST use the 'getStandardServiceIntervals' tool to fetch the baseline manufacturer-recommended service intervals for the given vehicle. Once you have the standard intervals, you will then adjust them based on the provided modifications and driving habits. Do this for all common service items.

  Vehicle Information:
  - Year: {{{year}}}
  - Make: {{{make}}}
  - Model: {{{model}}}
  - Chassis Kilometers: {{{kms}}}
  - Engine Swapped: {{{hasSwappedEngine}}}
  {{#if hasSwappedEngine}}
  - Current Engine KMS: {{{engineKms}}}
  {{/if}}
  
  {{#if modifications}}
  Modifications:
  {{#if modifications.turbo}}
  - Turbo: {{{modifications.turbo}}}
  {{/if}}
  {{#if modifications.supercharger}}
  - Supercharger: {{{modifications.supercharger}}}
  {{/if}}
  {{#if modifications.engineSwap}}
  - Engine Swap: {{{modifications.engineSwap}}}
  {{/if}}
  {{#if modifications.stage}}
  - Stage: {{{modifications.stage}}}
  {{/if}}
  {{/if}}

  - Driving Habits: {{{drivingHabits}}}

  {{#if engineSwapKms}}
  Engine Swap Details:
  - Chassis KMs at Swap: {{{engineSwapKms}}}
  - Engine KMs at Swap: {{{engineKmsAtSwap}}}
  - When an engine swap has occurred, you MUST assume a full major service (including all fluids, spark plugs, and belts) was completed on the replacement engine at the time of the swap. This means the effective service life for engine-specific components starts from this point.
  {{/if}}
  
  {{#if lastServiceKms}}
  Last Service Details:
  - Kilometers at last service: {{{lastServiceKms}}}
  - Items serviced: {{{lastServiceItems}}}
  {{/if}}

  Based on ALL this information, provide a service schedule. For each item, you MUST determine if the service is currently due.
  
  Here is the logic for determining if an item is due. Follow it strictly:
  1.  **Identify Component Type**: Determine if the service item is related to the 'engine' or the 'chassis'.
      *   Engine items: Engine Oil & Filter, Spark Plugs, Air Filter, Coolant, Transmission Fluid, Differential Fluid, Timing Belt.
      *   Chassis items: Tire Rotation, Brake Fluid, Cabin Air Filter.
  2.  **Determine Current Mileage for Calculation**:
      *   If the item is an 'engine' item AND the engine has been swapped (\`hasSwappedEngine\` is true), use the current \`engineKms\`.
      *   Otherwise (for all chassis items, and for engine items on an original engine), use the current chassis \`kms\`.
  3.  **Determine Last Service Mileage for the Item**:
      *   If the item's name is in \`lastServiceItems\`, the last service mileage is \`lastServiceKms\`. Use this value regardless of component type. This is the most recent service record.
      *   If the item was NOT in \`lastServiceItems\` BUT it is an 'engine' item and a swap occurred with \`engineSwapKms\` data, its last service point is effectively the \`engineKmsAtSwap\`.
      *   If neither of the above apply, assume the item has never been serviced (last service is 0 km).
  4.  **Calculate Mileage Since Last Service**:
      *   \`kmsSinceService\` = ('Current Mileage for Calculation' from Step 2) - ('Last Service Mileage for the Item' from Step 3).
  5.  **Check if Due**:
      *   \`isDue\` is **true** if \`kmsSinceService\` is greater than or equal to the item's recommended \`intervalKms\`.
      *   \`isDue\` is **false** otherwise.

  Set the 'isDue' flag to true if the service is due, and false otherwise. Explain the reasoning behind each adjustment.

  Format the output as a JSON object with a "serviceSchedule" array.
  `,
});

const dynamicServiceIntervalsFlow = ai.defineFlow(
  {
    name: 'dynamicServiceIntervalsFlow',
    inputSchema: DynamicServiceIntervalsInputSchema,
    outputSchema: DynamicServiceIntervalsOutputSchema,
  },
  async input => {
    // If engine is not swapped, ensure AI knows engineKms is same as chassisKms.
    if (!input.hasSwappedEngine) {
      input.engineKms = input.kms;
    }
    const {output} = await prompt(input);
    return output!;
  }
);
