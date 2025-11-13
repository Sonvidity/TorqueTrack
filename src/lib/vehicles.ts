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
        name: "Accord (Euro)",
        years: Array.from({ length: 2008 - 2003 + 1 }, (_, i) => 2003 + i),
        engine: "K24A3",
      },
      {
        name: "Civic (EK)",
        years: Array.from({ length: 2000 - 1996 + 1}, (_, i) => 1996 + i),
        engine: "D-series / B-series"
      },
      {
        name: "Civic (EP)",
        years: Array.from({ length: 2005 - 2001 + 1}, (_, i) => 2001 + i),
        engine: "D-series / K-series"
      },
      {
        name: "Civic (FN/FD)",
        years: Array.from({ length: 2011 - 2006 + 1}, (_, i) => 2006 + i),
        engine: "R18 / K20"
      },
       {
        name: "Civic (FB/FG)",
        years: Array.from({ length: 2015 - 2012 + 1}, (_, i) => 2012 + i),
        engine: "R18 / K24"
      },
      {
        name: "Civic (FK/FC)",
        years: Array.from({ length: 2021 - 2016 + 1}, (_, i) => 2016 + i),
        engine: "L15 / K20C"
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
        years: Array.from({ length: 2021 - 2012 + 1 }, (_, i) => 2012 + i),
        engine: "FA20",
      },
    ],
  },
    {
    make: "Subaru",
    models: [
      {
        name: "BRZ / 86",
        years: Array.from({ length: 2021 - 2012 + 1 }, (_, i) => 2012 + i),
        engine: "FA20",
      },
      {
        name: "Impreza WRX (GC8)",
        years: Array.from({ length: 2000 - 1992 + 1 }, (_, i) => 1992 + i),
        engine: "EJ20",
      },
      {
        name: "Impreza WRX (GDA/GGA)",
        years: Array.from({ length: 2007 - 2000 + 1 }, (_, i) => 2000 + i),
        engine: "EJ20 / EJ25",
      },
      {
        name: "Impreza WRX (GE/GH/GR/GV)",
        years: Array.from({ length: 2014 - 2007 + 1 }, (_, i) => 2007 + i),
        engine: "EJ25",
      },
      {
        name: "WRX (VA)",
        years: Array.from({ length: 2021 - 2014 + 1 }, (_, i) => 2014 + i),
        engine: "FA20DIT",
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
