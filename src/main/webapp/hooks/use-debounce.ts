import React, { useEffect, useState } from 'react';

export type Timeout = ReturnType<typeof globalThis.setTimeout>;

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = globalThis.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      globalThis.clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedCallback = <
  T extends (...arguments_: unknown[]) => unknown,
>(
  callback: T,
  delay = 500,
) => {
  const timeoutReference = React.useRef<Timeout>();

  return React.useCallback(
    (...arguments_: Parameters<T>) => {
      if (timeoutReference.current) {
        globalThis.clearTimeout(timeoutReference.current);
      }

      timeoutReference.current = globalThis.setTimeout(() => {
        callback(...arguments_);
      }, delay);
    },
    [callback, delay],
  );
};
