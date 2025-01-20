import { Branching } from '@/features/branching/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { RouteOff } from 'lucide-react';
import { useDeleteBranching } from '@/features/branching/queries.ts';
import { cn } from '@nextui-org/theme';
import TooltipButton from '@/components/ui/common/display/tooltip-button';

const DeleteBranchingDialog = ({
  branching,
  className,
}: {
  branching: Branching;
  className?: string;
}) => {
  const { open } = useDialog();
  const deteleBranching = useDeleteBranching();

  return (
    <TooltipButton
      tooltipClassName='bg-content1'
      variant='ghost'
      className={cn('border-1', className)}
      buttonChildren={<RouteOff />}
      onClick={() =>
        open({
          type: 'confirm',
          title: 'Remove branching',
          description:
            'Warning: This will permanently delete this branching and all its child threads. This action cannot be undone. If you wish to preserve the structure, consider editing the content instead.',
          variant: 'destructive',
          onConfirm: async () => {
            await deteleBranching.mutateAsync(branching.id);
          },
        })
      }
    >
      {_ => 'Delete branching'}
    </TooltipButton>
  );
};

export default DeleteBranchingDialog;
