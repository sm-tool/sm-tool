import { ScenarioFormType } from '@/features/scenario/types.ts';
import { API_INSTANCE } from '@/lib/api';
import {
  ScenarioPhase,
  scenarioPhaseDTO,
  ScenarioPhaseForm,
  scenarioPhaseFormDTO,
} from '@/features/scenario-phase/types.ts';

const endpoint = 'scenario-phases';

// REQUIRES scenarioId IN HEADER
export const scenarioPhaseApi = {
  getAll: async () => {
    const { data } = await API_INSTANCE.get<ScenarioPhase[]>(endpoint);
    return data.map(element => scenarioPhaseDTO.parse(element));
  },

  create: async (phase: ScenarioPhaseForm) => {
    const validPhase = scenarioPhaseFormDTO.parse(phase);
    const { data } = await API_INSTANCE.post<ScenarioFormType>(
      `/${endpoint}`,
      validPhase,
    );
    return scenarioPhaseDTO.parse(data);
  },

  update: async (id: number, phase: ScenarioPhase) => {
    const validPhase = scenarioPhaseDTO.parse(phase);
    const { data } = await API_INSTANCE.put<ScenarioPhase>(
      `/${endpoint}/${id}`,
      validPhase,
    );
    return scenarioPhaseDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`/${endpoint}/${id}`);
  },
};
