import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { EllipsisVertical } from 'lucide-react';
import { BaseMenuProperties } from '@/lib/actions/types.ts';
/**
 * Menu rozwijane wyświetlające listę akcji dla danego elementu. Akcje są podzielone na standardowe i destrukcyjne,
 * które są wyświetlane oddzielnie z separatorem. Standardowe i destrukcyjne różnią się tylko kolorem przycisku:
 * bg-foreground albo bg-danger
 *
 * @template T - Typ elementu, na którym wykonywane są akcje
 * @param {Object} props
 * @param {Array<{
 *   label: string,
 *   onClick: (item: T) => void,
 *   Icon: React.ComponentType,
 *   variant?: 'default' | 'destructive'
 * }>} props.actions - Tablica akcji do wyświetlenia w menu. Każda akcja zawiera:
 *   - label: tekst wyświetlany przy akcji
 *   - onClick: funkcja wywoływana po kliknięciu, otrzymuje item jako parametr
 *   - Icon: komponent ikony do wyświetlenia
 *   - variant: opcjonalnie 'destructive' dla akcji destrukcyjnych
 * @param {T} props.item - Element, na którym wykonywane będą akcje
 * @param {boolean} props.disabled - Czy menu jest wyłączone
 *
 * @example
 * const actions = [
 *   {
 *     label: 'Edit',
 *     onClick: (user) => console.log('Edit', user),
 *     Icon: PencilIcon
 *   },
 *   {
 *     label: 'Delete',
 *     onClick: (user) => console.log('Delete', user),
 *     Icon: TrashIcon,
 *     variant: 'destructive'
 *   }
 * ];
 *
 * <RudDropdownMenu
 *   actions={actions}
 *   item={user}
 *   disabled={false}
 * />
 */
const RudDropdownMenu = <T,>({
  actions,
  item,
  disabled,
}: BaseMenuProperties<T>) => {
  const standardActions = actions.filter(
    action => action.variant !== 'destructive',
  );
  const destructiveActions = actions.filter(
    action => action.variant === 'destructive',
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant='ghost' size='icon' className='p-0'>
          <EllipsisVertical className='size-4 flex-shrink-0' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-48 z-20'>
        {standardActions.map((action, index) => (
          <DropdownMenuItem
            key={`${action.label}-${index}`}
            onClick={() => action.onClick(item)}
            className={'flex items-center gap-2'}
          >
            <action.Icon className='size-5 flex-shrink-0' />
            <span className='truncate'>{action.label}</span>
          </DropdownMenuItem>
        ))}

        {destructiveActions.length > 0 && standardActions.length > 0 && (
          <DropdownMenuSeparator />
        )}

        {destructiveActions.map((action, index) => (
          <DropdownMenuItem
            key={`${action.label}-${index}`}
            onClick={() => action.onClick(item)}
            className='flex items-center gap-2 text-danger'
          >
            <action.Icon className='size-5 flex-shrink-0' />
            <span className='truncate'>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RudDropdownMenu;
