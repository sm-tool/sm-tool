import {
  useActiveScenario,
  useUpdateActiveScenario,
} from '@/features/scenario/queries.ts';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Pencil } from 'lucide-react';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import { Scenario, scenarioDTO } from '@/features/scenario/types.ts';

const EditScenarioButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const editScenario = useUpdateActiveScenario();
  const scenarioData = useActiveScenario();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full hover:bg-content3 mx-auto'>
          <Pencil className='mr-2 h-5 w-5' />
          Edit scenario contents
        </Button>
      </DialogTrigger>
      <AutoFormDialogContent<Scenario>
        config={{
          title: 'Edit scenario',
          type: 'autoForm',
          data: scenarioData.data,
          zodObjectToValidate: scenarioDTO,
          onSubmit: async data => {
            await editScenario.mutateAsync({ data: data });
            setIsOpen(false);
          },
        }}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </Dialog>
  );
};

export default EditScenarioButton;
