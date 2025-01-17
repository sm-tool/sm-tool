import {
  ScenarioPhase,
  ScenarioPhaseForm,
  scenarioPhaseFormDTO,
} from '@/features/scenario-phase/types.ts';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { DND_UNIT_SIZE } from '@/lib/dnd/dnd-timeline.tsx';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import DndPhaseItem from '@/lib/dnd/dnd-phase-item.tsx';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import { useCreatePhase } from '@/features/scenario-phase/queries.ts';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';

/**
 * Kontener obsługujący przeciąganie i tworzenie faz na osi czasu.
 *
 * @param {Object} props
 * @param {ScenarioPhase[]} props.phases - Tablica faz scenariusza do wyświetlenia
 * @param {Function} props.onDragEnd - Callback wywoływany po zakończeniu przeciągania fazy.
 * Otrzymuje obiekt wydarzenia DragEndEvent oraz funkcję resetującą stan
 * @param {React.RefObject<HTMLDivElement>} props.scrollAreaRef - Referencja do kontenera przewijania
 *
 * @example
 * const handleDragEnd = (event, resetState) => {
 *   const { active, delta } = event;
 *   // Obsługa przeciągnięcia
 *   if (needsReset) {
 *     resetState();
 *   }
 * };
 *
 * <TimelineDndContainer
 *   phases={scenarioPhases}
 *   onDragEnd={handleDragEnd}
 *   scrollAreaRef={scrollRef}
 * />
 */
const TimelineDndContainer = ({
  phases,
  onDragEnd,
  scrollAreaRef,
}: {
  phases: ScenarioPhase[];
  onDragEnd: (event: DragEndEvent, resetState: () => void) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}) => {
  const snapToGrid = React.useCallback((coordinate: number) => {
    return Math.round(coordinate / DND_UNIT_SIZE) * DND_UNIT_SIZE;
  }, []);

  const phaseReferences = React.useRef<
    Record<string, { resetState: () => void }>
  >({});
  const [drawStart, setDrawStart] = React.useState<number | undefined>();
  const [currentDraw, setCurrentDraw] = React.useState<number | undefined>();
  const [isValid, setIsValid] = React.useState(true);
  const activePointerId = React.useRef<number | null | undefined>(null);
  const scrollingReference = React.useRef<number | null | undefined>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [newPhaseData, setNewPhaseData] = React.useState<
    | {
        startTime: number;
        endTime: number;
      }
    | undefined
  >();
  const phaseCreate = useCreatePhase();

  const startScrolling = (direction: 'left' | 'right') => {
    const scroll = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          '[data-radix-scroll-area-viewport]',
        );
        if (viewport) {
          viewport.scrollLeft += direction === 'right' ? 10 : -10;
        }
        if (scrollingReference.current) {
          scrollingReference.current = globalThis.requestAnimationFrame(scroll);
        }
      }
    };

    if (!scrollingReference.current) {
      scrollingReference.current = globalThis.requestAnimationFrame(scroll);
    }
  };

  const stopScrolling = () => {
    if (scrollingReference.current) {
      globalThis.cancelAnimationFrame(scrollingReference.current);
      scrollingReference.current = undefined;
    }
  };

  const handleMouseDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // TODO: użyć kalkulazji to jest na tani sylikon zrobione
    if (target.closest('.absolute.rounded-md.border')) {
      return;
    }
    if (event.button !== 0) return;

    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);

    const containerRect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - containerRect.left;
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const timeUnit = Math.floor(
      (relativeX + scrollArea.scrollLeft) / DND_UNIT_SIZE,
    );
    setDrawStart(timeUnit);
    setCurrentDraw(timeUnit);
  };

  const handleMouseMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drawStart === null || event.pointerId !== activePointerId.current)
      return;

    const container = event.currentTarget;
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const rect = container.getBoundingClientRect();
    const distanceFromRight = scrollAreaRect.right - event.clientX;
    const distanceFromLeft = event.clientX - scrollAreaRect.left;

    if (distanceFromRight < 50) {
      startScrolling('right');
    } else if (distanceFromLeft < 50) {
      startScrolling('left');
    } else {
      stopScrolling();
    }

    const timeUnit = Math.floor(
      (event.clientX - rect.left + scrollArea.scrollLeft) / DND_UNIT_SIZE,
    );
    setCurrentDraw(timeUnit);
  };

  const handleMouseUp = (event: React.PointerEvent<HTMLDivElement>) => {
    stopScrolling();

    if (activePointerId.current === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      activePointerId.current = undefined;
    }

    if (drawStart === undefined || currentDraw === undefined || !isValid) {
      setDrawStart(undefined);
      setCurrentDraw(undefined);
      return;
    }

    const start = Math.min(drawStart, currentDraw);
    const end = Math.max(drawStart, currentDraw);

    setNewPhaseData({ startTime: start, endTime: end });
    setIsOpen(true);
    setDrawStart(undefined);
    setCurrentDraw(undefined);
  };

  React.useEffect(() => {
    if (drawStart === undefined || currentDraw === undefined) return;

    const start = Math.min(drawStart, currentDraw);
    const end = Math.max(drawStart, currentDraw);
    const hasCollision = phases.some(
      phase => !(end <= phase.startTime - 1 || start >= phase.endTime),
    );
    setIsValid(!hasCollision);
  }, [drawStart, currentDraw, phases]);

  React.useEffect(() => {
    return () => stopScrolling();
  }, []);

  return (
    <>
      <DndContext
        onDragEnd={event => {
          const phase = (event.active?.data.current as { phase: ScenarioPhase })
            ?.phase;
          const phaseReference = phaseReferences.current[phase.id];
          onDragEnd(event, () => {
            phaseReference?.resetState?.();
          });
        }}
        modifiers={[
          restrictToHorizontalAxis,
          ({ transform }) => ({
            ...transform,
            x: snapToGrid(transform.x),
          }),
        ]}
      >
        <div
          className='sticky size-full z-10 translate-y-3'
          onPointerDown={handleMouseDown}
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
          onPointerLeave={handleMouseUp}
        >
          <div className='-translate-y-4'>
            {phases.map(phase => (
              <DndPhaseItem
                key={phase.id}
                phase={phase}
                ref={element => {
                  if (element) {
                    phaseReferences.current[phase.id] = element;
                  }
                }}
              />
            ))}
            {drawStart !== undefined && currentDraw !== undefined && (
              <div
                className={`absolute h-[40px] top-[25px] border ${
                isValid
                    ? 'bg-blue-500 bg-opacity-50 border-blue-600'
                    : 'bg-red-500 bg-opacity-50 border-red-600'
                }`}
                style={{
                  left: Math.min(drawStart, currentDraw) * DND_UNIT_SIZE,
                  width:
                    (Math.abs(currentDraw - drawStart) + 1) * DND_UNIT_SIZE,
                }}
              />
            )}
          </div>
        </div>
      </DndContext>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild />
        <AutoFormDialogContent<ScenarioPhaseForm>
          config={{
            title: 'Create phase',
            type: 'autoForm',
            defaultValues: {
              scenarioId: getScenarioIdFromPath(),
              startTime: newPhaseData?.startTime,
              endTime: (newPhaseData?.endTime ?? 0) + 1,
            },
            zodObjectToValidate: scenarioPhaseFormDTO,
            onSubmit: async data => {
              await phaseCreate.mutateAsync(data);
              setIsOpen(false);
            },
          }}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </Dialog>
    </>
  );
};

export default TimelineDndContainer;
