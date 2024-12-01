import { AppError } from '@/types/errors.ts';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ErrorContextValue {
  lastError: AppError | undefined;
  setLastError: (error: AppError | undefined) => void;
}

export const ErrorContext = createContext<ErrorContextValue | undefined>(
  undefined,
);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [lastError, setLastError] = useState<AppError | undefined>();

  return (
    <ErrorContext.Provider value={{ lastError, setLastError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used withing ErrorProvider');
  }
  return context;
};
