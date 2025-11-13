
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
import { getStandardServiceIntervals } from '@/ai/tools/service-data-tool';

const DynamicServiceIntervalsInputSchema = z.object({
  year: z.string().describe('The year of the vehicle.'),
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
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
  1.  **Get Baseline**: Use the 'getStandardServiceIntervals' tool to fetch the manufacturer-recommended service intervals for the specified vehicle.
  2.  **Adjust for Mods & Habits**: Review the vehicle's modifications and driving habits. For any high-stress modifications (turbo, supercharger, stage 2+) or aggressive driving habits ('Regular Track/Race Use'), significantly reduce the service intervals for related components (e.g., Engine Oil, Spark Plugs, Transmission Fluid). For example, a turbo car driven hard might need oil changes every 5,000 km instead of 10,000 km.
  3.  **Provide Reasoning**: For each adjustment you make, provide a clear and concise reason in the 'reason' field. If no adjustment is needed, state that it's the standard recommended interval.

  Vehicle Information:
  - Year: {{{year}}}, Make: {{{make}}}, Model: {{{model}}}
  - Driving Habits: {{{drivingHabits}}}
  {{#if modifications}}
  - Modifications: {{#if modifications.stage}}Stage {{{modifications.stage}}}{{/if}}, {{#if modifications.turbo}}{{{modifications.turbo}}}{{/if}}{{#if modifications.supercharger}}{{{modifications.supercharger}}}{{/if}}{{#if modifications.engineSwap}}Swapped to {{{modifications.engineSwap}}}{{/if}}
  {{/if}}

  Produce a valid JSON output for the 'serviceSchedule'. Do NOT determine if the service is due. Only return the adjusted intervals.
  `,
});

const dynamicServiceIntervalsFlow = ai.defineFlow(
  {
    name: 'dynamicServiceIntervalsFlow',
    inputSchema: DynamicServiceIntervalsInputSchema,
    outputSchema: DynamicServiceIntervalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
