/* eslint-disable -- TODO kiedyś to naprawie */

import { z } from 'zod';
import useFormStore from '@/stores/form';
import { Button } from '@/components/ui/shadcn/button';
import { Slot } from '@radix-ui/react-slot';
import { ButtonHTMLAttributes, forwardRef, MouseEvent } from 'react';

interface EditFormItemButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  schema: z.ZodObject<any>;
  data: any;
  asChild?: boolean;
}

const EditFormItemButton = forwardRef<
  HTMLButtonElement,
  EditFormItemButtonProperties
>(({ schema, data, asChild = false, onClick, ...properties }, reference) => {
  const createEditForm = useFormStore(state => state.createEditForm);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    createEditForm(schema, data);
    onClick?.(event);
  };

  const Comp = asChild ? Slot : Button;

  return (
    <Comp onClick={handleClick} ref={reference} {...properties}>
      {properties.children || 'Edit in new tab'}
    </Comp>
  );
});
EditFormItemButton.displayName = 'EditFormItemButton';

export default EditFormItemButton;
