import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AppError, ErrorLevel } from '@/types/errors.ts';

interface UpdateMutationContext<TData> {
  previousData: TData | undefined;
}

type QueryKeys = {
  detail: (id: number) => Array<string | number>;
  list: (parameters?: object) => Array<string | number | object | undefined>;
};

// FOR TYPICAL CRUD ONLY
const createUpdateMutation = <TData>(
  key: string,
  mutationFunction: (id: number, data: Partial<TData>) => Promise<TData>,
  queryKeys: QueryKeys,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    TData,
    Error,
    { id: number; data: Partial<TData> },
    UpdateMutationContext<TData>
  >({
    mutationFn: ({ id, data }) => mutationFunction(id, data),

    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.list() });
      const previousData = queryClient.getQueryData<TData>(queryKeys.list());
      queryClient.setQueryData(queryKeys.list(), { ...previousData, ...data });
      return { previousData };
    },

    onSuccess: () => {
      toast.success(`${key} updated`);
    },

    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([key, _.id], context.previousData);
      }
      throw new AppError(error.message, ErrorLevel.WARNING);
    },

    onSettled: (_, __, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.list() });
    },
  });
};

export default createUpdateMutation;
