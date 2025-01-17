import React from 'react';
import { DialogContext } from '../context';
/**
 * Hook umożliwiający dostęp do kontekstu dialogów w aplikacji.
 *
 * @throws {Error} Wyrzuca błąd jeśli hook zostanie użyty poza komponentem DialogProvider
 *
 * @example
 * const dialog = useDialog();
 *
 * dialog.openDialog({
 *   type: 'confirm',
 *   title: 'Potwierdzenie',
 *   description: 'Czy chcesz kontynuować?',
 *   variant: 'default',
 *   onConfirm: async () => console.log('Potwierdzono')
 * });
 */
const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export default useDialog;
