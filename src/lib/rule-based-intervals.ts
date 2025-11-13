
export type RuleBasedIntervalsInput = {
    drivingHabits: string;
    modifications: {
      stage: string;
      forcedInduction: string;
    };
    standardIntervals: {
      item: string;
      intervalKms: number;
      intervalMonths: number;
    }[];
  };
  
  const ENGINE_ITEMS = [
    'Engine Oil & Filter',
    'Spark Plugs (Iridium/Platinum)',
    'Air Filter',
    'Timing Belt',
    'Transmission Fluid (Automatic)',
    'Transmission Fluid (Manual)',
  ];
  
  const WEAR_ITEMS = [
    'Brake Fluid',
    'Tire Rotation',
    'Coolant',
    'Transmission Fluid (Automatic)',
    'Transmission Fluid (Manual)',
    'Differential Fluid',
  ];
  
  // Define adjustment factors
  const MOD_FACTORS = {
    stage: {
      'none': 1.0,
      '1': 0.8, // 20% reduction
      '2': 0.6, // 40% reduction
      '3': 0.4, // 60% reduction
    },
    forcedInduction: {
      'none': 1.0,
      'turbo': 0.5, // 50% reduction
      'supercharger': 0.5, // 50% reduction
    },
  };
  
  const HABIT_FACTORS = {
    'Daily Commuting': 1.0,
    'Spirited Weekend Drives': 0.85, // 15% reduction
    'Regular Track/Race Use': 0.5, // 50% reduction
  };
  
  type ModStage = keyof typeof MOD_FACTORS.stage;
  type ForcedInduction = keyof typeof MOD_FACTORS.forcedInduction;
  type DrivingHabit = keyof typeof HABIT_FACTORS;
  
  export function getRuleBasedServiceIntervals(input: RuleBasedIntervalsInput) {
    const { drivingHabits, modifications, standardIntervals } = input;
  
    return standardIntervals.map((item) => {
      let kmFactor = 1.0;
      let monthFactor = 1.0;
      const reasons: string[] = [];
  
      // --- Modification Adjustments (Engine Items Only) ---
      if (ENGINE_ITEMS.includes(item.item)) {
        const stageFactor = MOD_FACTORS.stage[modifications.stage as ModStage] || 1.0;
        const inductionFactor = MOD_FACTORS.forcedInduction[modifications.forcedInduction as ForcedInduction] || 1.0;
  
        // Use the most aggressive factor
        const modFactor = Math.min(stageFactor, inductionFactor);
        if (modFactor < 1.0) {
          kmFactor = Math.min(kmFactor, modFactor);
          monthFactor = Math.min(monthFactor, modFactor);
          if (stageFactor < 1.0 && inductionFactor < 1.0) {
              if (stageFactor <= inductionFactor) {
                  reasons.push(`Interval reduced due to Stage ${modifications.stage} modifications.`);
              } else {
                  reasons.push(`Interval reduced due to forced induction.`);
              }
          } else if (stageFactor < 1.0) {
              reasons.push(`Interval reduced due to Stage ${modifications.stage} modifications.`);
          } else if (inductionFactor < 1.0) {
              reasons.push(`Interval reduced due to forced induction.`);
          }
        }
      }
  
      // --- Driving Habit Adjustments (Wear Items Only) ---
      if (WEAR_ITEMS.includes(item.item)) {
        const habitFactor = HABIT_FACTORS[drivingHabits as DrivingHabit] || 1.0;
        if (habitFactor < 1.0) {
          kmFactor = Math.min(kmFactor, habitFactor);
          monthFactor = Math.min(monthFactor, habitFactor);
          reasons.push(`Interval adjusted for '${drivingHabits}'.`);
        }
      }
  
      const finalIntervalKms = Math.round((item.intervalKms * kmFactor) / 1000) * 1000;
      const finalIntervalMonths = Math.round(item.intervalMonths * monthFactor);
  
      if (reasons.length === 0) {
        reasons.push('Standard manufacturer recommended interval.');
      }
  
      return {
        ...item,
        intervalKms: finalIntervalKms > 0 ? finalIntervalKms : item.intervalKms,
        intervalMonths: finalIntervalMonths > 0 ? finalIntervalMonths : item.intervalMonths,
        reason: reasons.join(' '),
      };
    });
  }
  