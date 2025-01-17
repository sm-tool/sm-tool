import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
} from '@/components/ui/shadcn/side-bar.tsx';
import { HOME_NAVIGATION_CATEGORIES } from '@/components/layout/home-layout/constants/contant-navigation.ts';
import SidebarNavigationItem from '@/components/layout/home-layout/sidebar-navigation-item.tsx';
import RecentScenarios from '@/components/layout/home-layout/recent-scenarios.tsx';
import UserSidebarFooter from '@/components/layout/home-layout/sidebar-footer.tsx';
import { Outlet } from '@tanstack/react-router';

const HomeLayout = () => (
  <div className='min-h-screen flex-col relative overflow-hidden'>
    <SidebarProvider>
      <Sidebar collapsible='icon'>
        <SidebarHeader className='h-20'>
          <img
            src={'/android-chrome-192x192.png'}
            className='size-full object-scale-down'
            alt={'logo'}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {HOME_NAVIGATION_CATEGORIES.map(category => (
                  <SidebarNavigationItem
                    category={category}
                    key={`category-${category.name}`}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <RecentScenarios />
        </SidebarContent>
        <UserSidebarFooter />
      </Sidebar>
      <main className='flex-1 bg-content2 h-screen overflow-hidden backdrop-blur-lg'>
        <Outlet />
      </main>
    </SidebarProvider>
  </div>
);

export default HomeLayout;
