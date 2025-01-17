import { ScenarioPhase } from '@/features/scenario-phase/types.ts';
import { Scenario } from '@/features/scenario/types.ts';
import TimelineCanvas from '@/lib/dnd/dnd-timeline-canvas.tsx';
import TimelineDndContainer from '@/lib/dnd/dnd-timeline-container.tsx';
import { useUpdatePhase } from '@/features/scenario-phase/queries.ts';
import { DragEndEvent } from '@dnd-kit/core';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import React from 'react';

export const DND_UNIT_SIZE = 40;
export const DND_ROW_HEIGHT = 50;

/**
 * Komponent wyświetlający oś czasu z możliwością przeciągania i modyfikowania faz scenariusza.
 *
 * @param {Object} props
 * @param {ScenarioPhase[]} props.phases - Tablica faz scenariusza do wyświetlenia na osi czasu
 * @param {Scenario} props.scenario - Obiekt scenariusza
 *
 * @example
 * const phases = [
 *   {
 *     id: '1',
 *     title: 'Phase 1',
 *     startTime: 0,
 *     endTime: 2,
 *     color: '#FF5733'
 *   }
 * ];
 *
 * const scenario = {
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-02',
 *   eventDuration: 30 // minutes
 *   //...
 * };
 *
 * <DndTimeline
 *   phases={phases}
 *   scenario={scenario}
 * />
 */
const DndTimeline = ({
  phases,
  scenario,
}: {
  phases: ScenarioPhase[];
  scenario: Scenario;
}) => {
  const scrollAreaReference = React.useRef<HTMLDivElement>(null);

  const updatePhaseMutation = useUpdatePhase();
  const timeUnits = Math.ceil(
    (new Date(scenario.endDate).getTime() -
      new Date(scenario.startDate).getTime()) /
      (scenario.eventDuration * 60 * 1000),
  );

  const handleDragEnd = (event: DragEndEvent, resetState: () => void) => {
    const { active, delta } = event;
    if (!active) return;

    const { type, phase } = active.data.current as {
      type: string;
      phase: ScenarioPhase;
    };
    if (!phase) return;

    let newStartTime = phase.startTime;
    let newEndTime = phase.endTime;

    switch (type) {
      case 'move': {
        const moveAmount = Math.round(delta.x / DND_UNIT_SIZE);
        if (moveAmount === 0) return;
        newStartTime += moveAmount;
        newEndTime += moveAmount;
        break;
      }
      case 'resize-left': {
        const resizeAmount = Math.round(delta.x / DND_UNIT_SIZE);
        if (resizeAmount === 0) return;
        newStartTime += resizeAmount;
        break;
      }
      case 'resize-right': {
        const resizeAmount = Math.round(delta.x / DND_UNIT_SIZE);
        if (resizeAmount === 0) return;
        newEndTime += resizeAmount;
        break;
      }
    }

    if (newEndTime - newStartTime < 1) {
      resetState();
      return;
    }

    const hasCollision = phases.some(
      p =>
        p.id !== phase.id &&
        !(newEndTime <= p.startTime || newStartTime >= p.endTime),
    );

    if (
      hasCollision ||
      newStartTime < 0
      // || newEndTime > timeUnits
    ) {
      resetState();
      return;
    }

    if (newStartTime === phase.startTime && newEndTime === phase.endTime) {
      return;
    }

    updatePhaseMutation.mutate({
      id: Number(phase.id),
      data: {
        ...phase,
        startTime: newStartTime,
        endTime: newEndTime,
      },
    });
  };

  return (
    <ScrollArea
      ref={scrollAreaReference}
      type='always'
      className='relative h-fit'
      style={{ height: DND_ROW_HEIGHT + 30 }}
    >
      <div
        className='relative inline-block'
        style={{
          height: DND_ROW_HEIGHT,
          minWidth: '100%',
          width: `${timeUnits * DND_UNIT_SIZE}px`,
        }}
      >
        <TimelineCanvas
          timeUnits={timeUnits}
          eventDuration={scenario.eventDuration}
        />
        <TimelineDndContainer
          phases={phases}
          onDragEnd={handleDragEnd}
          scrollAreaRef={scrollAreaReference}
        />
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};

export default DndTimeline;
