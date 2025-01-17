import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { cn } from '@nextui-org/theme';
import { AlertCircle, FileX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/shadcn/card.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';
import { ErrorBaseProperties } from '@/components/ui/common/data-load-states/error-component/index.tsx';

export const Error404Component = ({
  className,
  variant = 'default',
}: ErrorBaseProperties) => {
  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={cn(
                'rounded-full bg-content2 p-2 hover:bg-content3 transition-colors',
                className,
              )}
            >
              <FileX className='h-4 w-4 text-default-500' strokeWidth={1.5} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-xs'>Content Unavailable</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'sm') {
    return (
      <Card className={cn('w-full bg-content1', className)}>
        <CardContent className='flex items-center gap-3 p-3'>
          <div className='rounded-full bg-content2 p-2'>
            <FileX className='h-4 w-4 text-foreground' strokeWidth={1.5} />
          </div>
          <div>
            <p className='text-sm font-medium'>Content Unavailable</p>
            <p className='text-xs text-default-500'>
              Please verify your request
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full bg-content1', className)}>
      <CardContent className='flex flex-col items-center justify-center p-6'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='rounded-full bg-content2 p-3'>
            <FileX className='h-8 w-8 text-foreground' strokeWidth={1.5} />
          </div>
          <div className='space-y-1.5 text-center'>
            <h2 className='text-xl font-semibold'>Content Unavailable</h2>
            <p className='text-sm text-default-600'>
              We apologize, but the requested content cannot be accessed at this
              moment.
            </p>
          </div>
        </div>
        <Separator className='my-4' />
        <div
          className='flex items-center gap-2 rounded-md bg-default-100/50 p-3 text-sm
            text-default-700'
        >
          <AlertCircle className='h-4 w-4 text-default-500' />
          <span>Please verify your request or try again later</span>
        </div>
      </CardContent>
    </Card>
  );
};
