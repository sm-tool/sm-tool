import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = globalThis.window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      globalThis.window.clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
