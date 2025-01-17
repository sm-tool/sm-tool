'use client';

import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@nextui-org/theme';

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...properties }, reference) => (
  <ContextMenuPrimitive.SubTrigger
    ref={reference}
    className={cn(
      `flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm
      outline-none focus:bg-content1 focus:text-foreground
      data-[state=open]:bg-content1 data-[state=open]:text-foreground`,
      inset && 'pl-8',
      className,
    )}
    {...properties}
  >
    {children}
    <ChevronRight className='ml-auto h-4 w-4' />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...properties }, reference) => (
  <ContextMenuPrimitive.SubContent
    ref={reference}
    className={cn(
      `z-50 min-w-[8rem] overflow-hidden rounded-md border bg-content1 p-1
      text-popover-foreground shadow-lg data-[state=open]:animate-in
      data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
      data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
      data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
      data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`,
      className,
    )}
    {...properties}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...properties }, reference) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={reference}
      className={cn(
        `z-50 min-w-[8rem] overflow-hidden rounded-md bg-content3 border-content2
        border-2 p-1 text-foreground transition-all shadow-xl
        data-[state=open]:animate-in data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2`,
        'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        className,
      )}
      {...properties}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, onClick, ...properties }, reference) => (
  <ContextMenuPrimitive.Item
    ref={reference}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5
      text-sm outline-none focus:bg-content2 focus:text-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
      inset && 'pl-8',
      className,
    )}
    onPointerDown={event => event.stopPropagation()}
    onClick={event => {
      event.stopPropagation();
      onClick?.(event);
    }}
    {...properties}
  />
));

ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...properties }, reference) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={reference}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8
      pr-2 text-sm outline-none focus:bg-content2 focus:text-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
      className,
    )}
    checked={checked}
    {...properties}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <ContextMenuPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...properties }, reference) => (
  <ContextMenuPrimitive.RadioItem
    ref={reference}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8
      pr-2 text-sm outline-none focus:bg-content2 focus:text-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
      className,
    )}
    {...properties}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className='h-4 w-4 fill-current' />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...properties }, reference) => (
  <ContextMenuPrimitive.Label
    ref={reference}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-foreground',
      inset && 'pl-8',
      className,
    )}
    {...properties}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...properties }, reference) => (
  <ContextMenuPrimitive.Separator
    ref={reference}
    className={cn('-mx-1 my-1 h-px bg-default-100', className)}
    {...properties}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({
  className,
  ...properties
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-foreground/20',
        className,
      )}
      {...properties}
    />
  );
};
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
