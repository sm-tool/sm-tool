import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { Plus } from 'lucide-react';
import { AutoForm } from '@/components/ui/shadcn/auto-form';
import { ZodProvider } from '@autoform/zod';
import { scenarioFormDTO } from '@/features/scenario/types.ts';

const CreateScenarioButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant='primary' className='w-48 flex flex-row mt-auto'>
        <Plus className={'size-5 flex-shrink-0'} />
        Create new scenario
      </Button>
    </DialogTrigger>
    <DialogContent>
      <AutoForm schema={new ZodProvider(scenarioFormDTO)} withSubmit />
    </DialogContent>
  </Dialog>
);

export default CreateScenarioButton;
