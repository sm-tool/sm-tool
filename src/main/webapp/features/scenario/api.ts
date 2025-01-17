import {
  Scenario,
  ScenarioApiFilterMethods,
  scenarioDTO,
  scenarioFormDTO,
  ScenarioFormType,
} from '@/features/scenario/types.ts';
import { API_INSTANCE, apiClient } from '@/lib/api';
import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';

type HalScenarioResponse = HalPaginatedResponse<Scenario, 'scenario'>;

export const scenarioApi = {
  getAll: async (
    request?: QueryRequest<Scenario, ScenarioApiFilterMethods>,
  ): Promise<HalScenarioResponse> => {
    let endpoint = '/scenarios';
    const queryParameters: Record<string, string | number> = {};

    if (request?.pagination) {
      queryParameters.page = request.pagination.page;
      queryParameters.size = request.pagination.size;
    }

    if (request?.sort?.sort.length) {
      queryParameters.sort = request.sort.sort
        .map(({ field, direction }) => `${field},${direction}`)
        .join(',');
    }

    if (request?.filter?.searchType && request.filter.searchValue) {
      endpoint = `/scenarios/search/${request.filter.searchType}`;
      queryParameters[
        request.filter.searchType === 'findByTitle' ? 'title' : 'description'
      ] = request.filter.searchValue;
    }

    return apiClient<HalScenarioResponse>({
      method: 'GET',
      url: endpoint,
      params: queryParameters,
    });
  },

  getOne: async (scenarioId: number) => {
    const { data } = await API_INSTANCE.get<Scenario>(
      `/scenarios/${scenarioId}`,
    );
    return scenarioDTO.parse(data);
  },

  create: async (scenario: ScenarioFormType) => {
    const validScenario = scenarioFormDTO.parse(scenario);
    const { data } = await API_INSTANCE.post<ScenarioFormType>(
      '/scenarios',
      validScenario,
    );
    return scenarioDTO.parse(data);
  },

  update: async (id: number, scenario: Partial<ScenarioFormType>) => {
    const validScenario = scenarioFormDTO.parse(scenario);
    const { data } = await API_INSTANCE.put<ScenarioFormType>(
      `/scenarios/${id}`,
      validScenario,
    );
    return scenarioDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`/scenarios/${id}`);
  },
};
