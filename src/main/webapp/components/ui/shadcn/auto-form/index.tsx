'use client';

import { DefaultValues, FormState, useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import AutoFormObject from './fields/object';
import { Dependency, FieldConfig } from './types';
import {
  getDefaultValues,
  getObjectFormSchema,
  ZodObjectOrWrapped,
} from './utils';
import { Button } from '@/components/ui/shadcn/button';
import { Form } from '@/components/ui/shadcn/form';
import { cn } from '@nextui-org/theme';
import { useEffect } from 'react';

export function AutoFormSubmit({
  children,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button type='submit' disabled={disabled} className={className}>
      {children ?? 'Submit'}
    </Button>
  );
}

function AutoForm<SchemaType extends ZodObjectOrWrapped>({
  formSchema,
  values: valuesProperty,
  onValuesChange: onValuesChangeProperty,
  onParsedValuesChange,
  onSubmit: onSubmitProperty,
  fieldConfig,
  children,
  className,
  dependencies,
}: {
  formSchema: SchemaType;
  values?: Partial<z.infer<SchemaType>>;
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onSubmit?: (values: z.infer<SchemaType>) => void;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  children?:
    | React.ReactNode
    | ((formState: FormState<z.infer<SchemaType>>) => React.ReactNode);
  className?: string;
  dependencies?: Dependency<z.infer<SchemaType>>[];
}) {
  const objectFormSchema = getObjectFormSchema(formSchema);
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> | null =
    getDefaultValues(objectFormSchema, fieldConfig);

  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? undefined,
    values: valuesProperty,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onSubmitProperty?.(parsedValues.data);
    }
  }

  const values = form.watch();
  // valuesString is needed because form.watch() returns a new object every time
  const valuesString = JSON.stringify(values);

  useEffect(() => {
    onValuesChangeProperty?.(values);
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onParsedValuesChange?.(parsedValues.data);
    }
  }, [valuesString]);

  const renderChildren =
    typeof children === 'function'
      ? children(form.formState as FormState<z.infer<SchemaType>>)
      : children;

  return (
    <div className='w-full'>
      <Form {...form}>
        <form
          onSubmit={event => {
            form.handleSubmit(onSubmit)(event);
          }}
          className={cn('space-y-5', className)}
        >
          <AutoFormObject
            schema={objectFormSchema}
            form={form}
            dependencies={dependencies}
            fieldConfig={fieldConfig}
          />

          {renderChildren}
        </form>
      </Form>
    </div>
  );
}

export default AutoForm;
