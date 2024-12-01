'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';

import { cn } from '@nextui-org/theme';
import { Separator } from '@radix-ui/react-select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip.tsx';
import { Skeleton } from './skeleton.tsx';
import { Button } from './button';
import { Input } from './input.tsx';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};
// eslint-disable-next-line -- TODO: gada głupoty
const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProperty,
      onOpenChange: setOpenProperty,
      className,
      style,
      children,
      ...properties
    },
    reference,
  ) => {
    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProperty ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProperty) {
          setOpenProperty(openState);
        } else {
          _setOpen(openState);
        }

        // This sets the cookie to keep the sidebar state.
        // TODO: przenieśc wszystko do zustanda
        // eslint-disable-next-line -- TODO
        window.document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProperty, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return setOpen(open => !open);
    }, [setOpen]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      globalThis.addEventListener('keydown', handleKeyDown);
      return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        toggleSidebar,
      }),
      [state, open, setOpen, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              `group/sidebar-wrapper flex min-h-svh w-full
              has-[[data-variant=inset]]:bg-content1`,
              className,
            )}
            ref={reference}
            {...properties}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset' | 'relative';
    collapsible?: 'offcanvas' | 'icon' | 'none' | 'always';
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...properties
    },
    reference,
  ) => {
    const { state } = useSidebar();
    const isCollapsed = collapsible === 'always' || state === 'collapsed';

    if (collapsible === 'none') {
      return (
        <div
          className={cn(
            'flex h-full w-[--sidebar-width] flex-col bg-content1 text-content1-foreground',
            className,
          )}
          ref={reference}
          {...properties}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={reference}
        className={cn(
          'group peer text-content1-foreground',
          'hidden md:block',
          'group-data-[variant=relative]:relative group-data-[variant=relative]:h-full',
        )}
        data-state={isCollapsed ? 'collapsed' : 'expanded'}
        data-collapsible={isCollapsed ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={cn(
            'duration-200 relative bg-transparent transition-[width] ease-linear',
            'group-data-[variant=relative]:h-full group-data-[variant=default]:h-svh',
            'w-[--sidebar-width]',
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
            'group-data-[collapsible=always]:w-[--sidebar-width-icon]',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
          )}
        />
        <div
          className={cn(
            `duration-200 z-10 hidden w-[--sidebar-width] transition-[left,right,width]
            ease-linear md:flex`,
            `group-data-[variant=relative]:absolute group-data-[variant=relative]:top-0
            group-data-[variant=relative]:bottom-0`,
            'group-data-[variant=default]:fixed group-data-[variant=default]:inset-y-0 h-svh',
            side === 'left'
              ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
              : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
            'group-data-[collapsible=always]:w-[--sidebar-width-icon]',
            variant === 'floating' || variant === 'inset'
              ? `p-2
                group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]`
              : `group-data-[collapsible=icon]:w-[--sidebar-width-icon]
                group-data-[side=left]:border-r group-data-[side=right]:border-l`,
            className,
          )}
          {...properties}
        >
          <div
            data-sidebar='sidebar'
            className='flex h-full w-full flex-col bg-content1 group-data-[variant=floating]:rounded-lg
              group-data-[variant=floating]:border
              group-data-[variant=floating]:border-sidebar-border
              group-data-[variant=floating]:shadow'
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...properties }, reference) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={reference}
      data-sidebar='trigger'
      variant='ghost'
      size='icon'
      className={cn('h-7 w-7', className)}
      onClick={event => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...properties}
    >
      <PanelLeft />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...properties }, reference) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={reference}
      data-sidebar='rail'
      aria-label='Toggle Sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle Sidebar'
      className={cn(
        `absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear
        after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]
        hover:after:bg-default-900 group-data-[side=left]:-right-4
        group-data-[side=right]:left-0 sm:flex`,
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        `[[data-side=left][data-state=collapsed]_&]:cursor-e-resize
        [[data-side=right][data-state=collapsed]_&]:cursor-w-resize`,
        `group-data-[collapsible=offcanvas]:translate-x-0
        group-data-[collapsible=offcanvas]:after:left-full
        group-data-[collapsible=offcanvas]:hover:bg-content1`,
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...properties}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({ className, ...properties }, reference) => {
  return (
    <main
      ref={reference}
      className={cn(
        'relative flex min-h-svh flex-1 flex-col bg-background',
        `peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]
        md:peer-data-[variant=inset]:m-2
        md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2
        md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl
        md:peer-data-[variant=inset]:shadow`,
        className,
      )}
      {...properties}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...properties }, reference) => {
  return (
    <Input
      ref={reference}
      data-sidebar='input'
      className={cn(
        `h-8 w-full bg-background shadow-none focus-visible:ring-2
        focus-visible:ring-sidebar-ring`,
        className,
      )}
      {...properties}
    />
  );
});
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...properties }, reference) => {
  return (
    <div
      ref={reference}
      data-sidebar='header'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...properties}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...properties }, reference) => {
  return (
    <div
      ref={reference}
      data-sidebar='footer'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...properties}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...properties }, reference) => {
  return (
    <Separator
      ref={reference}
      data-sidebar='separator'
      className={cn('mx-2 w-auto bg-default-900', className)}
      {...properties}
    />
  );
});
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...properties }, reference) => {
  return (
    <div
      ref={reference}
      data-sidebar='content'
      className={cn(
        `flex min-h-0 flex-1 flex-col gap-2 overflow-auto
        group-data-[collapsible=icon]:overflow-hidden`,
        className,
      )}
      {...properties}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...properties }, reference) => {
  return (
    <div
      ref={reference}
      data-sidebar='group'
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...properties}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...properties }, reference) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={reference}
      data-sidebar='group-label'
      className={cn(
        `duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium
        text-content1-foreground/70 outline-none ring-sidebar-ring
        transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4
        [&>svg]:shrink-0`,
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      {...properties}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...properties }, reference) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={reference}
      data-sidebar='group-action'
      className={cn(
        `absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center
        rounded-md p-0 text-content1-foreground outline-none ring-sidebar-ring
        transition-transform hover:bg-content2 hover:text-content2-foreground
        focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0`,
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...properties}
    />
  );
});
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...properties }, reference) => (
  <div
    ref={reference}
    data-sidebar='group-content'
    className={cn('w-full text-sm', className)}
    {...properties}
  />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...properties }, reference) => (
  <ul
    ref={reference}
    data-sidebar='menu'
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...properties}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...properties }, reference) => (
  <li
    ref={reference}
    data-sidebar='menu-item'
    className={cn('group/menu-item relative', className)}
    {...properties}
  />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-content2 hover:text-content2-foreground focus-visible:ring-2 active:content2 active:text-content2-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:border-2 data-[active=true]:border-default-400 data-[active=true]:font-medium data-[active=true]:text-content2-foreground data-[state=open]:hover:bg-content2 data-[state=open]:hover:text-content2-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-content2 hover:text-content2-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-content2 hover:text-content2-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      ...properties
    },
    reference,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { state } = useSidebar();

    const button = (
      <Comp
        ref={reference}
        data-sidebar='menu-button'
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...properties}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side='right'
          align='center'
          hidden={state !== 'collapsed'}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(
  (
    { className, asChild = false, showOnHover = false, ...properties },
    reference,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={reference}
        data-sidebar='menu-action'
        className={cn(
          `absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center
          rounded-md p-0 text-content1-foreground outline-none ring-sidebar-ring
          transition-transform hover:bg-content2`,
          'after:absolute after:-inset-2 after:md:hidden',
          'peer-data-[size=sm]/menu-button:top-1',
          'peer-data-[size=default]/menu-button:top-1.5',
          'peer-data-[size=lg]/menu-button:top-2.5',
          'group-data-[collapsible=icon]:hidden',
          showOnHover &&
            `group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100
            data-[state=open]:opacity-100
            peer-data-[active=true]/menu-button:text-content2-foreground md:opacity-0`,
          className,
        )}
        {...properties}
      />
    );
  },
);
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...properties }, reference) => (
  <div
    ref={reference}
    data-sidebar='menu-badge'
    className={cn(
      `absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1
      text-xs font-medium tabular-nums text-content1-foreground select-none
      pointer-events-none`,
      `peer-hover/menu-button:text-content2-foreground
      peer-data-[active=true]/menu-button:text-content2-foreground`,
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      className,
    )}
    {...properties}
  />
));
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...properties }, reference) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={reference}
      data-sidebar='menu-skeleton'
      className={cn('rounded-md h-8 flex gap-2 px-2 items-center', className)}
      {...properties}
    >
      {showIcon && (
        <Skeleton
          className='size-4 rounded-md'
          data-sidebar='menu-skeleton-icon'
        />
      )}
      <Skeleton
        className='h-4 flex-1 max-w-[--skeleton-width]'
        data-sidebar='menu-skeleton-text'
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...properties }, reference) => (
  <ul
    ref={reference}
    data-sidebar='menu-sub'
    className={cn(
      `mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border
      px-2.5 py-0.5`,
      'group-data-[collapsible=icon]:hidden',
      className,
    )}
    {...properties}
  />
));
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...properties }, reference) => <li ref={reference} {...properties} />);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
  }
>(
  (
    { asChild = false, size = 'md', isActive, className, ...properties },
    reference,
  ) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={reference}
        data-sidebar='menu-sub-button'
        data-size={size}
        data-active={isActive}
        className={cn(
          `flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md
          px-2 text-content1-foreground outline-none ring-sidebar-ring hover:bg-content2
          hover:text-content2-foreground focus-visible:ring-2 active:border-2
          active:border-content2 active:text-content2-foreground
          disabled:pointer-events-none disabled:opacity-50
          aria-disabled:pointer-events-none aria-disabled:opacity-50
          [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0
          [&>svg]:text-content2-foreground`,
          'data-[active=true]:bg-content2 data-[active=true]:text-content2-foreground',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          'group-data-[collapsible=icon]:hidden',
          className,
        )}
        {...properties}
      />
    );
  },
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
