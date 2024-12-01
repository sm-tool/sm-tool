import {
  Scenario,
  ScenarioDTO,
  ScenarioForm,
  scenarioFormDTO,
} from '@/features/scenario/types.ts';
import { API_INSTANCE, apiClient } from '@/lib/api';
import {
  DefaultPaginatedParameters,
  getDefaultPaginatedParameters,
} from '@/lib/pagination/types';
import { PaginatedResponse } from '@/lib/pagination/types/pagination.ts';

export const scenarioApi = {
  getAll: async (
    parameters: DefaultPaginatedParameters<Scenario>,
  ): Promise<PaginatedResponse<Scenario>> => {
    const { filter, ...paginationParameters } = parameters;

    const endpoint = filter?.searchQuery
      ? `/scenario/search/${filter.searchType === 'description' ? 'findByDescription' : 'findByTitle'}`
      : '/scenario/list';

    const parameters_ = {
      ...getDefaultPaginatedParameters(paginationParameters),
      ...(filter?.searchQuery && {
        [filter.searchType || 'title']: filter.searchQuery,
      }),
    };

    return apiClient<PaginatedResponse<Scenario>>({
      method: 'GET',
      url: endpoint,
      params: parameters_,
    });
  },

  getOne: async () => {
    const { data } = await API_INSTANCE.get<Scenario>(`/scenario/one`);
    return ScenarioDTO.parse(data);
  },

  create: async (scenario: ScenarioForm) => {
    const validScenario = scenarioFormDTO.parse(scenario);
    const { data } = await API_INSTANCE.post<ScenarioForm>(
      '/scenario',
      validScenario,
    );
    return ScenarioDTO.parse(data);
  },

  update: async (id: number, scenario: Partial<ScenarioForm>) => {
    const validScenario = scenarioFormDTO.parse(scenario);
    const { data } = await API_INSTANCE.put<ScenarioForm>(
      `/scenario/${id}`,
      validScenario,
    );
    return ScenarioDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`/scenarios/${id}`);
  },
};
