import { Card } from '@/components/ui/shadcn/card.tsx';
import { BookDashed, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { AutoForm } from '@/components/ui/shadcn/auto-form';
import { ZodProvider } from '@autoform/zod';
import { scenarioFormDTO } from '@/features/scenario/types.ts';

const ScenariosEmptyTable = () => (
  <Card className='flex flex-col items-center justify-between h-[40rem] p-16'>
    <div className='flex flex-col items-center gap-6 text-center'>
      <h1 className='text-2xl font-bold'>Your scenario list is empty</h1>
      <BookDashed className='size-32 text-default-200' />
    </div>

    <div className='flex flex-col items-center gap-4 mt-16 text-center'>
      <h2 className='text-xl'>Create a scenario to start</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='primary'
            className='w-48 flex items-center justify-center gap-2'
            onClick={() => {}}
          >
            <Plus className='size-5' />
            Create new scenario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AutoForm schema={new ZodProvider(scenarioFormDTO)} withSubmit />
        </DialogContent>
      </Dialog>
    </div>
  </Card>
);

export default ScenariosEmptyTable;
