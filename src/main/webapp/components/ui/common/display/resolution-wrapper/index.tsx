import { MonitorOff } from 'lucide-react';
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query.ts';

const ResolutionWrapper = ({ children }: { children: React.ReactNode }) => {
  const isResolutionTooSmall = useMediaQuery(
    '(max-width: 770px), (max-height: 770px)',
  );

  if (isResolutionTooSmall) {
    return (
      <div
        className='fixed inset-0 flex flex-col items-center justify-center p-4 backdrop-blur-sm
          z-50'
      >
        <div className='max-w-md text-center space-y-6'>
          <MonitorOff className='h-12 w-12 mx-auto' />
          <h2 className='text-2xl font-semibold'>
            Resolution Requirements Not Met
          </h2>
          <p className='text-default-700 font-medium'>
            This application requires a minimum screen resolution of 770x770
            pixels to ensure optimal performance and user experience.
          </p>
          <p className='text-default-500 text-sm'>
            Please adjust your browser window size or switch to a device with a
            larger display.
          </p>
        </div>
      </div>
    );
  }
  return children;
};

export default ResolutionWrapper;
