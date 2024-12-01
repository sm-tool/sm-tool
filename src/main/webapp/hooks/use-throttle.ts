import { useEffect, useRef, useState } from 'react';

const useThrottle = <T>(value: T, interval = 16) => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const handler = globalThis.window.setTimeout(() => {
      if (now >= lastExecuted.current + interval) {
        setThrottledValue(value);
        lastExecuted.current = now;
      }
    }, interval);

    return () => globalThis.window.clearTimeout(handler);
  }, [value, interval]);

  return throttledValue;
};

export default useThrottle;
