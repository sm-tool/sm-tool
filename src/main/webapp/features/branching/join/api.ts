import { API_INSTANCE } from '@/lib/api';
import {
  JoinCreateRequest,
  joinCreateRequestDTO,
  JoinUpdateRequest,
  joinUpdateRequestDTO,
} from '@/features/branching/join/types.ts';

const endpoint = 'branchings/join';

export const branchingJoinApi = {
  createJoinCreateRequest: async (joinCreateRequest: JoinCreateRequest) => {
    const validCreate = joinCreateRequestDTO.parse(joinCreateRequest);
    return await API_INSTANCE.post<JoinCreateRequest>(endpoint, validCreate);
  },

  updateJoinCreateRequest: async (
    branchingId: number,
    joinUpdateRequest: JoinUpdateRequest,
  ) => {
    const validUpdate = joinUpdateRequestDTO.parse(joinUpdateRequest);
    return await API_INSTANCE.put<JoinCreateRequest>(
      `${endpoint}/${branchingId}`,
      validUpdate,
    );
  },

  deleteJoinCreateRequest: async (branchingId: number) => {
    return await API_INSTANCE.delete(`${endpoint}/${branchingId}`);
  },
};
