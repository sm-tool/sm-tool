import React from 'react';
import { cn } from '@nextui-org/theme';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { X } from 'lucide-react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ChromeCardProperties {
  id: number;
  title: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  onMiddleClick?: () => void;
  className?: string;
}

const ChromeCard = ({
  id,
  title,
  icon,
  isActive,
  onClose,
  className,
  onClick,
}: ChromeCardProperties) => {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
    listeners,
  } = useSortable({ id });

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 1) {
      event.preventDefault();
      onClose?.();
    }
  };

  return (
    <div className='flex relative group'>
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          zIndex: isDragging ? 50 : undefined,
        }}
        className={cn('flex touch-none', className, isDragging && 'opacity-50')}
        onMouseDown={handleMouseDown}
        {...listeners}
        {...attributes}
      >
        <Button
          variant='ghost'
          size='sm'
          className={cn(
            'relative h-8 min-w-[60px] max-w-[240px] !rounded-none pl-2 pr-5 py-1.5 truncate',
            'transition-all duration-200',
            'focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-slate-950',
            isActive
              ? 'bg-background border-b-4 border-primary'
              : 'hover:bg-default-400 hover:text-default-foreground',
            isActive && 'after:bg-primary',
          )}
          onClick={onClick}
        >
          <div className='flex w-full items-center gap-2'>
            {icon && <div className='shrink-0'>{icon}</div>}
            <span className='truncate text-sm pr-2'>{title}</span>
            {onClose && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full p-0 opacity-0
                  hover:bg-divider/50 group-hover:opacity-100 transition-all duration-200'
                onClick={event => {
                  event.stopPropagation();
                  onClose();
                }}
              >
                <X className='h-3 w-3' />
              </Button>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ChromeCard;
