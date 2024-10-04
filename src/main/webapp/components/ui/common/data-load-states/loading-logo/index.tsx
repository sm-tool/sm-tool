import { memo, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { array } from 'zod';

const ANIMATION_DELAY = 150;
const CYCLE_INTERVAL = 2000;
const MIN_BAR_WIDTH = 25;
const MAX_BAR_WIDTH = 50;

const LoadingIcon = () => {
  const [bars, setBars] = useState<{ width: number; y: number }[]>([]);

  const generateBars = useCallback(() => {
    // TODO może się bugować w zależności od użycia, o ile się da tweakować consty, albo dać argumenty do svg
    const heights = [10, 40, 70];
    let remainingWidth = 100;

    return heights
      .sort(() => Math.random() - 0.5)
      .map((y, index) => {
        const width =
          index === array.length
            ? remainingWidth
            : Math.floor(
                Math.random() *
                  (Math.min(MAX_BAR_WIDTH, remainingWidth - MIN_BAR_WIDTH) -
                    MIN_BAR_WIDTH),
              ) + MIN_BAR_WIDTH;
        remainingWidth -= width;
        return { width, y };
      });
  }, []);

  const animationCycle = useCallback(() => {
    const newBars = generateBars();
    setBars([]);
    for (const [index, bar] of newBars.entries()) {
      window.setTimeout(() => {
        setBars(previous => [...previous, bar]);
      }, index * ANIMATION_DELAY);
    }
  }, [generateBars]);

  useLayoutEffect(() => {
    animationCycle();
    const interval = window.setInterval(animationCycle, CYCLE_INTERVAL);
    return () => window.clearInterval(interval);
  }, [animationCycle]);

  // TODO
  const nieMamPojeciaJakToLepiejWyskalowac = useMemo(
    () => (
      <>
        <AnimatePresence>
          {bars.map((bar, index) => (
            <motion.rect
              key={`${index}-${bar.width}-${bar.y}`}
              x={bars
                .slice(0, index)
                .reduce(
                  (accumulator, current) => accumulator + current.width,
                  0,
                )}
              y={bar.y}
              width={bar.width}
              height='20'
              rx='3'
              ry='3'
              fill='url(#gradient)'
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{
                scaleX: { duration: 0.4, ease: 'easeOut' },
                opacity: { duration: 0.3 },
              }}
            />
          ))}
        </AnimatePresence>
        <defs>
          <linearGradient id='gradient' x1='0%' y1='100%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#ffa400' />
            {/* brand-480-ish*/}
            <stop offset='100%' stopColor=' #ffc300' />
            {/* brand-400 */}
          </linearGradient>
        </defs>
      </>
    ),
    [bars],
  );

  return (
    <div className='h-16 w-16 rounded-lg bg-default-100 p-2'>
      <svg viewBox='0 0 100 100'>{nieMamPojeciaJakToLepiejWyskalowac}</svg>
    </div>
  );
};

export default memo(LoadingIcon);
