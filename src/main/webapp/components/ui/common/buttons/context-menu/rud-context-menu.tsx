import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { EllipsisVertical, LucideIcon } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/shadcn/context-menu.tsx';

export type ActionItem<T> = {
  label: string;
  Icon: LucideIcon;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
};

interface BaseMenuProperties<T> {
  actions: ActionItem<T>[];
  item: T;
  disabled?: boolean;
}

interface ContextMenuProperties<T> extends BaseMenuProperties<T> {
  children: React.ReactNode;
}

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
          <span>{action.label}</span>
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
          <span>{action.label}</span>
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

export const RudDropdownMenu = <T,>({
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
        <Button variant='ghost' size='lg' className='size-full p-0'>
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
            <span>{action.label}</span>
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
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
