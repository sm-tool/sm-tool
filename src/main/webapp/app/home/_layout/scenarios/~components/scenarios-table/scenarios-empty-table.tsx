import { Card } from '@/components/ui/shadcn/card.tsx';
import { BookDashed } from 'lucide-react';

const ScenariosEmptyTable = () => (
  <Card className='flex flex-col items-center justify-between h-[28rem] p-16'>
    <div className='flex flex-col items-center gap-6 text-center'>
      <h1 className='text-2xl font-bold'>Your scenario list is empty</h1>
      <BookDashed className='size-32 text-default-200' />
    </div>

    <div className='flex flex-col items-center gap-4 mt-16 text-center'>
      <h2 className='text-xl'>Create a scenario to start</h2>
    </div>
  </Card>
);

export default ScenariosEmptyTable;
