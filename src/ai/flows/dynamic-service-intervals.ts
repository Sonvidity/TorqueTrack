
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

  Your task is to generate a service schedule by following these steps:
  1.  **Get Baseline**: Use the 'getStandardServiceIntervals' tool to fetch the manufacturer-recommended service intervals.
  2.  **Adjust for Mods & Habits**: Review the vehicle's modifications and driving habits. For any high-stress modifications (turbo, supercharger, stage 2+) or aggressive driving habits ('Regular Track/Race Use'), significantly reduce the service intervals for related components (e.g., Engine Oil, Spark Plugs, Transmission Fluid). For example, a turbo car driven hard might need oil changes every 5,000 km instead of 10,000 km. Provide a clear reason for each adjustment.
  3.  **Determine if Service is Due**: For each service item, you MUST determine if it is currently due. Use the following hierarchy to decide:

      *   **Rule 1: Check Recent Service History (\`lastServiceItems\`)**
          *   If a service item (e.g., "Spark Plugs") is present in the \`lastServiceItems\` string, then its last service was performed at \`lastServiceKms\`.
          *   Calculate if it's due based on the KMs elapsed since \`lastServiceKms\`. For engine parts, use \`engineKms\`; for chassis parts, use \`chassisKms\`.
          *   *Example*: If current \`engineKms\` is 120,000, "Spark Plugs" were in \`lastServiceItems\`, and \`lastServiceKms\` was 110,000 (chassis KM), the relevant engine KM at last service was ~110,000. So, 10,000 km have passed. If the interval is 60,000 km, it is NOT due.

      *   **Rule 2: Check for Engine Swap (\`hasSwappedEngine\`)**
          *   If an **engine-related item** was NOT in \`lastServiceItems\`, and the engine has been swapped, assume a full service was done on the new engine when it was installed.
          *   The "last service point" for that item is the mileage of the engine at the time of the swap (\`engineKmsAtSwap\`).
          *   Calculate if it's due based on the KMs the engine has run since the swap (\`engineKms\` - \`engineKmsAtSwap\`).
          *   *Example*: If \`engineKms\` is 120,000, \`engineKmsAtSwap\` was 60,000, and spark plugs weren't in the recent service, they have run for 60,000 km. If the interval is 60,000 km, they are DUE.
          *   This rule applies ONLY to engine components: Engine Oil & Filter, Spark Plugs, Air Filter, Coolant, Transmission Fluid, Differential Fluid, Timing Belt.

      *   **Rule 3: Default (No History)**
          *   If neither of the above rules applies, assume the item has never been serviced. Calculate if it's due based on the component's total mileage (\`engineKms\` for engine parts, \`chassisKms\` for chassis parts).

  Vehicle Information:
  - Year: {{{year}}}, Make: {{{make}}}, Model: {{{model}}}
  - Chassis KMs: {{{kms}}}
  - Engine Swapped: {{#if hasSwappedEngine}}Yes{{else}}No{{/if}}
  {{#if hasSwappedEngine}}
  - Current Engine KMs: {{{engineKms}}}
  - Chassis KMs at Swap: {{{engineSwapKms}}}
  - Engine KMs at Swap: {{{engineKmsAtSwap}}}
  {{/if}}
  - Driving Habits: {{{drivingHabits}}}
  {{#if modifications}}
  - Modifications: {{#if modifications.stage}}Stage {{{modifications.stage}}}{{/if}}, {{#if modifications.turbo}}{{{modifications.turbo}}}{{/if}}{{#if modifications.supercharger}}{{{modifications.supercharger}}}{{/if}}{{#if modifications.engineSwap}}Swapped to {{{modifications.engineSwap}}}{{/if}}
  {{/if}}
  {{#if lastServiceKms}}
  - Last Service History: At {{{lastServiceKms}}} km, the following items were serviced: {{{lastServiceItems}}}.
  {{/if}}

  Produce a valid JSON output for the 'serviceSchedule'.
  `,
});

const dynamicServiceIntervalsFlow = ai.defineFlow(
  {
    name: 'dynamicServiceIntervalsFlow',
    inputSchema: DynamicServiceIntervalsInputSchema,
    outputSchema: DynamicServiceIntervalsOutputSchema,
  },
  async input => {
    // This calculation is now done in the action, but we ensure it's present.
    if (input.hasSwappedEngine && input.engineSwapKms && input.engineKmsAtSwap) {
        input.engineKms = (input.kms - input.engineSwapKms) + input.engineKmsAtSwap;
    } else {
      input.engineKms = input.kms;
    }

    const {output} = await prompt(input);
    return output!;
  }
);
