'use client';

import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@nextui-org/theme';

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...properties }, reference) => (
  <MenubarPrimitive.Root
    ref={reference}
    className={cn(
      'flex h-10 items-center space-x-1 bg-background p-1',
      className,
    )}
    {...properties}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...properties }, reference) => (
  <MenubarPrimitive.Trigger
    ref={reference}
    className={cn(
      `rounded-nested flex cursor-default select-none items-center px-3 py-1.5 text-sm
      font-medium outline-none focus:bg-default-200 focus:text-foreground
      data-[state=open]:bg-default-200 data-[state=open]:text-foreground`,
      className,
    )}
    {...properties}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...properties }, reference) => (
  <MenubarPrimitive.SubTrigger
    ref={reference}
    className={cn(
      `rounded-nested flex cursor-default select-none items-center px-2 py-1.5 text-sm
      outline-none focus:bg-default-200 focus:text-foreground
      data-[state=open]:bg-default-200 data-[state=open]:text-foreground`,
      inset && 'pl-8',
      className,
    )}
    {...properties}
  >
    {children}
    <ChevronRight className='ml-auto h-4 w-4' />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...properties }, reference) => (
  <MenubarPrimitive.SubContent
    ref={reference}
    className={cn(
      `z-50 min-w-[8rem] overflow-hidden rounded-2xl border bg-background p-1
      text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
      data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
      data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
      data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`,
      className,
    )}
    {...properties}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    {
      className,
      align = 'start',
      alignOffset = -4,
      sideOffset = 8,
      ...properties
    },
    reference,
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={reference}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:fade-out-0' +
            ' data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95' +
            ' data-[state=open]:zoom-in-95' +
            ' data-[side=bottom]:slide-in-from-top-2' +
            ' data-[side=left]:slide-in-from-right-2' +
            ' data-[side=right]:slide-in-from-left-2' +
            ' z-50 min-w-[12rem] data-[side=top]:slide-in-from-bottom-2' +
            ' overflow-hidden rounded-2xl border bg-background' +
            ' text-foreground shadow-md',
          className,
        )}
        {...properties}
      />
    </MenubarPrimitive.Portal>
  ),
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...properties }, reference) => (
  <MenubarPrimitive.Item
    ref={reference}
    className={cn(
      `rounded-nested relative flex cursor-default select-none items-center px-2 py-1.5
      text-sm outline-none focus:bg-default-200 focus:text-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
      inset && 'pl-8',
      className,
    )}
    {...properties}
  />
));
MenubarItem.displayName = 'MenubarItem';

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...properties }, reference) => (
  <MenubarPrimitive.CheckboxItem
    ref={reference}
    className={cn(
      `rounded-nested relative flex cursor-default select-none items-center py-1.5 pl-8
      pr-2 text-sm outline-none focus:bg-default-200 focus:text-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
      className,
    )}
    checked={checked}
    {...properties}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <MenubarPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...properties }, reference) => (
  <MenubarPrimitive.RadioItem
    ref={reference}
    className={cn(
      `rounded-nested relative flex cursor-default select-none items-center py-1.5 pl-8
      pr-2 text-sm outline-none focus:bg-default-200 focus:text-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
      className,
    )}
    {...properties}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <MenubarPrimitive.ItemIndicator>
        <Circle className='h-2 w-2 fill-current' />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...properties }, reference) => (
  <MenubarPrimitive.Label
    ref={reference}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...properties}
  />
));
MenubarLabel.displayName = 'MenubarLabel';

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...properties }, reference) => (
  <MenubarPrimitive.Separator
    ref={reference}
    className={cn('-mx-1 my-1 h-px bg-default-200', className)}
    {...properties}
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({
  className,
  ...properties
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-default-600',
        className,
      )}
      {...properties}
    />
  );
};
MenubarShortcut.displayName = 'MenubarShortcut';

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
