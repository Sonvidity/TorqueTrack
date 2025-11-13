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
      { name: "Accord (CF/CL)", years: Array.from({ length: 2002 - 1997 + 1 }, (_, i) => 1997 + i), engine: "F-series / H-series" },
      { name: "Accord (CL)", years: Array.from({ length: 2008 - 2002 + 1 }, (_, i) => 2002 + i), engine: "K24A" },
      { name: "Accord (CU)", years: Array.from({ length: 2015 - 2008 + 1 }, (_, i) => 2008 + i), engine: "K24Z" },
      { name: "Accord (CR)", years: Array.from({ length: 2017 - 2013 + 1 }, (_, i) => 2013 + i), engine: "K24W" },
      { name: "Accord (CV)", years: Array.from({ length: 2022 - 2018 + 1 }, (_, i) => 2018 + i), engine: "L15B7 / K20C4" },
      { name: "Civic (EP)", years: Array.from({ length: 2005 - 2001 + 1 }, (_, i) => 2001 + i), engine: "D17 / K20A" },
      { name: "Civic (FD/FN)", years: Array.from({ length: 2011 - 2006 + 1 }, (_, i) => 2006 + i), engine: "R18A / K20Z" },
      { name: "Civic (FB/FG)", years: Array.from({ length: 2015 - 2012 + 1 }, (_, i) => 2012 + i), engine: "R18Z / K24Z" },
      { name: "Civic (FC/FK)", years: Array.from({ length: 2021 - 2016 + 1 }, (_, i) => 2016 + i), engine: "L15B7 / K20C" },
      { name: "Civic (FE/FL)", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), engine: "L15C / K20C" },
      { name: "CR-V (RD)", years: Array.from({ length: 2001 - 1997 + 1 }, (_,i) => 1997 + i), engine: "B20B" },
      { name: "CR-V (RD)", years: Array.from({ length: 2006 - 2002 + 1 }, (_,i) => 2002 + i), engine: "K24A1" },
      { name: "CR-V (RE)", years: Array.from({ length: 2011 - 2007 + 1 }, (_,i) => 2007 + i), engine: "R20A / K24Z" },
      { name: "CR-V (RM)", years: Array.from({ length: 2016 - 2012 + 1 }, (_,i) => 2012 + i), engine: "R20A / K24Z" },
      { name: "CR-V (RW)", years: Array.from({ length: 2022 - 2017 + 1 }, (_,i) => 2017 + i), engine: "L15B7" },
      { name: "HR-V (GH)", years: Array.from({ length: 2006 - 1999 + 1 }, (_,i) => 1999 + i), engine: "D16W" },
      { name: "HR-V (RU)", years: Array.from({ length: 2021 - 2015 + 1 }, (_,i) => 2015 + i), engine: "L15B / R18Z" },
      { name: "Integra (DC5)", years: Array.from({ length: 2006 - 2001 + 1 }, (_, i) => 2001 + i), engine: "K20A" },
      { name: "S2000 (AP)", years: Array.from({ length: 2009 - 1999 + 1 }, (_, i) => 1999 + i), engine: "F20C / F22C" },
    ],
  },
  {
    make: "Toyota",
    models: [
      { name: "86 / BRZ (ZN6)", years: Array.from({ length: 2021 - 2012 + 1 }, (_, i) => 2012 + i), engine: "FA20" },
      { name: "GR86 / BRZ (ZN8)", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), engine: "FA24" },
      { name: "Supra (A90)", years: Array.from({ length: 2025 - 2019 + 1 }, (_, i) => 2019 + i), engine: "B58" },
      { name: "Corolla (E120/E130)", years: Array.from({ length: 2008 - 2002 + 1 }, (_, i) => 2002 + i), engine: "1ZZ-FE / 2ZZ-GE" },
      { name: "Corolla (E140/E150)", years: Array.from({ length: 2013 - 2007 + 1 }, (_, i) => 2007 + i), engine: "2ZR-FE" },
      { name: "Corolla (E160/E170)", years: Array.from({ length: 2019 - 2013 + 1 }, (_, i) => 2013 + i), engine: "2ZR-FE" },
      { name: "GR Yaris", years: Array.from({ length: 2025 - 2020 + 1 }, (_, i) => 2020 + i), engine: "G16E-GTS" },
      { name: "GR Corolla", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), engine: "G16E-GTS" },
      { name: "Hilux", years: Array.from({ length: 2025 - 2005 + 1 }, (_, i) => 2005 + i), engine: "1KD-FTV / 1GD-FTV / 1GR-FE" },
    ],
  },
  {
    make: "Nissan",
    models: [
      { name: "350Z (Z33)", years: Array.from({ length: 2008 - 2002 + 1 }, (_, i) => 2002 + i), engine: "VQ35DE / VQ35HR" },
      { name: "370Z (Z34)", years: Array.from({ length: 2020 - 2009 + 1 }, (_, i) => 2009 + i), engine: "VQ37VHR" },
      { name: "Z (RZ34)", years: Array.from({ length: 2025 - 2023 + 1 }, (_, i) => 2023 + i), engine: "VR30DDTT" },
      { name: "GT-R (R35)", years: Array.from({ length: 2025 - 2009 + 1 }, (_, i) => 2009 + i), engine: "VR38DETT" },
      { name: "Silvia (S15)", years: Array.from({ length: 2002 - 1999 + 1 }, (_, i) => 1999 + i), engine: "SR20DE / SR20DET" },
      { name: "Skyline (V35)", years: Array.from({ length: 2007 - 2001 + 1 }, (_, i) => 2001 + i), engine: "VQ25/30/35" },
      { name: "Skyline (V36)", years: Array.from({ length: 2014 - 2006 + 1 }, (_, i) => 2006 + i), engine: "VQ25/35/37" },
      { name: "Navara (D40)", years: Array.from({ length: 2015 - 2005 + 1 }, (_, i) => 2005 + i), engine: "YD25 / VQ40" },
      { name: "Navara (D23)", years: Array.from({ length: 2025 - 2015 + 1 }, (_, i) => 2015 + i), engine: "YS23" },
    ],
  },
  {
    make: "Subaru",
    models: [
      { name: "BRZ (ZC6)", years: Array.from({ length: 2021 - 2012 + 1 }, (_, i) => 2012 + i), engine: "FA20" },
      { name: "BRZ (ZD8)", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), engine: "FA24" },
      { name: "Impreza WRX (GDA/GGA)", years: Array.from({ length: 2007 - 2000 + 1 }, (_, i) => 2000 + i), engine: "EJ205 / EJ255" },
      { name: "Impreza WRX STI (GDB)", years: Array.from({ length: 2007 - 2000 + 1 }, (_, i) => 2000 + i), engine: "EJ207 / EJ257" },
      { name: "WRX (GE/GH/GR/GV)", years: Array.from({ length: 2014 - 2008 + 1 }, (_, i) => 2008 + i), engine: "EJ255" },
      { name: "WRX STI (GR/GV)", years: Array.from({ length: 2014 - 2008 + 1 }, (_, i) => 2008 + i), engine: "EJ257" },
      { name: "WRX (VA)", years: Array.from({ length: 2021 - 2015 + 1 }, (_, i) => 2015 + i), engine: "FA20F" },
      { name: "WRX STI (VA)", years: Array.from({ length: 2021 - 2015 + 1 }, (_, i) => 2015 + i), engine: "EJ257" },
      { name: "WRX (VB)", years: Array.from({ length: 2025 - 2022 + 1 }, (_, i) => 2022 + i), engine: "FA24F" },
      { name: "Forester (SG)", years: Array.from({ length: 2008 - 2002 + 1 }, (_, i) => 2002 + i), engine: "EJ25" },
      { name: "Forester (SH)", years: Array.from({ length: 2013 - 2009 + 1 }, (_, i) => 2009 + i), engine: "EJ25" },
    ],
  },
  {
    make: "Mazda",
    models: [
      { name: "MX-5 (NB)", years: Array.from({ length: 2005 - 1998 + 1 }, (_, i) => 1998 + i), engine: "BP-4W / BP-Z3" },
      { name: "MX-5 (NC)", years: Array.from({ length: 2015 - 2005 + 1 }, (_, i) => 2005 + i), engine: "MZR" },
      { name: "MX-5 (ND)", years: Array.from({ length: 2025 - 2016 + 1 }, (_, i) => 2016 + i), engine: "P5-VP / PE-VPR" },
      { name: "RX-7 (FD)", years: Array.from({ length: 2002 - 1992 + 1 }, (_, i) => 1992 + i), engine: "13B-REW" },
      { name: "RX-8 (SE3P)", years: Array.from({ length: 2012 - 2003 + 1 }, (_, i) => 2003 + i), engine: "13B-MSP" },
      { name: "Mazda3 (BK)", years: Array.from({ length: 2009 - 2003 + 1 }, (_, i) => 2003 + i), engine: "MZR / L3-VDT (MPS)" },
      { name: "Mazda3 (BL)", years: Array.from({ length: 2013 - 2009 + 1 }, (_, i) => 2009 + i), engine: "MZR / L3-VDT (MPS)" },
      { name: "BT-50", years: Array.from({ length: 2025 - 2006 + 1 }, (_, i) => 2006 + i), engine: "Ford/Mazda Diesel / Isuzu Diesel" },
    ],
  },
  {
    make: "Mitsubishi",
    models: [
        { name: "Lancer Evolution (VII)", years: [2001, 2002], engine: "4G63T" },
        { name: "Lancer Evolution (VIII)", years: [2003, 2004, 2005], engine: "4G63T" },
        { name: "Lancer Evolution (IX)", years: [2005, 2006, 2007], engine: "4G63T (MIVEC)" },
        { name: "Lancer Evolution (X)", years: Array.from({ length: 2016 - 2008 + 1 }, (_, i) => 2008 + i), engine: "4B11T" },
        { name: "Pajero (NM/NP)", years: Array.from({ length: 2006 - 2000 + 1 }, (_,i) => 2000 + i), engine: "6G74 / 4M41" },
        { name: "Pajero (NS/NT)", years: Array.from({ length: 2011 - 2006 + 1 }, (_,i) => 2006 + i), engine: "6G75 / 4M41" },
        { name: "Triton", years: Array.from({ length: 2025 - 2006 + 1 }, (_, i) => 2006 + i), engine: "4D56 / 4M41 / 4N15" },
    ],
  },
  {
    make: "Ford",
    models: [
        { name: "Falcon (AU)", years: Array.from({ length: 2002 - 1998 + 1 }, (_, i) => 1998 + i), engine: "Intech VCT" },
        { name: "Falcon (BA)", years: [2002, 2003, 2004, 2005], engine: "Barra 182/240T" },
        { name: "Falcon (BF)", years: [2005, 2006, 2007, 2008], engine: "Barra 190/245T" },
        { name: "Falcon (FG)", years: [2008, 2009, 2010, 2011, 2012, 2013, 2014], engine: "Barra 195/270T / Coyote V8" },
        { name: "Falcon (FG X)", years: [2014, 2015, 2016], engine: "Barra 195/270T / Coyote V8" },
        { name: "Mustang (SN95)", years: Array.from({ length: 2004 - 1995 + 1 }, (_, i) => 1995 + i), engine: "Windsor V8 / Modular V8" },
        { name: "Mustang (S197)", years: Array.from({ length: 2014 - 2005 + 1 }, (_, i) => 2005 + i), engine: "Modular V8 / Coyote V8" },
        { name: "Mustang (S550)", years: Array.from({ length: 2023 - 2015 + 1 }, (_, i) => 2015 + i), engine: "2.3L EcoBoost / 5.0L Coyote V8" },
        { name: "Mustang (S650)", years: Array.from({ length: 2025 - 2024 + 1 }, (_, i) => 2024 + i), engine: "2.3L EcoBoost / 5.0L Coyote V8" },
        { name: "Ranger (T6)", years: Array.from({ length: 2022 - 2011 + 1 }, (_, i) => 2011 + i), engine: "Duratorq / EcoBlue" },
        { name: "Focus (ST/RS)", years: Array.from({ length: 2018 - 2012 + 1 }, (_, i) => 2012 + i), engine: "2.0L EcoBoost / 2.3L EcoBoost" },
    ],
  },
  {
    make: "Holden",
    models: [
      { name: "Commodore (VS)", years: Array.from({ length: 1997 - 1995 + 1 }, (_, i) => 1995 + i), engine: "Ecotec V6 / 5.0L V8" },
      { name: "Commodore (VT)", years: Array.from({ length: 2000 - 1997 + 1 }, (_, i) => 1997 + i), engine: "Ecotec V6 / LS1 V8" },
      { name: "Commodore (VX)", years: Array.from({ length: 2002 - 2000 + 1 }, (_, i) => 2000 + i), engine: "Ecotec V6 / LS1 V8" },
      { name: "Commodore (VY)", years: Array.from({ length: 2004 - 2002 + 1 }, (_, i) => 2002 + i), engine: "Ecotec V6 / Alloytec V6 / LS1 V8" },
      { name: "Commodore (VZ)", years: Array.from({ length: 2007 - 2004 + 1 }, (_, i) => 2004 + i), engine: "Alloytec V6 / LS1 V8 / L76 V8" },
      { name: "Commodore (VE)", years: Array.from({ length: 2013 - 2006 + 1 }, (_, i) => 2006 + i), engine: "Alloytec/SIDI V6 / L76/L98/LS2/LS3 V8" },
      { name: "Commodore (VF)", years: Array.from({ length: 2017 - 2013 + 1 }, (_, i) => 2013 + i), engine: "SIDI V6 / L77/LS3 V8" },
      { name: "Monaro", years: Array.from({ length: 2006 - 2001 + 1 }, (_, i) => 2001 + i), engine: "LS1 V8" },
      { name: "Colorado", years: Array.from({ length: 2020 - 2008 + 1 }, (_, i) => 2008 + i), engine: "Isuzu 4JJ1 / Duramax" },
    ],
  },
  {
    make: "Volkswagen",
    models: [
      { name: "Golf GTI (MK5)", years: Array.from({ length: 2008 - 2004 + 1 }, (_, i) => 2004 + i), engine: "EA113" },
      { name: "Golf GTI (MK6)", years: Array.from({ length: 2012 - 2009 + 1 }, (_, i) => 2009 + i), engine: "EA888 Gen1/2" },
      { name: "Golf GTI (MK7)", years: Array.from({ length: 2020 - 2013 + 1 }, (_, i) => 2013 + i), engine: "EA888 Gen3" },
      { name: "Golf R (MK6)", years: Array.from({ length: 2012 - 2009 + 1 }, (_, i) => 2009 + i), engine: "EA113" },
      { name: "Golf R (MK7)", years: Array.from({ length: 2020 - 2013 + 1 }, (_, i) => 2013 + i), engine: "EA888 Gen3" },
    ],
  },
  {
    make: "Mercedes-Benz",
    models: [
      { name: "ML500 (W164)", years: Array.from({ length: 2011 - 2005 + 1 }, (_,i) => 2005 + i), engine: "M113 V8 / M273 V8"},
      { name: "ML500 (W166)", years: Array.from({ length: 2015 - 2012 + 1 }, (_,i) => 2012 + i), engine: "M278 V8 Bi-Turbo"},
    ]
  }
];

export const commonEngineSwaps = [
    { name: 'Subaru FA24', value: 'FA24' },
    { name: 'GM LS1 V8', value: 'LS1' },
    { name: 'GM LS2 V8', value: 'LS2' },
    { name: "GM LSA V8 (Supercharged)", value: "LSA"},
    { name: 'GM LS3 V8', value: 'LS3' },
    { name: 'Honda K20', value: 'K20' },
    { name: 'Honda K24', value: 'K24' },
    { name: 'Toyota 1JZ', value: '1JZ' },
    { name: 'Toyota 2JZ', value: '2JZ' },
    { name: 'Nissan RB25', value: 'RB25' },
    { name: 'Nissan RB26', value: 'RB26' },
    { name: 'Ford Barra', value: 'Barra' },
    { name: 'Other / Custom', value: 'custom' },
];
