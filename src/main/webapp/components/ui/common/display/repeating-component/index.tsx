import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import {
  useLocalStorage,
  useLocalStorageListener,
} from '@/hooks/use-local-storage.ts';

const RepeatingContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerReference = React.useRef<HTMLDivElement>(null);
  const contentReference = React.useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [copies, setCopies] = React.useState<number>(4);
  const [disableAnimation, setDisableAnimation] = useLocalStorage<boolean>(
    'phaseAnimation',
    false,
  );

  useLocalStorageListener<boolean>('phaseAnimation', newValue => {
    if (newValue !== null) {
      setDisableAnimation(newValue);
    }
  });

  useEffect(() => {
    if (containerReference.current && contentReference.current) {
      const containerWidth = containerReference.current.offsetWidth;
      const contentWidth = contentReference.current.offsetWidth;
      const gapWidth = 200;
      const itemTotalWidth = contentWidth + gapWidth;
      const necessaryCopies = Math.ceil(containerWidth / itemTotalWidth) + 1;
      setCopies(necessaryCopies);

      if (disableAnimation) {
        controls.stop();
        controls.set({ x: 0 });
      } else {
        void controls.start({
          x: [-itemTotalWidth, 0],
          transition: {
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          },
        });
      }
    }
  }, [disableAnimation]);

  return (
    <div
      ref={containerReference}
      className={`flex overflow-hidden ${className}`}
    >
      <motion.div
        className='flex gap-x-[200px] whitespace-nowrap'
        animate={controls}
      >
        {Array.from({ length: copies }, (_, index) => (
          <div
            key={index}
            ref={index === 0 ? contentReference : undefined}
            className='flex-shrink-0 min-w-[200px] max-w-[2000px] w-fit truncate'
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default RepeatingContent;
