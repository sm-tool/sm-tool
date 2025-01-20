import { useObjectInstancesOfThread } from '@/features/object-instance/queries.ts';
import { useThread } from '@/features/thread/queries.ts';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ObjectStylized } from '@/features/object-instance/components/object-card';
import { OffspringData } from '@/features/branching/fork/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { ChevronsRight, Plus, Trash2 } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/shadcn/command.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import React from 'react';
import { Accordion } from '@radix-ui/react-accordion';
import {
  AccordionContent,
  AccordionItem,
  AccordionTriggerWithAction,
} from '@/components/ui/shadcn/accordition.tsx';
import InputEditable from '@/components/ui/common/input/input-editable';
import TextAreaEditable from '@/components/ui/common/input/text-area-editable';
import { useFormContext } from 'react-hook-form';
import { cn } from '@nextui-org/theme';
import { Label } from '@/components/ui/shadcn/label.tsx';
import ObjectStylizedDnd from '@/features/object-instance/components/object-card/object-stylized-dnd.tsx';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';

const OffspringAccordion = ({
  id,
  offspring,
  onTitleChange,
  onDescriptionChange,
  onDelete,
  disabledEdits,
}: {
  id: number;
  offspring: OffspringData;
  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  disabledEdits: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleTriggerClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.tagName.toLowerCase().includes('input')) {
      setIsOpen(!isOpen);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      onDelete(id);
    } else {
      onTitleChange(id, event.target.value);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onDescriptionChange(id, event.target.value);
  };

  const { setNodeRef, isOver, active } = useDroppable({
    id: id,
  });

  const isObjectTransfered = React.useMemo(
    () => offspring.transfer?.objectIds.includes(Number(active?.id)) && isOver,
    [active, offspring, isOver],
  );

  return (
    <AccordionItem
      ref={setNodeRef}
      value={id.toString()}
      className={cn(
        'w-full transition-all duration-200 relative',
        isOver &&
          'bg-secondary-300/20 border-dashed border-secondary-300 border-5',
        isObjectTransfered &&
          'bg-danger/20 border-dashed border-danger border-5',
      )}
    >
      {isOver && (
        <Label
          variant='uppercased'
          weight='bold'
          className={cn(
            'absolute flex items-center justify-center inset-0 text-xl z-10',
            isObjectTransfered ? 'text-danger' : 'text-secondary-400',
          )}
        >
          {isObjectTransfered
            ? 'Object is transfered here'
            : 'Drop to assign thread here'}
        </Label>
      )}
      <AccordionTriggerWithAction
        className={cn('hover:bg-content3/20')}
        onClick={handleTriggerClick}
        value={isOpen ? id.toString() : ''}
        onChange={(_: React.FormEvent<HTMLButtonElement>) => setIsOpen(!isOpen)}
        actionElement={
          <div className='flex items-center justify-between w-full gap-2'>
            <InputEditable
              value={offspring.title}
              topTooltip='Provide thread title'
              onChange={handleTitleChange}
              className='z-50 p-2'
              disabled={disabledEdits}
              placeholderChildren={
                <Label
                  variant='uppercased'
                  weight='bold'
                  className={cn('text-default-600 underline cursor-text')}
                >
                  Click to define thread
                </Label>
              }
            />
            <Button
              size='sm'
              variant='ghost'
              onClick={() => onDelete(id)}
              className='mr-6 z-50'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        }
      />
      <AccordionContent className='flex flex-col border-t-1 border-content3 border-dashed gap-y-6'>
        <div>
          <Label>Thread description</Label>
          <TextAreaEditable
            value={offspring.description}
            onChange={handleDescriptionChange}
            className={cn(
              'text-default-800',
              disabledEdits &&
                '!hover:cursor-not-allowed pointer-events-none opacity-50',
            )}
            placeholder='Thread description has not been set'
            disabled={disabledEdits}
          />
        </div>
        <div className='flex flex-col gap-y-3'>
          <Label>Thread transfered objects</Label>
          {offspring.transfer?.objectIds.length === 0 ? (
            <Label
              className='text-center text-default-500'
              variant='uppercased'
            >
              No object has been transfered to this thread
            </Label>
          ) : (
            <div className='grid grid-cols-3 gap-2'>
              {offspring.transfer?.objectIds.map(objectId => (
                <ObjectStylizedDnd
                  key={objectId}
                  objectId={objectId}
                  sourceLocalThreadId={id}
                />
              ))}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const NewOffspringTemplate = ({
  onAdd,
}: {
  onAdd: (offspring: OffspringData) => void;
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim()) {
      onAdd({
        title: event.target.value,
        description: '',
        transfer: {
          id: null,
          objectIds: [],
        },
      });
    }
  };

  return (
    <div className='w-full border-b-1 border-content4'>
      <div className='flex items-center w-full gap-2 p-4'>
        <InputEditable
          onChange={handleTitleChange}
          topTooltip='Provide new thread title'
          className='z-50 p-2'
          placeholderChildren={
            <div className='flex gap-x-2 items-center'>
              <Plus />
              <Label
                variant='uppercased'
                weight='bold'
                className={cn('text-default-600 underline cursor-text')}
              >
                Enter here new thread name
              </Label>
            </div>
          }
        />
      </div>
    </div>
  );
};

const ForkFormOffspringComponent = ({
  threadId,
  offsprings: initialOffsprings,
  onOffspringsChange,
  disabledEdits = false,
}: {
  threadId: number;
  offsprings: OffspringData[];
  onOffspringsChange: (offsprings: OffspringData[]) => void;
  disabledEdits?: boolean;
}) => {
  const setOffspringsAndNotify = (newOffsprings: OffspringData[]) => {
    setOffsprings(newOffsprings);
    onOffspringsChange(newOffsprings);
  };

  const [offsprings, setOffsprings] =
    React.useState<OffspringData[]>(initialOffsprings);

  const [activeId, setActiveId] = React.useState<number | null>(null);

  const { data: objects, isSuccess: areObjectLoaded } =
    useObjectInstancesOfThread(threadId);
  const { data: thread, isSuccess: isThreadLoaded } = useThread(threadId);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        tolerance: 5,
        distance: 1,
      },
    }),
  );

  const isObjectTransferred = (
    objectId: number,
    offsprings: OffspringData[],
  ) => {
    return offsprings.some(offspring =>
      offspring.transfer?.objectIds?.includes(objectId),
    );
  };

  const availableObjects = React.useMemo(
    () =>
      objects?.local.filter(
        object => !isObjectTransferred(object.id, offsprings),
      ),
    [objects, offsprings],
  );

  const allObjectsTransferred = React.useMemo(
    () =>
      objects?.local.every(object =>
        isObjectTransferred(object.id, offsprings),
      ),
    [objects, offsprings],
  );

  const { formState, setError, clearErrors } = useFormContext();

  React.useEffect(() => {
    if (!availableObjects) return;
    if (allObjectsTransferred) {
      clearErrors('root');
    } else {
      setError('root', {
        type: 'manual',
        message: 'All object have to be assigned to properly create a fork',
      });
    }
  }, [formState.isValidating, availableObjects]);

  if (!isThreadLoaded || !areObjectLoaded) {
    return <Skeleton className='w-full h-full' />;
  }

  const handleTitleChange = (index: number, newTitle: string) => {
    const updatedOffsprings = [...offsprings];
    updatedOffsprings[index] = {
      ...updatedOffsprings[index],
      title: newTitle,
    };
    setOffspringsAndNotify(updatedOffsprings);
  };

  const handleDescriptionChange = (index: number, newDescription: string) => {
    const updatedOffsprings = [...offsprings];
    updatedOffsprings[index] = {
      ...updatedOffsprings[index],
      description: newDescription,
    };
    setOffspringsAndNotify(updatedOffsprings);
  };

  const handleObjectTransfer = (
    targetThreadId: number,
    objectId: number,
    sourceThreadId: number | null,
  ) => {
    const newOffsprings = [...offsprings];

    if (targetThreadId === null) {
      const updatedOffsprings = newOffsprings.map((offspring, index) => {
        if (index === sourceThreadId) {
          const filteredObjectIds =
            offspring.transfer?.objectIds.filter(id => id !== objectId) || [];
          return {
            ...offspring,
            transfer: {
              id: offspring.transfer?.id ?? null,
              objectIds: filteredObjectIds,
            },
          };
        }
        return offspring;
      });
      setOffspringsAndNotify(updatedOffsprings);
      return;
    }

    const targetOffspring = newOffsprings[targetThreadId];
    const objectAlreadyExists =
      targetOffspring?.transfer?.objectIds?.includes(objectId);

    if (objectAlreadyExists) {
      return;
    }

    const updatedOffsprings = newOffsprings.map((offspring, index) => {
      if (index === targetThreadId) {
        return {
          ...offspring,
          transfer: {
            id: offspring?.transfer?.id ?? null,
            objectIds: [...(offspring.transfer?.objectIds || []), objectId],
          },
        };
      }
      if (sourceThreadId !== null && index === sourceThreadId) {
        const filteredObjectIds =
          offspring.transfer?.objectIds.filter(id => id !== objectId) || [];
        return {
          ...offspring,
          transfer: {
            id: offspring.transfer?.id ?? null,
            objectIds: filteredObjectIds,
          },
        };
      }
      return offspring;
    });

    setOffspringsAndNotify(updatedOffsprings);
  };

  const handleDelete = (index: number) => {
    const updatedOffsprings = offsprings.filter(
      (_, index_) => index_ !== index,
    );
    setOffspringsAndNotify(updatedOffsprings);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id && active.data.current) {
      handleObjectTransfer(
        Number(over.id),
        Number(active.id),
        Number(active.data.current.sourceLocalThreadId),
      );
    }
  };

  return (
    <div className='flex h-[50vh] w-full gap-4 min-w-0'>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className='flex-1'>
          <Card
            className={cn(
              'p-4 border-content4 border-1 @container h-full bg-content2 relative select-none',
            )}
          >
            <div className='absolute -top-8 translate-y-px'>
              <span
                className='border-default-500 border-1 border-b-0 rounded-t-xl truncate bg-content2 px-6
                  py-2 shadow-inner shadow-content1 max-w-full'
              >
                {thread?.title}
              </span>
            </div>
            <div className='h-full'>
              <div className={cn('grid gap-2 grid-cols-3')}>
                {availableObjects!.map(object => (
                  <ObjectStylizedDnd
                    key={object.id}
                    objectId={object.id}
                    sourceLocalThreadId={null}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div className='h-full flex flex-col justify-center items-center'>
          <ChevronsRight className='text-content4' />
        </div>
        <div className='flex-1'>
          <Card className='border-content4 border-1 @container h-full bg-content2'>
            <Command className='bg-content2 h-full flex flex-col'>
              <div className='flex items-center justify-between border-b-1 border-b-content4 p-2'>
                <CommandInput
                  placeholder='Search created threads...'
                  className='h-9'
                />
              </div>
              <CommandList className='flex-1 flex flex-col'>
                <ScrollArea className='h-[600px]'>
                  {offsprings.length > 0 && (
                    <div className='flex-1'>
                      <Accordion type='multiple'>
                        <CommandGroup>
                          {offsprings.map((offspring, index) => (
                            <CommandItem
                              key={index}
                              value={offspring.title || ''}
                              className='p-0 data-[selected=true]:bg-transparent'
                            >
                              <OffspringAccordion
                                disabledEdits={disabledEdits}
                                id={index}
                                offspring={offspring}
                                onTitleChange={(index, value) =>
                                  handleTitleChange(index, value)
                                }
                                onDescriptionChange={(index, value) =>
                                  handleDescriptionChange(index, value)
                                }
                                onDelete={index => handleDelete(index)}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Accordion>
                    </div>
                  )}
                  <NewOffspringTemplate
                    key={`${new Date()}`}
                    onAdd={newOffspring => {
                      const updatedOffsprings = [...offsprings, newOffspring];
                      setOffspringsAndNotify(updatedOffsprings);
                    }}
                  />
                  {offsprings.length === 0 && (
                    <div className='h-[500px] relative'>
                      <CommandEmpty className='absolute inset-0 flex items-center justify-center'>
                        <EmptyComponent
                          text={
                            <>
                              No threads available <br /> create a new thread to
                              get started
                            </>
                          }
                        />
                      </CommandEmpty>
                    </div>
                  )}
                </ScrollArea>
              </CommandList>
            </Command>
          </Card>
        </div>
        <DragOverlay>
          {activeId ? (
            <div
              className='touch-none select-none'
              style={{
                transform: 'translate(-75%, -175%)',
              }}
            >
              <ObjectStylized
                objectId={Number(activeId)}
                className='select-none'
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default ForkFormOffspringComponent;
