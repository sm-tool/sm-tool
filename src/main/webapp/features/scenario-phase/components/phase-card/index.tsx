import { ScenarioPhase } from '@/features/scenario-phase/types.ts';
import scenarioPhaseActions from '@/features/scenario-phase/actions.ts';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';
import { getContrastColor } from '@/utils/color/get-contrast-color.ts';
import { Clock } from 'lucide-react';
import { RudContextMenu } from '@/lib/actions/components/rud-context-menu.tsx';
import RudDropdownMenu from '@/lib/actions/components/rud-dropdown-menu.tsx';

const PhaseOverview = ({ phase }: { phase: ScenarioPhase }) => {
  return (
    <div className='flex gap-4 text-foreground w-full'>
      <div className='w-2/5'>
        <RudContextMenu actions={scenarioPhaseActions()} item={phase}>
          <div
            className='rounded-lg p-2 mb-2'
            style={{ backgroundColor: phase.color }}
          >
            <p
              className='font-medium'
              style={{ color: getContrastColor(phase.color) }}
            >
              {phase.title}
            </p>
          </div>
        </RudContextMenu>
        <div className='flex items-center justify-between'>
          <RudDropdownMenu<ScenarioPhase>
            actions={scenarioPhaseActions()}
            item={phase}
          />
          <span className='text-sm text-muted-foreground flex-row flex gap-x-2'>
            <Clock className='size-5 flex-shrink-0' />
            {phase.startTime} - {phase.endTime}
          </span>
        </div>
      </div>

      <div className='w-3/5'>
        <LabeledSection subtitle='Description' content={phase.description} />
      </div>
    </div>
  );
};

export default PhaseOverview;
