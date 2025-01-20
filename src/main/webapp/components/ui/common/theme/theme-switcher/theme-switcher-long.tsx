import useDarkMode from '@/hooks/use-dark-mode.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { cn } from '@nextui-org/theme';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcherLong = ({ className }: { className?: string }) => {
  const { toggleTheme } = useDarkMode();
  return (
    <Button
      variant='ghost'
      onClick={toggleTheme}
      className={cn(
        'w-full flex items-center justify-start gap-2 pl-0.5',
        className,
      )}
    >
      <div className='relative w-6 h-6'>
        <Sun className='absolute inset-0 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0' />
        <Moon className='absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      </div>
      <span className='group-data-[collapsible=icon]:hidden'>
        Change color theme
      </span>
    </Button>
  );
};

export default ThemeSwitcherLong;
