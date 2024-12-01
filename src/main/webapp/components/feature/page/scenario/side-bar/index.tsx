import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/shadcn/side-bar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu.tsx';
import {
  BadgeCheck,
  BookDashed,
  BookType,
  ChevronsUpDown,
  ClipboardList,
  Command,
  LogOut,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar';
import { Link, useLocation } from '@tanstack/react-router';
import { ReactNode } from 'react';
import ThemeSwitcher from '@/components/ui/common/buttons/theme-switcher';

const navigationData = {
  user: {
    name: 'global user',
    email: 'user@example.com',
  },
  topNavigation: [
    {
      title: 'Scenario description',
      url: '/scenario/description',
      icon: ClipboardList,
      isActive: true,
    },
    {
      title: 'Scenario types',
      url: '/scenario/types',
      icon: BookType,
      isActive: false,
    },
    {
      title: 'Scenario templates',
      url: '/scenario/templates',
      icon: BookDashed,
      isActive: false,
    },
  ],
  bottomNavigation: [
    {
      title: 'Settings',
      url: '/scenario/settings',
      icon: Settings,
      isActive: false,
    },
  ],
};

const ScenarioDropdownSelector = () => {
  // TODO: add fetching of scenario after creation of multiple scenario :: probably sprint 2
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' asChild className='md:h-8 md:p-0'>
            <Link to='/scenario'>
              <div className='flex size-full rounded-lg bg-primary-400 text-black'>
                {/*Its some kind of joke that I HAVE TO TRANSLATE ICONS MYSELF */}
                <Command className='size-4 m-auto translate-x-[0.33px] translate-y-[0.33px]' />
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export const ScenarioSidebarFooter = () => {
  return (
    <SidebarFooter>
      <ThemeSwitcher />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent
                  data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarFallback className='rounded-lg'>
                    {navigationData.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {navigationData.user.name}
                  </span>
                  <span className='truncate text-xs'>
                    {navigationData.user.email}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side='bottom'
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {navigationData.user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {navigationData.user.name}
                    </span>
                    <span className='truncate text-xs'>
                      {navigationData.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-500'>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

const ScenarioSideBar = ({ panelContent }: { panelContent: ReactNode }) => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar collapsible='always'>
        <ScenarioDropdownSelector />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className='px-1.5 md:px-0'>
              <SidebarMenu>
                {navigationData.topNavigation.map((route, id) => (
                  <SidebarMenuItem key={id}>
                    <Link to={route.url}>
                      <SidebarMenuButton
                        tooltip={{ children: route.title, hidden: false }}
                        isActive={route.url === location.pathname}
                      >
                        <route.icon className='h-16 w-16 flex-shrink-0' />
                        <span>{route.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <ScenarioSidebarFooter />
      </Sidebar>
      <div className='group-data-[collapsed=true]:hidden h-svh w-full'>
        {panelContent}
      </div>
    </SidebarProvider>
  );
};

export default ScenarioSideBar;
