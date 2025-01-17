import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';
import { BaseMenuProperties } from '@/lib/actions/types.ts';

interface ContextMenuProperties<T> extends BaseMenuProperties<T> {
  children: React.ReactNode;
}

/**
 * Menu kontekstowe (prawy przycisk myszy) wyświetlające listę akcji dla danego elementu.
 * Akcje są podzielone na standardowe i destrukcyjne, które są wyświetlane oddzielnie z separatorem.
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
 * @param {React.ReactNode} props.children - Element, który będzie wyzwalał menu kontekstowe po kliknięciu prawym przyciskiem myszy
 *
 * @example
 * const actions = [
 *   {
 *     label: 'Edit',
 *     onClick: (file) => console.log('Edit', file),
 *     Icon: PencilIcon
 *   },
 *   {
 *     label: 'Delete',
 *     onClick: (file) => console.log('Delete', file),
 *     Icon: TrashIcon,
 *     variant: 'destructive'
 *   }
 * ];
 *
 * <RudContextMenu
 *   actions={actions}
 *   item={file}
 *   disabled={false}
 * >
 *   <div className="p-4 border rounded">
 *     Right click me to see context menu
 *   </div>
 * </RudContextMenu>
 */
const RudMenuContent = <T,>({ actions, item }: BaseMenuProperties<T>) => {
  const standardActions = actions.filter(
    action => action.variant !== 'destructive',
  );
  const destructiveActions = actions.filter(
    action => action.variant === 'destructive',
  );

  return (
    <ContextMenuContent className='w-48'>
      {standardActions.map((action, index) => (
        <ContextMenuItem
          key={`${action.label}-${index}`}
          onClick={() => action.onClick(item)}
          className={'flex items-center gap-2'}
        >
          <action.Icon className='size-5 flex-shrink-0' />
          <span className='truncate'>{action.label}</span>
        </ContextMenuItem>
      ))}

      {destructiveActions.length > 0 && standardActions.length > 0 && (
        <ContextMenuSeparator />
      )}

      {destructiveActions.map((action, index) => (
        <ContextMenuItem
          key={`${action.label}-${index}`}
          onClick={() => action.onClick(item)}
          className='flex items-center gap-2 text-danger'
        >
          <action.Icon className='size-5 flex-shrink-0' />
          <span className='truncate'>{action.label}</span>
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
  );
};

export const RudContextMenu = <T,>({
  actions,
  item,
  disabled,
  children,
}: ContextMenuProperties<T>) => (
  <ContextMenu>
    <ContextMenuTrigger asChild disabled={disabled}>
      {children}
    </ContextMenuTrigger>
    <RudMenuContent actions={actions} item={item} />
  </ContextMenu>
);
