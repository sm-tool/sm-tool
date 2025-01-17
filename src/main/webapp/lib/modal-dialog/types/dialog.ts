import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { WizardStep } from '@/components/ui/common/wizard';
import { ZodObjectOrWrapped } from '@autoform/zod';

export type BaseDialogType = 'confirm' | 'autoForm' | 'form' | 'wizard';

/**
 * Bazowa konfiguracja dialogu.
 * @param {BaseDialogType} type - Typ dialogu: 'confirm', 'autoForm', 'form' lub 'wizard'
 * @param {string} title - Tytuł wyświetlany w nagłówku dialogu
 * @param {React.ReactNode} [description] - Opcjonalny opis/treść dialogu
 */
export interface BaseDialogConfig {
  type: BaseDialogType;
  title: string;
  description?: React.ReactNode;
}

/**
 * Dialog potwierdzenia akcji.
 * @param {() => Promise<void>} onConfirm - Funkcja wywoływana po potwierdzeniu przez użytkownika
 * @param {'default' | 'destructive'} variant - Wariant stylistyczny przycisku potwierdzenia
 *
 * @example
 * const config: ConfirmDialogConfig = {
 *   type: 'confirm',
 *   title: 'Usuń element',
 *   description: 'Czy na pewno chcesz usunąć?',
 *   variant: 'destructive',
 *   onConfirm: async () => await deleteItem(id)
 * }
 */
export interface ConfirmDialogConfig extends BaseDialogConfig {
  type: 'confirm';
  onConfirm: () => Promise<void>;
  variant: 'default' | 'destructive';
}

/**
 * Dialog z automatycznie generowanym formularzem na podstawie schematu Zod.
 * @param {ZodObjectOrWrapped} zodObjectToValidate - Schema Zod do walidacji formularza
 * @param {Partial<TData>} [defaultValues] - Domyślne wartości pól formularza
 * @param {TData} [data] - Dane do wypełnienia formularza
 * @param {(data: TData) => Promise<void>} onSubmit - Funkcja wywoływana przy zapisie formularza
 *
 * @example
 * const config: AutoFormDialogConfig<UserData> = {
 *   type: 'autoForm',
 *   title: 'Dodaj użytkownika',
 *   zodObjectToValidate: userSchema,
 *   defaultValues: { name: '', email: '' },
 *   onSubmit: async (data) => await createUser(data)
 * }
 */
export interface AutoFormDialogConfig<TData extends Record<string, unknown>>
  extends BaseDialogConfig {
  type: 'autoForm';
  zodObjectToValidate: ZodObjectOrWrapped;
  defaultValues?: Partial<TData>;
  data?: TData;
  onSubmit: (data: TData) => Promise<void>;
}

/**
 * Dialog z ręcznie renderowanym formularzem.
 * @param {ZodObjectOrWrapped} schema - Schema Zod do walidacji
 * @param {Partial<TData>} [defaultValues] - Domyślne wartości pól
 * @param {TData} [data] - Dane do wypełnienia formularza
 * @param {(methods: UseFormReturn<TData>) => React.ReactNode} renderForm - Funkcja renderująca zawartość formularza
 * @param {(data: TData) => Promise<void>} onSubmit - Funkcja wywoływana przy zapisie
 *
 * @example
 * const config: FormDialogConfig<UserData> = {
 *   type: 'form',
 *   title: 'Edytuj użytkownika',
 *   schema: userSchema,
 *   renderForm: (methods) => (
 *     <FormField control={methods.control} name="name" />
 *   ),
 *   onSubmit: async (data) => await updateUser(data)
 * }
 */
export interface FormDialogConfig<TData extends FieldValues>
  extends BaseDialogConfig {
  type: 'form';
  schema: ZodObjectOrWrapped;
  defaultValues?: Partial<TData>;
  data?: TData;
  renderForm: (methods: UseFormReturn<TData>) => React.ReactNode;
  onSubmit: (data: TData) => Promise<void>;
}

/**
 * Dialog z formularzem wieloetapowym (kreator).
 * @param {WizardStep[]} steps - Tablica kroków kreatora
 * @param {Partial<TData>} [defaultValues] - Domyślne wartości wszystkich kroków
 * @param {(data: TData) => Promise<void>} onSubmit - Funkcja wywoływana po ukończeniu wszystkich kroków
 *
 * @example
 * const config: WizardFormDialogConfig<UserData> = {
 *   type: 'wizard',
 *   title: 'Kreator użytkownika',
 *   steps: [basicInfoStep, addressStep, preferencesStep],
 *   defaultValues: { name: '', address: '' },
 *   onSubmit: async (data) => await createUserWithSteps(data)
 * }
 */
export interface WizardFormDialogConfig<TData extends FieldValues>
  extends BaseDialogConfig {
  type: 'wizard';
  steps: WizardStep[];
  defaultValues?: Partial<TData>;
  onSubmit: (data: TData) => Promise<void>;
}

export type DialogConfig<TData = unknown> =
  | ConfirmDialogConfig
  | (TData extends FieldValues ? FormDialogConfig<TData> : never)
  | (TData extends FieldValues ? WizardFormDialogConfig<TData> : never)
  | (TData extends Record<string, unknown>
      ? AutoFormDialogConfig<TData>
      : never);
