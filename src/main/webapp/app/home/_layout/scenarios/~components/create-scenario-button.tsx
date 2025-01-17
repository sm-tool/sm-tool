import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Plus } from 'lucide-react';
import { useCreateScenario } from '@/features/scenario/queries.ts';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import React from 'react';
import { Scenario, scenarioFormDTO } from '@/features/scenario/types.ts';

export const CreateScenarioButton = () => {
  const createScenario = useCreateScenario();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='primary'
          className='w-48 flex gap-x-2 flex-row mt-auto'
        >
          <Plus className='size-5 flex-shrink-0' />
          Create new scenario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <AutoFormDialogContent<Scenario>
          config={{
            title: 'Create scenario',
            type: 'autoForm',
            zodObjectToValidate: scenarioFormDTO,
            onSubmit: async data => {
              await createScenario.mutateAsync(data);
              setIsOpen(false);
            },
          }}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateScenarioButton;
