import { ScenarioPhase } from '@/features/scenario-phase/types.ts';
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert.tsx';
import { AlertTriangle } from 'lucide-react';
import { useScenarioTimeUnits } from '@/features/scenario/hooks/use-scenario-time-units.ts';

/**
 * Komponent alertu ostrzegający o fazach scenariusza wykraczających poza jego zakres czasowy.
 * Wyświetla się tylko gdy wykryto fazę, której czas zakończenia przekracza całkowity czas scenariusza.
 *
 * @param {ScenarioPhase[]} phases - Lista faz scenariusza zawierająca ich metadane, w tym czasy rozpoczęcia i zakończenia
 *
 * @example
 * const phases = [
 *   {
 *     title: "Phase 1",
 *     startTime: 0,
 *     endTime: 120,
 *     // ... other phase properties
 *   }
 * ];
 *
 * <DndPhaseAlert phases={phases} />
 */
const DndPhaseAlert = ({ phases }: { phases: ScenarioPhase[] }) => {
  const scenarioTotalTimeInUnits = useScenarioTimeUnits();

  const isPhaseInDangerZone = React.useMemo(
    () => phases.some(({ endTime }) => endTime > scenarioTotalTimeInUnits),
    [phases, scenarioTotalTimeInUnits],
  );

  if (!isPhaseInDangerZone) return null;

  return (
    <Alert variant='danger' className='items-center flex'>
      <AlertTriangle />
      <div className='flex flex-col'>
        <span className='font-bold'>Overtime phase alert</span>
        <AlertDescription className='flex items-center gap-2'>
          <span className='text-sm'>
            One of the phases has been detected to be after schedule
          </span>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default DndPhaseAlert;
