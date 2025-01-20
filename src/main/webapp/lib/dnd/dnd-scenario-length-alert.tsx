import { useActiveScenario } from '@/features/scenario/queries.ts';
import { DND_UNIT_SIZE } from '@/lib/dnd/dnd-timeline.tsx';
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert.tsx';
import { AlertTriangle } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';

const WIDTH_LIMIT = 600_000;

/**
 * Komponent alertu ostrzegający o przekroczeniu maksymalnej szerokości timelines.
 * Wyświetla się gdy całkowity czas trwania scenariusza przekracza limit techniczny wyświetlania.
 *
 * @remarks
 * Ze względu na ograniczenia techniczne canvas i przeglądarek, timeline ma limit szerokości 60 000 pikseli.
 * Przekroczenie tego limitu może powodować problemy z wydajnością i renderowaniem.
 *
 * TODO: Wprowadzić wirtualizacje canvasu
 *
 * @example
 * <DndPhaseAlert />
 */
const DndScenarioLengthAlert = () => {
  const { data: scenario, isSuccess } = useActiveScenario();

  const exceededLimit = React.useMemo(() => {
    if (!scenario) return false;

    const durationInMinutes = differenceInMinutes(
      scenario.endDate,
      scenario.startDate,
    );
    const totalWidth = durationInMinutes * DND_UNIT_SIZE;
    return totalWidth > WIDTH_LIMIT;
  }, [isSuccess, scenario?.startDate, scenario?.endDate]);

  if (!exceededLimit) return null;

  return (
    <Alert variant='danger' className='items-center flex'>
      <AlertTriangle />
      <div className='flex flex-col'>
        <span className='font-bold'>Timeline width limit exceeded</span>
        <AlertDescription className='flex items-center gap-2'>
          <span className='text-sm'>
            Timeline width has exceeded technical limits. This may affect
            performance and rendering. Consider reducing the scenario duration.
          </span>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default DndScenarioLengthAlert;
