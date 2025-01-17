import React from 'react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { ActionItem } from '@/lib/actions/types.ts';

interface WithTopActionProperties<T> {
  children: React.ReactElement;
  actions: ActionItem<T>[];
  item: T;
}
/**
 * Komponent HOC dodający pasek akcji nad przekazanym elementem.
 * Wyświetla przyciski z ikonami w zaokrąglonym kontenerze nad główną zawartością.
 *
 * @template T - Typ elementu, na którym wykonywane są akcje
 * @param {Object} props
 * @param {React.ReactElement} props.children - Element, nad którym wyświetlane będą akcje
 * @param {ActionItem<T>[]} props.actions - Lista akcji do wyświetlenia w formie przycisków
 * @param {T} props.item - Element, który będzie przekazywany do funkcji onClick akcji
 *
 * @example
 * ```tsx
 * <WithTopActions
 *   actions={[
 *     {
 *       Icon: Pencil,
 *       onClick: (user) => handleEdit(user),
 *       label: 'Edit'
 *     },
 *     {
 *       Icon: Trash,
 *       onClick: (user) => handleDelete(user),
 *       label: 'Delete',
 *       variant: 'destructive'
 *     }
 *   ]}
 *   item={currentUser}
 * >
 *   <UserCard user={currentUser} />
 * </WithTopActions>
 * ```
 */
const WithTopActions = <T,>({
  children,
  actions,
  item,
}: WithTopActionProperties<T>) => {
  return (
    <>
      <div
        className='bg-content2 w-fit rounded-t-3xl mx-auto flex flex-row justify-center gap-x-2
          border-1 border-content4'
      >
        {actions.map((action, index) => (
          <Button
            variant='ghost'
            key={index}
            onClick={() => action.onClick(item)}
            className='text-default-300 hover:text-default-700 !bg-transparent'
          >
            <action.Icon className='size-4 flex-shrink-0' />
          </Button>
        ))}
      </div>
      {children}
    </>
  );
};

export default WithTopActions;
