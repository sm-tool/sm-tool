import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { AttributeChange } from '@/features/attribute-changes/types.ts';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';
import { Input } from '@/components/ui/shadcn/input.tsx';
import DateTimePicker from '@/components/ui/common/input/date-time-picker2';
import React from 'react';
import { Switch } from '@/components/ui/shadcn/switch.tsx';
import { Label } from '@/components/ui/shadcn/label.tsx';

interface AttributeChangeFormProperties {
  methods: UseFormReturn<AttributeChange>;
  attribute: AttributeTemplate;
  onSubmit: (data: AttributeChange) => void;
  onClose: () => void;
}

const renderField = (
  type: AttributeTypeDisplay,
  field: ControllerRenderProps<AttributeChange, 'changeType.to'>,
) => {
  switch (type) {
    case AttributeTypeDisplay.INT: {
      return (
        <Input
          {...field}
          type='number'
          value={field.value || ''}
          onChange={event => field.onChange(event.target.value)}
        />
      );
    }
    case AttributeTypeDisplay.STRING: {
      return <Input {...field} value={field.value || ''} />;
    }
    case AttributeTypeDisplay.DATE: {
      return (
        <DateTimePicker
          // @ts-expect-error -- TODO poprawic te typowanie
          field={{
            key: field.name,
          }}
          value={field.value || ''}
          inputProps={{
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(event.target.value);
            },
            name: field.name,
          }}
        />
      );
    }
    case AttributeTypeDisplay.BOOL: {
      return (
        <Switch
          className='ml-4'
          checked={field.value === 'true'}
          onCheckedChange={checked => field.onChange(checked.toString())}
        />
      );
    }
  }
};

const AttributeChangeForm = ({
  methods,
  attribute,
  onSubmit,
  onClose,
}: AttributeChangeFormProperties) => {
  const previousValue = methods.getValues().changeType.from;

  return (
    <DialogContent>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Change attribute state</DialogTitle>
            <DialogDescription>
              To what state should attribute value change?
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label>Previous value</Label>
              <div className='mt-1 text-sm text-muted-foreground'>
                {previousValue || 'No value set'}
              </div>
            </div>

            <div>
              <Label>Default value</Label>
              <div className='mt-1 text-sm text-muted-foreground'>
                {attribute.defaultValue || 'No default value'}
              </div>
            </div>

            <FormField
              control={methods.control}
              name='changeType.to'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New value for {attribute.name}</FormLabel>
                  <FormControl>
                    {renderField(attribute.type, field)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className='mt-8'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AttributeChangeForm;
