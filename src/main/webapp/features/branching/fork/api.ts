import {
  ForkCreateRequest,
  forkCreateRequestDTO,
  ForkUpdateRequest,
  forkUpdateRequestDTO,
} from '@/features/branching/fork/types.ts';
import { API_INSTANCE } from '@/lib/api';

const endpoint = 'branchings/fork';

export const branchingForkApi = {
  createForkCreateRequest: async (forkCreateRequest: ForkCreateRequest) => {
    const validCreate = forkCreateRequestDTO.parse(forkCreateRequest);
    return await API_INSTANCE.post<ForkCreateRequest>(endpoint, validCreate);
  },

  updateForkCreateRequest: async (
    branchingId: number,
    forkUpdateRequest: ForkUpdateRequest,
  ) => {
    const validUpdate = forkUpdateRequestDTO.parse(forkUpdateRequest);
    return await API_INSTANCE.put<ForkUpdateRequest>(
      `${endpoint}/${branchingId}`,
      validUpdate,
    );
  },

  deleteForkCreateRequest: async (branchingId: number) => {
    return await API_INSTANCE.delete(`${endpoint}/${branchingId}`);
  },
};
