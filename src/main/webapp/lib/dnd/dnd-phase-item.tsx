import { ScenarioPhase } from '@/features/scenario-phase/types.ts';
import { RudContextMenu } from '@/lib/actions/components/rud-context-menu.tsx';
import scenarioPhaseActions from '@/features/scenario-phase/actions.ts';
import { DND_UNIT_SIZE } from '@/lib/dnd/dnd-timeline.tsx';
import { getContrastColor } from '@/utils/color/get-contrast-color.ts';
import { useDraggable } from '@dnd-kit/core';
import React from 'react';

/**
 * Komponent reprezentujący przeciągalny element fazy scenariusza z możliwością zmiany rozmiaru.
 *
 * @param {Object} props
 * @param {ScenarioPhase} props.phase - Obiekt fazy scenariusza
 *
 * @example
 * const phase = {
 *   id: '1',
 *   title: 'Planning Phase',
 *   color: '#FF5733',
 *   startTime: 0,
 *   endTime: 2
 * };
 *
 * <DndPhaseItem
 *   phase={phase}
 *   ref={phaseRef}
 * />
 *
 * // Aby zresetować stan:
 * phaseRef.current.resetState();
 */
const DndPhaseItem = React.forwardRef<
  { resetState: () => void },
  { phase: ScenarioPhase }
>(({ phase }, reference) => {
  const actions = scenarioPhaseActions();
  const [width, setWidth] = React.useState(
    (phase.endTime - phase.startTime) * DND_UNIT_SIZE,
  );
  const [left, setLeft] = React.useState(phase.startTime * DND_UNIT_SIZE);

  React.useImperativeHandle(reference, () => ({
    resetState: () => {
      setLeft(phase.startTime * DND_UNIT_SIZE);
      setWidth((phase.endTime - phase.startTime) * DND_UNIT_SIZE);
    },
  }));

  const { setNodeRef, attributes, listeners, transform } = useDraggable({
    id: `move-${phase.id}`,
    data: { type: 'move', phase },
  });

  const {
    setNodeRef: setLeftReference,
    attributes: leftAttributes,
    listeners: leftListeners,
    transform: leftTransform,
  } = useDraggable({
    id: `resize-left-${phase.id}`,
    data: { type: 'resize-left', phase },
  });

  const {
    setNodeRef: setRightReference,
    attributes: rightAttributes,
    listeners: rightListeners,
    transform: rightTransform,
  } = useDraggable({
    id: `resize-right-${phase.id}`,
    data: { type: 'resize-right', phase },
  });

  React.useEffect(() => {
    if (leftTransform) {
      setLeft(phase.startTime * DND_UNIT_SIZE + leftTransform.x);
      setWidth(
        (phase.endTime - phase.startTime) * DND_UNIT_SIZE - leftTransform.x,
      );
    } else if (rightTransform) {
      setWidth(
        (phase.endTime - phase.startTime) * DND_UNIT_SIZE + rightTransform.x,
      );
    } else if (transform) {
      setLeft(phase.startTime * DND_UNIT_SIZE + transform.x);
    }
  }, [leftTransform, rightTransform, transform]);

  return (
    <RudContextMenu actions={actions} item={phase}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className='absolute rounded-md border flex items-center gap-2 px-2 [&_*]:!text-inherit'
        style={{
          left,
          width,
          height: 40,
          top: 25,
          backgroundColor: phase.color,
          color: getContrastColor(phase.color),
          cursor: 'move',
        }}
      >
        <div
          ref={setLeftReference}
          {...leftListeners}
          {...leftAttributes}
          className='absolute left-0 top-0 w-2 h-full cursor-ew-resize'
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        />
        <div className='truncate font-medium select-none'>{phase.title}</div>
        <div
          ref={setRightReference}
          {...rightListeners}
          {...rightAttributes}
          className='absolute right-0 top-0 w-2 h-full cursor-ew-resize'
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        />
      </div>
    </RudContextMenu>
  );
});

DndPhaseItem.displayName = 'DndPhaseItem';

export default DndPhaseItem;
