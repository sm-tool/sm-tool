import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/shadcn/side-bar.tsx';
import { Link } from '@tanstack/react-router';
import { HomeNavigationCategory } from '@/components/layout/home-layout/constants/contant-navigation.ts';

const SidebarNavigationItem = ({
  category,
}: {
  category: HomeNavigationCategory;
}) => (
  <SidebarMenuItem key={category.name}>
    <SidebarMenuButton
      disabled={category.disabled}
      asChild
      isActive={category.url === globalThis.location.pathname}
    >
      <Link to={category.url}>
        <category.icon />
        <span>{category.name}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default SidebarNavigationItem;
