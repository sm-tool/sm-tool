import React from 'react';
import { DialogConfig } from '@/lib/modal-dialog/types/dialog.ts';
/**
 * Kontekst Reacta do zarządzania dialogami w aplikacji.
 *
 * @param {function} open - Funkcja otwierająca dialog z przekazaną konfiguracją
 * @param {function} close - Funkcja zamykająca aktualnie otwarty dialog
 * @param {boolean} isOpen - Flaga wskazująca czy jakikolwiek dialog jest otwarty
 * @param {function} isActiveDialog - Funkcja sprawdzająca czy dialog o podanym ID jest aktywny
 * @param {DialogConfig} [currentConfig] - Konfiguracja aktualnie otwartego dialogu
 *
 * @example
 * const { open, close } = useContext(DialogContext);
 *
 * open<UserData>({
 *   type: 'form',
 *   title: 'Edycja użytkownika',
 *   schema: userSchema,
 *   onSubmit: async (data) => {
 *     await updateUser(data);
 *     close();
 *   }
 * });
 */
interface DialogContextValue {
  open: <TData>(config: DialogConfig<TData>) => void;
  close: () => void;
  isOpen: boolean;
  isActiveDialog: (dialogId: string) => boolean;
  // eslint-disable-next-line -- ts aint smart enough
  currentConfig?: DialogConfig<any>;
}

export const DialogContext = React.createContext<
  DialogContextValue | undefined
>(undefined);
