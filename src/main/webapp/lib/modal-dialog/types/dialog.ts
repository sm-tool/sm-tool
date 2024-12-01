import { AnyZodObject } from 'zod';

export type BaseDialogType = 'confirm' | 'autoForm';

export interface BaseDialogConfig {
  type: BaseDialogType;
  title: string;
  description?: string;
}

export interface ConfirmDialogConfig extends BaseDialogConfig {
  type: 'confirm';
  onConfirm: () => Promise<void>;
  variant: 'default' | 'destructive';
}

// Szczerze nie chce mi się dopisywać do typu o tej 02:17 ale mniej więcej
//~! Autoform po prostu zakłada od nas obiektu z rekordami, ale jako żem
// Tam wchodzą typy rekurencyjne to sprawdzanie można sobie totalnie odpuścić
// bo to jest na tyle (nie) mądre, że poradzi sobie ze wszystkim
// ale jak nas prosi to trzeba dać (a nie dawać wszędzie @ts-ignore)
export interface AutoFormDialogConfig<TData extends Record<string, unknown>>
  extends BaseDialogConfig {
  type: 'autoForm';
  zodObjectToValidate: AnyZodObject;
  data?: TData;
  onSubmit: (data: TData) => Promise<void>;
}

export type DialogConfig<TData = unknown> =
  | ConfirmDialogConfig
  | (TData extends Record<string, unknown>
      ? AutoFormDialogConfig<TData>
      : never);
