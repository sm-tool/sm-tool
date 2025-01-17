import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/shadcn/side-bar.tsx';
import { Link, useLocation } from '@tanstack/react-router';
import { HomeNavigationCategory } from '@/components/layout/home-layout/constants/contant-navigation.ts';

const SidebarNavigationItem = ({
  category,
}: {
  category: HomeNavigationCategory;
}) => {
  const location = useLocation();

  return (
    <SidebarMenuItem key={category.name}>
      <SidebarMenuButton
        disabled={category.disabled}
        asChild
        isActive={
          category.name === 'Object catalogue'
            ? location.pathname.startsWith('/home/catalog')
            : location.pathname === category.url
        }
      >
        <Link to={category.url}>
          <category.icon />
          <span className='truncate'>{category.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarNavigationItem;
