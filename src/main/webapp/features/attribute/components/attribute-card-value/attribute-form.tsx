import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Control, ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';
import { Input } from '@/components/ui/shadcn/input.tsx';
import DateTimePicker from '@/components/ui/common/input/date-time-picker2';
import React from 'react';
import ToggleButton from '@/components/ui/common/input/toggle-button';
import { Checkbox } from '@/components/ui/shadcn/checkbox.tsx';

interface AttributeFormProperties {
  methods: UseFormReturn<AttributeTemplate>;
  attribute: AttributeTemplate;
  onSubmit: (data: AttributeTemplate) => Promise<void>;
}

const renderField = (
  type: AttributeTypeDisplay,
  field: ControllerRenderProps<AttributeTemplate, 'defaultValue'>,
  disabled: boolean,
) => {
  switch (type) {
    case AttributeTypeDisplay.INT: {
      return (
        <Input
          {...field}
          disabled={disabled}
          type='number'
          onChange={event => field.onChange(event.target.value)}
        />
      );
    }
    case AttributeTypeDisplay.STRING: {
      return <Input {...field} disabled={disabled} />;
    }

    case AttributeTypeDisplay.DATE: {
      return (
        // @ts-expect-error -- from external library
        <DateTimePicker
          field={{
            key: field.name,
            type: 'date',
            required: false,
          }}
          value={field.value}
          inputProps={{
            onChange: field.onChange,
            name: field.name,
          }}
          disabled={disabled}
        />
      );
    }
    case AttributeTypeDisplay.BOOL: {
      return (
        <div className='flex items-center gap-x-3'>
          State set to:
          <Checkbox
            disabled={disabled}
            checked={field.value === 'true'}
            onCheckedChange={checked =>
              field.onChange({
                target: {
                  name: 'defaultValue',
                  value: checked.toString(),
                },
              })
            }
          />
        </div>
      );
    }
  }
};

interface AttributeFormItemProperties {
  field: ControllerRenderProps<AttributeTemplate, 'defaultValue'>;
  type: AttributeTypeDisplay;
  control: Control;
}

export const AttributeFormItem = ({
  field,
  type,
}: AttributeFormItemProperties) => {
  const [isInputDisabled, setIsInputDisabled] = React.useState(
    field.value === '',
  );

  React.useEffect(() => {
    if (type === AttributeTypeDisplay.BOOL && !field.value) {
      field.onChange({ target: { name: 'defaultValue', value: 'false' } });
    }
  }, []);

  return (
    <FormItem className='space-y-2 py-1'>
      <FormLabel className='block text-sm font-medium'>
        Provide attribute value
      </FormLabel>
      <div className='flex items-center gap-2'>
        <FormControl>{renderField(type, field, isInputDisabled)}</FormControl>
        <ToggleButton
          pressed={isInputDisabled}
          onPressedChange={pressed => {
            setIsInputDisabled(pressed);
            if (pressed) {
              field.onChange({ target: { name: 'defaultValue', value: '' } });
            }
          }}
        >
          undefined
        </ToggleButton>
      </div>
      <FormMessage />
    </FormItem>
  );
};

const AttributeForm = ({ methods, attribute }: AttributeFormProperties) => {
  const { type, defaultValue } = attribute;
  const [isInputDisabled, setIsInputDisabled] = React.useState(
    defaultValue === '',
  );

  return (
    <FormField
      control={methods.control}
      name='defaultValue'
      render={({
        field,
      }: {
        field: ControllerRenderProps<AttributeTemplate, 'defaultValue'>;
      }) => {
        React.useEffect(() => {
          if (type === AttributeTypeDisplay.BOOL && !field.value) {
            field.onChange({
              target: { name: 'defaultValue', value: 'false' },
            });
          }
        }, []);

        return (
          <FormItem className='space-y-2 py-1'>
            <FormLabel className='block text-sm font-medium'>
              {attribute.name}
            </FormLabel>
            <div className='flex flex-col gap-y-6'>
              <FormControl>
                {renderField(type, field, isInputDisabled)}
              </FormControl>
              <ToggleButton
                pressed={isInputDisabled}
                onPressedChange={pressed => {
                  setIsInputDisabled(pressed);
                  if (pressed) {
                    field.onChange();
                  }
                }}
              >
                undefined
              </ToggleButton>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default AttributeForm;
