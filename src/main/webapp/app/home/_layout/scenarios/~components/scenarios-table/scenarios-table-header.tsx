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
      <TableHead className='w-[10%]'>Creation date</TableHead>
      <TableHead className='w-[10%]'>Last modification</TableHead>
      <TableHead>{/*Options*/}</TableHead>
    </TableRow>
  </TableHeader>
);

export default ScenarioTableHeader;
