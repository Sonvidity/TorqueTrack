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

const DynamicServiceIntervalsInputSchema = z.object({
  year: z.string().describe('The year of the vehicle.'),
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  kms: z.number().describe('The current kilometers of the vehicle.'),
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
      'Description of the driving habits, e.g., daily driving, track days, driven hard.'
    ),
  engineKms: z.number().optional().describe('The kilometers on the engine, if different from chassis.'),
  chassisKms: z.number().optional().describe('The kilometers on the chassis.'),
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
  prompt: `You are an expert mechanic who provides dynamic service intervals based on vehicle information, modifications, and driving habits.

  Vehicle Information:
  - Year: {{{year}}}
  - Make: {{{make}}}
  - Model: {{{model}}}
  - Kilometers: {{{kms}}}
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
  {{#if engineKms}}
  - Engine KMS: {{{engineKms}}}
  {{/if}}
  {{#if chassisKms}}
  - Chassis KMS: {{{chassisKms}}}
  {{/if}}
  {{#if lastServiceKms}}
  Last Service Details:
  - Kilometers at last service: {{{lastServiceKms}}}
  - Items serviced: {{{lastServiceItems}}}
  {{/if}}

  Based on this information, provide a service schedule with adjusted intervals. 
  For each item, you MUST determine if the service is currently due by comparing the recommended interval against the current vehicle kilometers and the last service details if provided. Set the 'isDue' flag to true if the service is due, and false otherwise.
  Explain the reasoning behind each adjustment.

  Format the output as a JSON object with a "serviceSchedule" array. Each object in the array should have the following keys:
  - "item": The service item (e.g., oil change, spark plug replacement).
  - "intervalKms": The recommended interval in kilometers.
  - "intervalMonths": The recommended interval in months.
  - "reason": The reasoning behind the adjusted interval.
  - "isDue": A boolean indicating if the service is due now.
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
