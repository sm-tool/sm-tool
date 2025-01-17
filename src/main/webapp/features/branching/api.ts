import { API_INSTANCE } from '@/lib/api';
import {
  Branching,
  branchingDTO,
  BranchingForm,
  branchingFormDTO,
} from '@/features/branching/types.ts';

const endpoint = 'branchings';

// REQUIRES scenarioId IN HEADER
export const branchingApi = {
  getAll: async () => {
    const { data } = await API_INSTANCE.get<Branching[]>(endpoint);
    return data.map(element => branchingDTO.parse(element));
  },

  getOne: async (branchingId: number) => {
    const { data } = await API_INSTANCE.get<Branching>(
      `${endpoint}/${branchingId}`,
    );
    return branchingDTO.parse(data);
  },

  create: async (branching: BranchingForm) => {
    const validBranch = branchingFormDTO.parse(branching);
    const { data } = await API_INSTANCE.post<BranchingForm>(
      endpoint,
      validBranch,
    );
    return branchingDTO.parse(data);
  },

  update: async (id: number, branching: Branching) => {
    const validBranching = branchingDTO.parse(branching);
    const { data } = await API_INSTANCE.put<Branching>(
      `${endpoint}/${id}`,
      validBranching,
    );
    return branchingDTO.parse(data);
  },

  delete: async (id: number) => {
    return await API_INSTANCE.delete<Branching>(`${endpoint}/${id}`);
  },
};
