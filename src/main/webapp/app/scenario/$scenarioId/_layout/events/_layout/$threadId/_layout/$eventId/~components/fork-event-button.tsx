import { useCreateForkCreateRequest } from '@/features/branching/fork/queries.ts';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { EventInstance } from '@/features/event-instance/types.ts';
import {
  ForkCreateRequest,
  forkCreateRequestDTO,
} from '@/features/branching/fork/types.ts';
import TooltipButton from '@/components/ui/common/display/tooltip-button';
import GitForkRotated from '@/components/ui/common/icons/git-fork-rotated';
import ForkFormOffspringComponent from '@/features/branching/components/fork-form-offspring-component';
import { Input } from '@/components/ui/shadcn/input.tsx';
import { Textarea } from '@/components/ui/shadcn/text-area.tsx';
import { useParams } from '@tanstack/react-router';

const ForkEventButton = ({ event }: { event: EventInstance }) => {
  const createForkCreateRequest = useCreateForkCreateRequest();
  const [isOpened, setIsOpened] = React.useState(false);
  const { threadId } = useParams({
    strict: false,
  });

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger disabled={Number(threadId) === 0}>
        <TooltipButton
          buttonChildren={<GitForkRotated />}
          onClick={() => setIsOpened(true)}
          disabled={Number(threadId) === 0}
        >
          {disabled =>
            disabled ? (
              <>Global thread does not allow fork operations</>
            ) : (
              <>Fork this thread</>
            )
          }
        </TooltipButton>
      </DialogTrigger>
      <WizardDialogContent<ForkCreateRequest>
        className='min-w-fit w-fit max-w-none overflow-visible'
        config={{
          title: 'Fork thread',
          type: 'wizard',
          defaultValues: {
            forkTime: event.time,
            forkedThreadId: event.threadId,
          },
          steps: [
            {
              id: 1,
              title: 'Provide branching data',
              description:
                'Define a branching operation title that represents the splitting event in your workflow. This title should clearly identify the point where the process divides into parallel paths. ',
              fields: ['title', 'description'],
              validationSchema: forkCreateRequestDTO.pick({
                title: true,
                description: true,
              }),
              component: register => (
                <div className='min-w-[30rem]'>
                  <FormItem>
                    <FormLabel>
                      Branching title <span className='text-primary'> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...register('title')} key={'title'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Branching description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...register('description')}
                        key={'description'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              ),
            },
            {
              id: 2,
              title: 'Handle object ownerships',
              description:
                'Create and name new threads in the right panel to establish execution paths for the fork operation. The left panel shows all objects from the previous thread that need to be assigned. Drag and drop objects from the left panel to your newly created threads on the right to establish their new ownership ',
              validationSchema: forkCreateRequestDTO,
              fields: ['offsprings'],
              component: (register, formValues) => {
                const { onChange } = register('offsprings');

                return (
                  <div className='w-[80vw] h-[50vh]'>
                    <FormItem>
                      <FormControl>
                        <ForkFormOffspringComponent
                          threadId={event.threadId}
                          offsprings={
                            Array.isArray(formValues.offsprings)
                              ? formValues.offsprings
                              : []
                          }
                          onOffspringsChange={newOffsprings =>
                            onChange({
                              target: {
                                name: 'offsprings',
                                value: newOffsprings,
                              },
                            })
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                );
              },
            },
          ],
          onSubmit: async data => {
            await createForkCreateRequest.mutateAsync(data);
            setIsOpened(false);
          },
        }}
        onClose={() => {
          setIsOpened(false);
        }}
      />
    </Dialog>
  );
};

export default ForkEventButton;
