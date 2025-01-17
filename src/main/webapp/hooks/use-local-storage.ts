import React from 'react';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = globalThis.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(
        'Error reading from localStorage, redirecting to default:',
        error,
      );
      return defaultValue;
    }
  });

  React.useEffect(() => {
    try {
      globalThis.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};
