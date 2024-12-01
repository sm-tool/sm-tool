/* eslint-disable -- not my lib */
import {
  AutoForm as BaseAutoForm,
  AutoFormFieldProps,
  AutoFormUIComponents,
} from '@autoform/react';
import { AutoFormProps } from './types';
import { Form } from './components/form';
import { FieldWrapper } from './components/field-wrapper';
import { ErrorMessage } from './components/error-message';
import { SubmitButton } from './components/submit-button';
import { StringField } from './components/string-field';
import { NumberField } from './components/number-field';
import { BooleanField } from './components/boolean-field';
import { DateField } from './components/date-field';
import { SelectField } from './components/select-field';
import { ObjectWrapper } from './components/object-wrapper';
import { ArrayWrapper } from './components/array-wrapper';
import { ArrayElementWrapper } from './components/array-element-wrapper';
import { DateTimePicker } from '@/components/ui/shadcn/date-time-picker.tsx';
import { Textarea } from '@/components/ui/shadcn/text-area.tsx';

const ShadcnUIComponents: AutoFormUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
  ObjectWrapper,
  ArrayWrapper,
  ArrayElementWrapper,
};
export const ShadcnAutoFormFieldComponents = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,
} as const;
export type FieldTypes = keyof typeof ShadcnAutoFormFieldComponents;

// important!: DO NOT DELETE, TYPE DEFFINITION
const defaultFormFieldComponents = {
  dateTime: ({ value }: AutoFormFieldProps) => <DateTimePicker value={value} />,
  textAreaString: ({ value }: AutoFormFieldProps) => <Textarea value={value} />,
};

export function AutoForm<T extends Record<string, any>>({
  uiComponents,
  formComponents,
  ...props
}: AutoFormProps<T>) {
  return (
    <BaseAutoForm
      {...props}
      uiComponents={{
        ...ShadcnUIComponents,
        ...uiComponents,
      }}
      formComponents={{
        ...defaultFormFieldComponents,
        ...ShadcnAutoFormFieldComponents,
        ...formComponents,
      }}
    />
  );
}
