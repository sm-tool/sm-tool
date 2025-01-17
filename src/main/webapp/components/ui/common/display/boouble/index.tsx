import React from 'react';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';

const Boouble = ({
  message,
  duration,
}: {
  message: string;
  duration?: number;
}) => {
  const [tooltips, setTooltips] = React.useState<
    Array<{
      id: number;
      x: number;
      y: number;
      message: string;
    }>
  >([]);

  React.useEffect(() => {
    const timeouts = tooltips.map(tooltip => {
      return globalThis.setTimeout(() => {
        setTooltips(previous => previous.filter(t => t.id !== tooltip.id));
      }, duration);
    });

    return () => {
      for (const timeout of timeouts) globalThis.clearTimeout(timeout);
    };
  }, [tooltips]);

  const handleClick = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    setTooltips(previous => [
      ...previous,
      {
        id: Date.now(),
        x: clientX,
        y: clientY,
        message: message,
      },
    ]);
  };

  return (
    <div className='relative w-full h-full min-h-[500px]' onClick={handleClick}>
      {tooltips.map(tooltip => (
        <Card
          key={tooltip.id}
          className={cn(
            'absolute animate-tooltip transition-all duration-300',
            'p-2 min-w-[100px] text-center',
          )}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%) translateY(-20px)',
          }}
        >
          {tooltip.message}
        </Card>
      ))}
    </div>
  );
};

export default Boouble;
