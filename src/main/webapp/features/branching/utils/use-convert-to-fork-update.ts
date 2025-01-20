import { Branching } from '@/features/branching/types.ts';
import { ForkUpdateRequest } from '@/features/branching/fork/types.ts';
import { useBranchingThreads } from '@/features/branching/queries.ts';
import { Thread } from '@/features/thread/types.ts';

export const useConvertToForkUpdate = (
  branching: Branching,
): ForkUpdateRequest | null => {
  const threads = useBranchingThreads('outgoing', branching.id);

  // not a fork
  if (branching.objectTransfer?.length === 0 || !branching.objectTransfer)
    return null;

  return {
    title: branching.title,
    description: branching.description,
    // @ts-expect-error -- not a fork
    offsprings: threads
      .map(query => query.data)
      .filter((thread): thread is Thread => Boolean(thread))
      .map(thread => ({
        title: thread.title,
        description: thread.description,
        transfer: branching.objectTransfer?.find(
          transfer => transfer.id === thread.id,
        ),
      })),
  };
};
