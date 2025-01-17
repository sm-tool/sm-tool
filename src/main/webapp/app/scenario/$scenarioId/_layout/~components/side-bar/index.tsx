import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/shadcn/side-bar.tsx';
import {
  BookType,
  ChartBarIncreasing,
  ClipboardList,
  Package,
} from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import UserSidebarFooter from '@/components/layout/home-layout/sidebar-footer.tsx';

const navigationData = [
  {
    title: 'Scenario description',
    url: 'description',
    icon: ClipboardList,
  },
  {
    title: 'Scenario catalogue',
    url: 'catalogue:types',
    icon: BookType,
  },
  {
    title: 'Scenario threads',
    url: 'threads',
    icon: ChartBarIncreasing,
  },
  {
    title: 'Scenario objects',
    url: 'objects',
    icon: Package,
  },
];

const SidebarNavigation = () => {
  const search = useSearch({
    // @ts-expect-error -- ts wrongly intercepts the type
    from: '/scenario/$scenarioId',
    strict: false,
  });
  const { navigateRelative } = useScenarioSearchParamNavigation();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent className='px-1.5 md:px-0'>
          <SidebarMenu>
            {navigationData.map((route, id) => (
              <SidebarMenuItem key={id}>
                <div onClick={() => navigateRelative(route.url)}>
                  <SidebarMenuButton
                    tooltip={{ children: route.title, hidden: false }}
                    isActive={search?.left?.startsWith(route.url.split(':')[0])}
                  >
                    <route.icon />
                    <span className='truncate'>{route.title}</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

const ScenarioDropdownSelector = () => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' asChild className='md:h-8 md:p-0'>
            <Link to={'/home/scenarios'}>
              <div className='flex size-full rounded-lg bg-primary-400 text-black'>
                <img
                  src={'/android-chrome-192x192.png'}
                  className='size-full object-scale-down'
                  alt={'logo'}
                />
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

const ScenarioSideBar = () => {
  return (
    <SidebarProvider className='w-12'>
      <Sidebar collapsible='always' className='w-12'>
        <ScenarioDropdownSelector />
        <SidebarNavigation />
        <UserSidebarFooter variant={'short'} />
      </Sidebar>
    </SidebarProvider>
  );
};

export default ScenarioSideBar;
