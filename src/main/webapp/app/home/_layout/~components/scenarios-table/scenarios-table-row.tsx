import { Scenario } from '@/features/scenario/types.ts';
import {
  ActionItem,
  RudContextMenu,
  RudDropdownMenu,
} from '@/components/ui/common/buttons/context-menu/rud-context-menu.tsx';
import { TableCell, TableRow } from '@/components/ui/shadcn/table.tsx';
import { Link } from '@tanstack/react-router';
import formatDate from '@/utils/dates/format-date.ts';

const ScenariosTableRow = ({
  scenario,
  actions,
}: {
  scenario: Scenario;
  actions: ActionItem<Scenario>[];
}) => (
  <RudContextMenu actions={actions} item={scenario}>
    <TableRow className='hover:bg-content1'>
      <Link
        to={`/scenario/${scenario.id}`}
        className='contents'
        style={{ display: 'contents' }}
      >
        <TableCell className='font-semibold'>{scenario.title}</TableCell>
        <TableCell className='font-semibold'>{scenario.description}</TableCell>
        <TableCell className='font-semibold'>
          {formatDate(scenario.creationDate)}
        </TableCell>
        <TableCell className='font-semibold'>
          {formatDate(scenario.lastModificationDate)}
        </TableCell>
      </Link>
      <TableCell className='p-0'>
        <RudDropdownMenu actions={actions} item={scenario} />
      </TableCell>
    </TableRow>
  </RudContextMenu>
);

export default ScenariosTableRow;
