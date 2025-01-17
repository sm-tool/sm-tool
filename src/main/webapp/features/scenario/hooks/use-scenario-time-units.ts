import React from 'react';
import { useScenario } from '@/features/scenario/queries.ts';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';

/**
 * Hook obliczający liczbę jednostek czasowych w scenariuszu na podstawie jego dat granicznych i długości pojedynczego zdarzenia.
 *
 * @returns {number} Liczba jednostek czasowych (0 w przypadku braku scenariusza lub błędnej jednostki czasu)
 *
 * @example
 * function TimelineComponent() {
 *   const timeUnits = useScenarioTimeUnits();
 *
 *   return (
 *     <div>
 *       Liczba jednostek czasowych: {timeUnits}
 *     </div>
 *   );
 * }
 *
 * @remarks
 * Hook wykorzystuje dane scenariusza:
 * - startDate: data początkowa
 * - endDate: data końcowa
 * - eventDuration: długość pojedynczego zdarzenia
 * - eventUnit: jednostka czasu ('s' | 'min' | 'h')
 */
export const useScenarioTimeUnits = () => {
  const { data: scenario, isSuccess } = useScenario(getScenarioIdFromPath());

  return React.useMemo(() => {
    if (!scenario) {
      return 0;
    }

    const { startDate, endDate, eventDuration, eventUnit } = scenario;
    const diffInMs =
      new Date(endDate).getTime() - new Date(startDate).getTime();

    const msMultiplier = {
      s: 1000,
      min: 1000 * 60,
      h: 1000 * 60 * 60,
    };

    if (!eventUnit || !msMultiplier[eventUnit as keyof typeof msMultiplier]) {
      console.error('Invalid or unsupported time unit:', eventUnit);
      return 0;
    }

    const durationMs =
      eventDuration * msMultiplier[eventUnit as keyof typeof msMultiplier];
    return diffInMs / durationMs;
  }, [scenario, isSuccess]);
};
