import { Button } from '@/components/ui/shadcn/button';
import useDarkMode from '@/hooks/use-dark-mode';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { toggleTheme } = useDarkMode();
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      className={className}
    >
      <Sun className='absolute rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0' />
      <Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
    </Button>
  );
};

export default ThemeSwitcher;
