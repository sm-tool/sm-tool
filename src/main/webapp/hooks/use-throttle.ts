import React, { useEffect, useRef, useState } from 'react';

const useThrottle = <T>(
  value: T,
  initialInterval = 100,
  options?: {
    minInterval?: number;
    decreaseStep?: number;
  },
) => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [currentInterval, setCurrentInterval] = useState(initialInterval);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const handler = globalThis.setTimeout(() => {
      if (now >= lastExecuted.current + currentInterval) {
        setThrottledValue(value);
        lastExecuted.current = now;

        if (options?.minInterval && options.decreaseStep) {
          setCurrentInterval(previous =>
            Math.max(options.minInterval!, previous - options.decreaseStep!),
          );
        }
      }
    }, currentInterval);

    return () => {
      globalThis.clearTimeout(handler);
      setCurrentInterval(initialInterval);
    };
  }, [value, currentInterval, options]);

  return throttledValue;
};

export const useThrottleCallback = <
  T extends (...arguments_: unknown[]) => void,
>(
  callback: T,
  initialInterval = 100,
  options?: {
    minInterval?: number;
    decreaseStep?: number;
  },
) => {
  const [currentInterval, setCurrentInterval] = useState(initialInterval);
  const lastExecuted = useRef(Date.now());

  return React.useCallback(
    (...arguments_: Parameters<T>) => {
      const now = Date.now();
      if (now >= lastExecuted.current + currentInterval) {
        callback(...arguments_);
        lastExecuted.current = now;
        if (options?.minInterval && options.decreaseStep) {
          setCurrentInterval(previous =>
            Math.max(options.minInterval!, previous - options.decreaseStep!),
          );
        }
      }
    },
    [callback, currentInterval, options],
  );
};

export default useThrottle;
