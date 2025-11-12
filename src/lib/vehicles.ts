export type Vehicle = {
  make: string;
  models: {
    name: string;
    years: number[];
    engine: string;
  }[];
};

export const vehicles: Vehicle[] = [
  {
    make: "Honda",
    models: [
      {
        name: "Accord CL9 Euro",
        years: Array.from({ length: 2008 - 2003 + 1 }, (_, i) => 2003 + i),
        engine: "K24A3",
      },
    ],
  },
  {
    make: "Volkswagen",
    models: [
      {
        name: "Golf R MK7.5",
        years: Array.from({ length: 2020 - 2017 + 1 }, (_, i) => 2017 + i),
        engine: "EA888 Gen 3",
      },
    ],
  },
  {
    make: "Toyota",
    models: [
      {
        name: "86 / BRZ",
        years: Array.from({ length: 2020 - 2012 + 1 }, (_, i) => 2012 + i),
        engine: "FA20",
      },
    ],
  },
    {
    make: "Subaru",
    models: [
      {
        name: "BRZ / 86",
        years: Array.from({ length: 2020 - 2012 + 1 }, (_, i) => 2012 + i),
        engine: "FA20",
      },
    ],
  },
  {
    make: "Holden",
    models: [
      {
        name: "Commodore SV6",
        years: Array.from({ length: 2012 - 2005 + 1 }, (_, i) => 2005 + i),
        engine: "Alloytec/SIDI V6",
      },
    ],
  },
];

export const commonEngineSwaps = [
    { name: 'Subaru FA24', value: 'FA24' },
    { name: 'GM LS1 V8', value: 'LS1' },
    { name: 'GM LS2 V8', value: 'LS2' },
    { name: 'GM LS3 V8', value: 'LS3' },
    { name: 'Honda K20', value: 'K20' },
    { name: 'Honda K24', value: 'K24' },
    { name: 'Toyota 2JZ', value: '2JZ' },
    { name: 'Nissan RB26', value: 'RB26' },
    { name: 'Ford Barra', value: 'Barra' },
    { name: 'Other / Custom', value: 'custom' },
];
