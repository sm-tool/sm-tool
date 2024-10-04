import useDarkMode from 'use-dark-mode';

import { Button } from '@/components/ui/shadcn/button';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher = () => {
  const darkMode = useDarkMode();

  return (
    <Button variant='ghost' size='sm' onClick={darkMode.toggle}>
      <Sun className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
    </Button>
  );
};

export default ThemeSwitcher;
