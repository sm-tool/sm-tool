import React from 'react';

export const dispatchStorageEvent = (key: string, newValue: string) => {
  const event = new StorageEvent('storage', {
    key,
    newValue,
  });
  globalThis.dispatchEvent(event);
};

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
      const valueToStore = JSON.stringify(storedValue);
      globalThis.localStorage.setItem(key, valueToStore);
      dispatchStorageEvent(key, valueToStore);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};

// eslint-disable-next-line -- TType is more readable
export const useLocalStorageListener = <T>(
  key: string,
  callback: (value: T | null) => void,
) => {
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue
            ? (JSON.parse(event.newValue) as T)
            : null;
          callback(newValue);
        } catch (error) {
          console.error('Error parsing localStorage value:', error);
        }
      }
    };
    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, [key, callback]);
};
