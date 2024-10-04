'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  useState,
} from 'react';
import { NavItemProperties } from '@/components/layout/side-bar/sidebar-item';
import ThemeSwitcher from '@/components/ui/common/buttons/theme-switcher';

interface SidebarProperties {
  children: ReactNode;
}

export const SideBar = ({ children }: SidebarProperties) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const topChildren: ReactNode[] = [];
  const bottomChildren: ReactNode[] = [<ThemeSwitcher key='theme-switcher' />];

  Children.forEach(children, (child, index) => {
    if (isValidElement<NavItemProperties>(child)) {
      const clonedChild = cloneElement(child, {
        isSelected: selectedIndex === index,
        onClick: () => handleItemClick(index),
      });
      if (child.props.position === 'bottom') {
        bottomChildren.push(clonedChild);
      } else {
        topChildren.push(clonedChild);
      }
    }
  });

  return (
    <aside
      className={`h-screen w-fit rounded-xl border-2 border-neutral-400 transition-all
        duration-300 ease-in-out`}
    >
      <nav className='flex h-full flex-col justify-between p-2'>
        <div className='flex flex-col items-center'>
          <ul className='flex w-full flex-col items-center space-y-2'>
            topChildren
          </ul>
        </div>
        <ul className='flex w-full flex-col items-center space-y-2'>
          bottomChildren
        </ul>
      </nav>
    </aside>
  );
};
