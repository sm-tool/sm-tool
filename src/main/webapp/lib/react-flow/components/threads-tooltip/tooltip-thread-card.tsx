import React from 'react';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';

const TooltipThreadCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Card
    className={cn(
      `py-2 px-6 rounded-xl bg-content1 border-1 border-content2 duration-75 flex
      flex-row gap-x-2`,
      className,
    )}
  >
    {children}
  </Card>
);

export default TooltipThreadCard;
