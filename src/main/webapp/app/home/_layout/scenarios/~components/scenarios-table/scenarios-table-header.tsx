import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table.tsx';

const ScenarioTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[35%]'>Name</TableHead>
      <TableHead className='w-[40%]'>Description</TableHead>
      <TableHead className='w-[10%] max-lg:hidden'>Creation date</TableHead>
      <TableHead className='w-[10%] max-lg:hidden'>Last modification</TableHead>
      <TableHead>{/*Options*/}</TableHead>
    </TableRow>
  </TableHeader>
);

export default ScenarioTableHeader;
