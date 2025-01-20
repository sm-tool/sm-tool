import { Scenario } from '@/features/scenario/types.ts';
import { TableCell, TableRow } from '@/components/ui/shadcn/table.tsx';
import { useNavigate } from '@tanstack/react-router';
import formatDate from '@/utils/dates/format-date.ts';
import { ActionItem } from '@/lib/actions/types.ts';
import { RudContextMenu } from '@/lib/actions/components/rud-context-menu.tsx';
import RudDropdownMenu from '@/lib/actions/components/rud-dropdown-menu.tsx';
import { useMediaQueryLG } from '@/hooks/use-media-query.ts';

const ScenariosTableRow = ({
  scenario,
  actions,
}: {
  scenario: Scenario;
  actions: ActionItem<Scenario>[];
}) => {
  const navigate = useNavigate();
  const handleClick = () => void navigate({ to: `/scenario/${scenario.id}` });
  const isDesktop = useMediaQueryLG();

  return (
    <RudContextMenu actions={actions} item={scenario}>
      <TableRow className='hover:bg-content1'>
        <TableCell
          className='font-semibold cursor-pointer'
          onClick={handleClick}
        >
          {scenario.title}
        </TableCell>
        <TableCell
          className='font-semibold cursor-pointer'
          onClick={handleClick}
        >
          {scenario.description}
        </TableCell>
        {isDesktop && (
          <>
            <TableCell
              className='font-semibold cursor-pointer'
              onClick={handleClick}
            >
              {formatDate(scenario.creationDate)}
            </TableCell>
            <TableCell
              className='font-semibold cursor-pointer'
              onClick={handleClick}
            >
              {formatDate(scenario.lastModificationDate)}
            </TableCell>
          </>
        )}
        <TableCell className='p-0'>
          <RudDropdownMenu actions={actions} item={scenario} />
        </TableCell>
      </TableRow>
    </RudContextMenu>
  );
};

export default ScenariosTableRow;
