import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';
import { useDeleteThreads } from '@/features/thread/queries.ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/shadcn/tooltip.tsx';
import { Loader2, Trash2 } from 'lucide-react';
import React from 'react';
import { Progress } from '@/components/ui/shadcn/progress.tsx';
import { cn } from '@nextui-org/theme';

const ThreadsDeleteButton = () => {
  const [isOpened, setIsOpened] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { scenarioManipulation } = useThreadsFlow();
  const deleteThreads = useDeleteThreads();

  const selectedCount = scenarioManipulation.selectedThreads.length;

  const handleDelete = async () => {
    if (selectedCount === 0) return;

    setIsDeleting(true);
    try {
      await deleteThreads.mutateAsync(scenarioManipulation.selectedThreads);
      setIsOpened(false);
      scenarioManipulation.clearSelected();
    } finally {
      setIsDeleting(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened} modal={isOpened}>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            className='hover:bg-content3 bg-content2'
            disabled={selectedCount === 0}
            onClick={() => setIsOpened(true)}
          >
            <Trash2 className='size-4 flex-shrink-0' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete selected threads</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader className='text-4xl font-bold'>
          Delete threads
        </DialogHeader>
        <DialogDescription>
          Would you like to delete {selectedCount} thread
          {selectedCount === 1 ? '' : 's'}? Remember that proceeding threads
          will be deleted as well and this action cannot be reversed.
          <Progress
            value={progress}
            className={cn('mt-4', !isDeleting && 'invisible')}
          />
        </DialogDescription>
        <DialogDescription className='flex flex-row w-full gap-x-2 justify-end'>
          <Button
            variant='outline'
            onClick={() => setIsOpened(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          {isDeleting ? (
            <Button variant='destructive' disabled>
              <Loader2 className='size-5 animate-spin mr-2' />
              Deleting...
            </Button>
          ) : (
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadsDeleteButton;
