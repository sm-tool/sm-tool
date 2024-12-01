import React from 'react';
import { DialogConfig } from '@/lib/modal-dialog/types/dialog.ts';

interface DialogContextValue {
  open: <TData>(config: DialogConfig<TData>) => void;
  close: () => void;
  isOpen: boolean;
  // eslint-disable-next-line -- ts aint smart enough
  currentConfig?: DialogConfig<any>;
}

export const DialogContext = React.createContext<
  DialogContextValue | undefined
>(undefined);
