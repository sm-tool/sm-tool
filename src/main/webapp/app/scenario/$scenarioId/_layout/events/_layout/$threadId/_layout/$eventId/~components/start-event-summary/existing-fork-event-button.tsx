import { Branching } from '@/features/branching/types.ts';
import { useUpdateForkCreateRequest } from '@/features/branching/fork/queries.ts';
import React from 'react';
import { useParams } from '@tanstack/react-router';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
import {
  forkCreateRequestDTO,
  ForkUpdateRequest,
  forkUpdateRequestDTO,
} from '@/features/branching/fork/types.ts';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import { Textarea } from '@/components/ui/shadcn/text-area.tsx';
import ForkFormOffspringComponent from '@/features/branching/components/fork-form-offspring-component';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { useConvertToForkUpdate } from '@/features/branching/utils/use-convert-to-fork-update.ts';

const ExistingForkEventButton = ({
  branchingValue,
  className,
}: {
  branchingValue: Branching;
  className?: string;
}) => {
  const updateForkCreateRequest = useUpdateForkCreateRequest();
  const [isOpened, setIsOpened] = React.useState(false);
  const { threadId } = useParams({
    strict: false,
  });
  const forkUpdate = useConvertToForkUpdate(branchingValue);

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger disabled={Number(threadId) === 0} className='w-full'>
        <Button
          variant='outline'
          onClick={() => setIsOpened(true)}
          disabled={Number(threadId) === 0}
          className={className}
        >
          Manage fork
        </Button>
      </DialogTrigger>
      <WizardDialogContent<ForkUpdateRequest>
        className='min-w-fit w-fit max-w-none overflow-visible'
        config={{
          title: 'Fork thread',
          type: 'wizard',
          // @ts-expect-error -- no need for writting wrapper
          defaultValues: forkUpdate,
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
              validationSchema: forkUpdateRequestDTO,
              fields: ['offsprings'],
              component: (register, formValues) => {
                const { onChange } = register('offsprings');

                return (
                  <div className='w-[80vw] h-[50vh]'>
                    <FormItem>
                      <FormControl>
                        <ForkFormOffspringComponent
                          disabledEdits
                          threadId={branchingValue.comingIn[0]}
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
            await updateForkCreateRequest.mutateAsync({
              branchingId: branchingValue.id,
              forkUpdateRequest: data,
            });
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

export default ExistingForkEventButton;
