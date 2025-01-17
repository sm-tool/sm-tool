import { Book, FolderDot, LucideIcon } from 'lucide-react';

export interface HomeNavigationCategory {
  name: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const HOME_NAVIGATION_CATEGORIES: HomeNavigationCategory[] = [
  {
    name: 'Scenario manager',
    url: '/home/scenarios',
    icon: Book,
  },
  {
    name: 'Object catalogue',
    url: '/home/catalog/types',
    icon: FolderDot,
  },
];
