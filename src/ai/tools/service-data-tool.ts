'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Simplified database of standard service intervals
const serviceIntervalData = {
  default: [
    { item: 'Engine Oil & Filter', intervalKms: 10000, intervalMonths: 6 },
    { item: 'Tire Rotation', intervalKms: 10000, intervalMonths: 6 },
    { item: 'Brake Fluid', intervalKms: 40000, intervalMonths: 24 },
    { item: 'Air Filter', intervalKms: 30000, intervalMonths: 24 },
    { item: 'Cabin Air Filter', intervalKms: 30000, intervalMonths: 24 },
    { item: 'Spark Plugs (Iridium/Platinum)', intervalKms: 100000, intervalMonths: 72 },
    { item: 'Coolant', intervalKms: 100000, intervalMonths: 60 },
    { item: 'Transmission Fluid (Automatic)', intervalKms: 80000, intervalMonths: 48 },
    { item: 'Transmission Fluid (Manual)', intervalKms: 60000, intervalMonths: 36 },
    { item: 'Differential Fluid', intervalKms: 60000, intervalMonths: 36 },
    { item: 'Timing Belt', intervalKms: 100000, intervalMonths: 72 },
  ],
  'Toyota-86 / BRZ (ZN6)': [
    { item: 'Engine Oil & Filter', intervalKms: 10000, intervalMonths: 6 },
    { item: 'Spark Plugs (Iridium/Platinum)', intervalKms: 90000, intervalMonths: 60 },
  ],
  'Nissan-350Z (Z33)': [
    { item: 'Spark Plugs (Iridium/Platinum)', intervalKms: 120000, intervalMonths: 84 },
    { item: 'Differential Fluid', intervalKms: 40000, intervalMonths: 24 },
  ],
  'Ford-Falcon (FG)': [
    { item: 'Engine Oil & Filter', intervalKms: 15000, intervalMonths: 12 },
    { item: 'Transmission Fluid (Automatic)', intervalKms: 150000, intervalMonths: 120 },
  ]
};

const GetStandardServiceIntervalsInputSchema = z.object({
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
});

const GetStandardServiceIntervalsOutputSchema = z.object({
  intervals: z.array(
    z.object({
      item: z.string(),
      intervalKms: z.number(),
      intervalMonths: z.number(),
    })
  ),
});

export const getStandardServiceIntervals = ai.defineTool(
  {
    name: 'getStandardServiceIntervals',
    description: 'Returns the standard manufacturer service intervals for a given vehicle. This should be the first step before making any adjustments.',
    inputSchema: GetStandardServiceIntervalsInputSchema,
    outputSchema: GetStandardServiceIntervalsOutputSchema,
  },
  async (input) => {
    const key = `${input.make}-${input.model}`;
    const vehicleSpecificIntervals = (serviceIntervalData as any)[key] || [];
    const defaultIntervals = serviceIntervalData.default;

    // Merge vehicle-specific intervals with defaults, overwriting defaults if specific ones exist.
    const finalIntervals = [...defaultIntervals];
    vehicleSpecificIntervals.forEach((specific: any) => {
      const existingIndex = finalIntervals.findIndex(d => d.item === specific.item);
      if (existingIndex > -1) {
        finalIntervals[existingIndex] = specific;
      } else {
        finalIntervals.push(specific);
      }
    });

    return { intervals: finalIntervals };
  }
);
