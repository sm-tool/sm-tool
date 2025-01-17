import React from 'react';
import { cn } from '@nextui-org/theme';
import { useDebouncedCallback } from '@/hooks/use-debounce.ts';

const MAX_HEIGHT = 200;

const LabeledSection = ({
  subtitle,
  content,
}: {
  subtitle: string;
  content: string;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const textReference = React.useRef<HTMLParagraphElement>(null);
  const [needsCollapse, setNeedsCollapse] = React.useState(false);

  const debouncedCheckHeight = useDebouncedCallback(() => {
    if (textReference.current) {
      setNeedsCollapse(textReference.current.scrollHeight > MAX_HEIGHT);
    }
  }, 30);

  React.useEffect(() => {
    if (!textReference.current) return;

    const resizeObserver = new ResizeObserver(() => {
      debouncedCheckHeight();
    });
    resizeObserver.observe(textReference.current);
    debouncedCheckHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, [content, debouncedCheckHeight]);
  return (
    <div className='text-foreground'>
      <p className='mb-1 px-2 text-sm text-default-500 truncate'>{subtitle}</p>
      <div className='relative'>
        <p
          ref={textReference}
          className={cn(
            'mb-12 border-l-4 border-primary-400 bg-default-200 px-2 break-words',
            !isExpanded &&
              needsCollapse &&
              'max-h-[200px] overflow-hidden pb-14',
            isExpanded && 'pb-8',
          )}
        >
          {content ?? 'No text was provided'}
        </p>
        {needsCollapse && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              `absolute bottom-0 left-0 w-full bg-gradient-to-t from-default-200 pt-10 pb-2
              text-sm text-primary-600 hover:text-primary-800 transition-colors`,
            )}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};
export default LabeledSection;
