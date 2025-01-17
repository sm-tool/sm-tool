import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Ban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button.tsx';
import React, { ButtonHTMLAttributes } from 'react';
import { useCreateObjectInstance } from '@/features/object-instance/queries.ts';
import AddObjectForm from '@/features/object-instance/components/add-object-form';
import { cn } from '@nextui-org/theme';

interface AddObjectDialogProperties
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  threadId: number;
}

const AddObjectDialog = React.forwardRef<
  HTMLDivElement,
  AddObjectDialogProperties
>(({ threadId, ...properties }, reference) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutateAsync } = useCreateObjectInstance();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className={cn('gap-x-2', properties.className)}
          {...properties}
        >
          {properties.disabled ? (
            <>
              <Ban className='size-5 flex-shrink-0' />
              Forked or merged threads cannot instantiate new objects
            </>
          ) : (
            <>
              <Plus className='size-5 flex-shrink-0' />
              Add new object to thread
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl' ref={reference}>
        <DialogHeader>
          <DialogTitle>Add New Object</DialogTitle>
          <DialogDescription>
            Create a new object by following the steps below
          </DialogDescription>
        </DialogHeader>
        <AddObjectForm
          isActive={isDialogOpen}
          isLoading={isLoading}
          threadId={threadId}
          onSucces={async data => {
            setIsLoading(true);
            try {
              await mutateAsync(data);
              setIsDialogOpen(false);
            } finally {
              setIsLoading(false);
            }
          }}
          onCancel={() => {
            setIsDialogOpen(false);
            setIsLoading(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
});

AddObjectDialog.displayName = 'AddObjectDialog';
export default AddObjectDialog;
