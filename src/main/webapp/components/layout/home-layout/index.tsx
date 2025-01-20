import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/shadcn/side-bar.tsx';
import { HOME_NAVIGATION_CATEGORIES } from '@/components/layout/home-layout/constants/contant-navigation.ts';
import SidebarNavigationItem from '@/components/layout/home-layout/sidebar-navigation-item.tsx';
import RecentScenarios from '@/components/layout/home-layout/recent-scenarios.tsx';
import UserSidebarFooter from '@/components/layout/home-layout/sidebar-footer.tsx';
import { Link, Outlet } from '@tanstack/react-router';
import { useLocalStorage } from '@/hooks/use-local-storage.ts';

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(
    'mainSidebar',
    false,
  );

  return (
    <div className='min-h-screen flex-col relative overflow-hidden'>
      <SidebarProvider
        open={isSidebarOpen}
        onOpenChange={change => setIsSidebarOpen(change)}
      >
        <Sidebar collapsible='icon'>
          <SidebarHeader className='h-20 mt-6'>
            <Link to={'/home/scenarios'} className='size-full'>
              <img
                src={'/android-chrome-192x192.png'}
                className='size-full object-scale-down'
                alt={'logo'}
              />
            </Link>
          </SidebarHeader>

          <header
            className='flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear
              absolute group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
              peer-data-[state=closed]/sidebar-trigger:hidden'
          >
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1.5' />
            </div>
          </header>

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
};

export default HomeLayout;
