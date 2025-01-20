import { Node, Panel, useStore } from '@xyflow/react';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import {
  ContextMenu,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { usePhases } from '@/features/scenario-phase/queries.ts';
import { PhaseCard } from '@/features/scenario-phase/components/flow-nodes/phase-card-node.tsx';
import RepeatingComponent from '@/components/ui/common/display/repeating-component';

const EventPhaseTimeline = ({
  nodes,
}: {
  nodes: Node<EventCardProperties>[];
}) => {
  const { transform } = useStore(state => ({
    transform: state.transform,
  }));

  const phases = usePhases();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Panel
          position='bottom-center'
          className='w-full h-8 bg-content1 !p-0 !m-0'
        >
          <div className='relative w-full'>
            <div className='absolute w-full bottom-0 border-t border-content3' />
            <StatusComponent useQuery={phases}>
              {phases => (
                <>
                  {phases?.map((phase, index) => {
                    const phaseNodes = nodes.filter(node => {
                      const nodeTime = Number(node.data.event?.time);
                      return (
                        nodeTime >= phase.startTime && nodeTime <= phase.endTime
                      );
                    });

                    if (phaseNodes.length === 0) return null;

                    const startX = Math.min(
                      ...phaseNodes.map(
                        n => n.position.x * transform[2] + transform[0],
                      ),
                    );
                    const endX = Math.max(
                      ...phaseNodes.map(
                        n => n.position.x * transform[2] + transform[0],
                      ),
                    );
                    const width = endX - startX;

                    return (
                      <div
                        key={`phase-${index}`}
                        className='absolute flex items-center h-8'
                        style={{
                          left: `${startX}px`,
                          width: `${width}px`,
                        }}
                      >
                        <PhaseCard
                          phase={phase}
                          className='w-full h-full flex items-center justify-center'
                        >
                          <RepeatingComponent>{phase.title}</RepeatingComponent>
                        </PhaseCard>
                      </div>
                    );
                  })}
                </>
              )}
            </StatusComponent>
          </div>
        </Panel>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};

export default EventPhaseTimeline;
