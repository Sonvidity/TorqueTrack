
type Interval = {
  item: string;
  intervalKms: number;
  intervalMonths: number;
};

type ModelSpecificIntervals = {
  [model: string]: Partial<Record<string, Interval>>;
};

const BASE_INTERVALS: Interval[] = [
  { item: 'Engine Oil & Filter', intervalKms: 10000, intervalMonths: 6 },
  { item: 'Brake Fluid', intervalKms: 40000, intervalMonths: 24 },
  { item: 'Tire Rotation', intervalKms: 10000, intervalMonths: 6 },
  { item: 'Air Filter', intervalKms: 40000, intervalMonths: 24 },
  { item: 'Cabin Air Filter', intervalKms: 40000, intervalMonths: 24 },
  { item: 'Spark Plugs (Iridium/Platinum)', intervalKms: 100000, intervalMonths: 72 },
  { item: 'Coolant', intervalKms: 100000, intervalMonths: 60 },
  { item: 'Transmission Fluid (Automatic)', intervalKms: 80000, intervalMonths: 48 },
  { item: 'Transmission Fluid (Manual)', intervalKms: 60000, intervalMonths: 36 },
  { item: 'Differential Fluid', intervalKms: 60000, intervalMonths: 36 },
  { item: 'Timing Belt', intervalKms: 100000, intervalMonths: 72 },
];

export const SERVICE_ITEMS = BASE_INTERVALS.map(item => item.item);


const MODEL_OVERRIDES: ModelSpecificIntervals = {
  '86 / BRZ (ZN6)': {
    'Engine Oil & Filter': { item: 'Engine Oil & Filter', intervalKms: 8000, intervalMonths: 6 },
    'Spark Plugs (Iridium/Platinum)': { item: 'Spark Plugs (Iridium/Platinum)', intervalKms: 80000, intervalMonths: 60 },
  },
  'Golf R (MK7)': {
    'Engine Oil & Filter': { item: 'Engine Oil & Filter', intervalKms: 10000, intervalMonths: 12 },
    'Transmission Fluid (Automatic)': { item: 'Transmission Fluid (Automatic)', intervalKms: 60000, intervalMonths: 36 }, // DSG Service
  },
  'Commodore (VE)': {
    'Engine Oil & Filter': { item: 'Engine Oil & Filter', intervalKms: 15000, intervalMonths: 12 },
  }
};


type GetStandardServiceIntervalsInput = {
  make: string;
  model: string;
};

export function getStandardServiceIntervals(input: GetStandardServiceIntervalsInput) {
  const { model } = input;
  const modelSpecificIntervals = MODEL_OVERRIDES[model] || {};

  const intervals = BASE_INTERVALS.map(baseItem => {
    return modelSpecificIntervals[baseItem.item] || baseItem;
  });

  return { intervals };
}
