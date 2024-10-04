import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/shadcn/menu-bar';
import SearchInput from '@/components/ui/common/search-ables/search-input';
import ThemeSwitcher from '@/components/ui/common/buttons/theme-switcher';

const ScenarioMenuBar = () => {
  // Mocks
  const leftMenuItems = [
    { label: 'File', items: ['New', 'Open', 'Save'] },
    { label: 'Edit', items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'] },
    {
      label: 'Help',
      items: [`O nie nienieneineineinei za nic nie piszę kolejnego poradnika`],
    },
  ];

  const rightMenuItems = [
    { label: 'View', items: ['Command Palette', 'Open View'] },
    { label: 'Go', items: ['Go to File', 'Go to Symbol'] },
    { label: 'Run', items: ['Start Debugging', 'Run Without Debugging'] },
  ];

  return (
    <Menubar
      className='flex items-center justify-between border-b border-default-200 bg-default-100
        px-2'
    >
      <div className='flex w-1/3 items-center'>
        {leftMenuItems.map(menu => (
          <MenubarMenu key={menu.label}>
            <MenubarTrigger className='px-3 py-2 text-sm'>
              {menu.label}
            </MenubarTrigger>
            <MenubarContent>
              {menu.items.map(item => (
                <MenubarItem key={item} className='text-sm'>
                  {item}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </div>
      <div className='flex w-1/3 justify-center'>
        <SearchInput value='' onChange={() => {}} />
      </div>
      <div className='flex w-1/3 items-center justify-end'>
        {rightMenuItems.map(menu => (
          <MenubarMenu key={menu.label}>
            <MenubarTrigger className='px-3 py-2 text-sm'>
              {menu.label}
            </MenubarTrigger>
            <MenubarContent>
              {menu.items.map(item => (
                <MenubarItem key={item} className='text-sm'>
                  {item}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
        <ThemeSwitcher />
      </div>
    </Menubar>
  );
};

export default ScenarioMenuBar;
