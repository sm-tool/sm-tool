import { UseQueryResult } from '@tanstack/react-query';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import React from 'react';
import EmptyComponent from '@/components/ui/common/data-load-states/empty-component';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { ErrorType } from '@/lib/react-query/components/infinite-scroll';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@nextui-org/theme';

interface StatusComponentProperties<T> {
  useQuery: UseQueryResult<T, unknown>;
  loadingComponent?: React.ReactElement;
  errorComponent?: (error: ErrorType) => React.ReactElement;
  emptyComponent?: React.ReactElement;
  children: (data?: T) => React.ReactElement;
  showIfEmpty?: boolean;
  skipAnimation?: boolean;
  className?: string;
  animateMode?: 'sync' | 'popLayout' | 'wait';
}

const StatusComponent = <T,>({
  useQuery,
  children,
  showIfEmpty,
  loadingComponent = <Skeleton className='h-screen w-full rounded-sm' />,
  errorComponent = error => <ErrorComponent error={error} />,
  emptyComponent = <EmptyComponent text='no data found' />,
  skipAnimation = false,
  className,
  animateMode = 'wait',
}: StatusComponentProperties<T>): React.ReactElement | undefined => {
  const { isLoading, isError, error, data } = useQuery;

  return (
    <AnimatePresence mode={animateMode}>
      {isLoading && (
        <motion.div
          key='loading'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='transition-opacity duration-200'
        >
          {loadingComponent ?? (
            <div className='flex justify-center items-center p-4 h-full'>
              <LoadingSpinner />
            </div>
          )}
        </motion.div>
      )}
      {isError && (
        <motion.div
          key='error'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {errorComponent(error as ErrorType) ?? (
            <div className='flex justify-center items-center p-4 w-full h-full'>
              <ErrorComponent error={error as ErrorType} />
            </div>
          )}
        </motion.div>
      )}
      {Array.isArray(data) && data.length === 0 && !showIfEmpty && (
        <motion.div
          key='empty'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className='flex justify-center items-center p-4 h-full'>
            {emptyComponent}
          </div>
        </motion.div>
      )}
      {data &&
        (skipAnimation ? (
          <div className={cn('h-full w-full', className)}>{children(data)}</div>
        ) : (
          <motion.div
            key='content'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('h-full w-full', className)}
            layout
          >
            {children(data)}
          </motion.div>
        ))}
    </AnimatePresence>
  );
};

export default StatusComponent;
