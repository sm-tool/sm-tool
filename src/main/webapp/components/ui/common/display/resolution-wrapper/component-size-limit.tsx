import React, { useEffect, useState } from 'react';
import { MonitorOff } from 'lucide-react';

interface ComponentSizeLimitProperties {
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

export const ComponentSizeLimit = ({
  children,
  minWidth = 0,
  minHeight = 0,
}: ComponentSizeLimitProperties) => {
  const [containerReference, setContainerReference] =
    useState<HTMLDivElement | null>(null);
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    if (!containerReference) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setIsTooSmall(width < minWidth || height < minHeight);
      }
    });

    resizeObserver.observe(containerReference);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerReference, minWidth, minHeight]);

  return (
    <div ref={setContainerReference} className='relative w-full h-full'>
      {isTooSmall ? (
        <div className='flex flex-col items-center justify-center p-4'>
          <MonitorOff className='h-8 w-8 mb-4' />
          <p className='text-default-700 font-medium text-center'>
            Component requires larger display area
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ComponentSizeLimit;
