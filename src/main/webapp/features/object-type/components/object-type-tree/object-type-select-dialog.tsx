import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import ObjectTypeTree from '@/features/object-type/components/object-type-tree/index.tsx';
import { useObjectType } from '@/features/object-type/queries.ts';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CreateNewObjectButton } from '@/app/home/_layout/catalog/_layout/types';

interface ObjectTypeSelectDialogProperties
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  value: number | undefined;
  onChange?: (event: { target: { value?: number; name?: string } }) => void;
  globalsBlocked?: boolean;
}

const ObjectTypeSelectDialog = React.forwardRef<
  HTMLInputElement,
  ObjectTypeSelectDialogProperties
  // @ts-expect-error -- neccesary for forwardReference
>((properties, reference) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<number | undefined>(
    properties.value,
  );

  React.useEffect(() => {
    setSelectedValue(properties.value);
  }, [properties.value]);

  const objectType = useObjectType(selectedValue ?? 0, {
    enabled: selectedValue !== undefined && selectedValue > 0,
  });

  const handleChange = (newValue?: number) => {
    setSelectedValue(newValue);
    properties.onChange?.({
      target: {
        value: newValue,
        name: properties.name,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          {objectType.data?.title ?? 'Select object type'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle>Select object type</DialogTitle>
        </DialogHeader>

        <CreateNewObjectButton variant='outline' />
        <ObjectTypeTree
          globalsBlocked={properties.globalsBlocked}
          value={selectedValue}
          onChange={value => {
            handleChange(value);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
});

ObjectTypeSelectDialog.displayName = 'ObjectTypeSelectDialog';

export default ObjectTypeSelectDialog;
