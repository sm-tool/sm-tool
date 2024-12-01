import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/shadcn/table.tsx';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import ScenarioTableHeader from '@/app/home/_layout/~components/scenarios-table/scenarios-table-header.tsx';

const ScenariosTableSkeleton = () => (
  <Table className='table-fixed'>
    <ScenarioTableHeader />
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`sRow-${index}`}>
          {Array.from({ length: 4 }).map((_, sIndex) => (
            <TableCell key={`sCell-${sIndex}`}>
              <Skeleton className={'w-full h-8'} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ScenariosTableSkeleton;
