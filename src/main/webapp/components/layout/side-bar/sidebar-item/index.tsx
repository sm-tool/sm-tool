import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/shadcn/button';
import { Tooltip } from '@/components/ui/shadcn/tooltip';
import { ReactNode } from 'react';

export interface NavItemProperties {
  label: string;
  icon: ReactNode;
  link: string;
  position: 'top' | 'bottom';
  isSelected: boolean;
  onClick: () => void;
}

export const SidebarItem = ({
  icon,
  isSelected = false,
  onClick,
}: NavItemProperties) => {
  const buttonContent = (
    <Button
      size={'icon'}
      variant={isSelected ? 'outline' : 'ghost'}
      onClick={onClick}
    >
      {/*<Link href={link} className="flex gap-4 lg:items-center ">*/}
      {icon}
      {/*</Link>*/}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
      <TooltipContent>
        <p className='m-2 text-balance rounded-xl border-2 border-neutral-950 p-1 px-2'>
          {/*{t('todo', { co: label })}*/}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
