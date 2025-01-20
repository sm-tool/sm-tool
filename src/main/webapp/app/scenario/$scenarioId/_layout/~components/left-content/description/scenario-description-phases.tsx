import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { usePhases } from '@/features/scenario-phase/queries.ts';
import { ScenarioPhase } from '@/features/scenario-phase/types.ts';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import PhaseOverview from '@/features/scenario-phase/components/phase-card';
import DndTimeline from '@/lib/dnd/dnd-timeline.tsx';
import { useActiveScenario } from '@/features/scenario/queries.ts';
import DndPhaseAlert from '@/lib/dnd/dnd-phase-alert';
import DndScenarioLengthAlert from '@/lib/dnd/dnd-scenario-length-alert.tsx';

const ScenarioDescriptionPhases = () => {
  return (
    <DialogWrapper>
      <StatusComponent<ScenarioPhase[]> useQuery={usePhases()} showIfEmpty>
        {phases => (
          <div className='flex flex-col gap-y-6'>
            <StatusComponent useQuery={useActiveScenario()}>
              {scenario => (
                <DndTimeline phases={phases!} scenario={scenario!} />
              )}
            </StatusComponent>
            <DndPhaseAlert phases={phases!} />
            <DndScenarioLengthAlert />
            {phases
              ?.sort((a, b) => a.startTime - b.startTime)
              .map((phase, id) => <PhaseOverview phase={phase} key={id} />)}
          </div>
        )}
      </StatusComponent>
    </DialogWrapper>
  );
};

export default ScenarioDescriptionPhases;
