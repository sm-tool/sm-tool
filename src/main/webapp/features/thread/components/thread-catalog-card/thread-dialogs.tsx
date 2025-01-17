import { Thread } from '@/features/thread/types.ts';
import RudButtonGroup from '@/lib/actions/components/rud-button-group.tsx';
import useThreadActions from '@/features/thread/use-thread-actions.ts';

const ThreadDialogs = ({
  data,
  isOpenHidden = false,
}: {
  data: Thread;
  isOpenHidden?: boolean;
}) => {
  return (
    <RudButtonGroup
      className='bg-transparent border-none'
      actions={useThreadActions({ isOpenHidden })}
      item={data}
    />
  );
};

export default ThreadDialogs;
