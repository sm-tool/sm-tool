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
import { Textarea } from '@/components/ui/shadcn/text-area.tsx';
import ColorPicker from '../../common/input/color-picker';
import ObjectTypeSelectDialog from '@/features/object-type/components/object-type-tree/object-type-select-dialog.tsx';
import DateTimePicker from '../../common/input/date-time-picker2';
import ObjectTemplatePicker from '@/features/object-template/components/object-template-picker';

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
  textAreaString: ({ inputProps }: AutoFormFieldProps) => {
    const { key, ...inputPropsWithoutKey } = inputProps || {};
    return <Textarea {...inputPropsWithoutKey} />;
  },
  color: ({ inputProps, value }: AutoFormFieldProps) => {
    const { key, ...inputPropsWithoutKey } = inputProps || {};
    return <ColorPicker {...inputPropsWithoutKey} value={value} />;
  },
  hidden: ({ inputProps, value }: AutoFormFieldProps) => (
    <input type='hidden' {...inputProps} value={value} />
  ),
  objectTypeReference: ({ inputProps, value }: AutoFormFieldProps) => {
    const { key, ...inputPropsWithoutKey } = inputProps || {};
    return <ObjectTypeSelectDialog {...inputPropsWithoutKey} value={value} />;
  },
  objectTemplateReferene: ({ inputProps, value }: AutoFormFieldProps) => {
    const { key, ...inputPropsWithoutKey } = inputProps || {};
    return <ObjectTemplatePicker {...inputPropsWithoutKey} value={value} />;
  },
  dateTime: DateTimePicker,
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
      // @ts-expect-error -- added issue to lib to add support for disabling form items
      formComponents={{
        ...defaultFormFieldComponents,
        ...ShadcnAutoFormFieldComponents,
        ...formComponents,
      }}
    />
  );
}
