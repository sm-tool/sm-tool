import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import {
  ObjectType,
  ObjectTypeApiFilterMethods,
  ObjectTypeAssigment,
  objectTypeDTO,
  ObjectTypeForm,
  objectTypeFormDTO,
  objectTypeUpdateFormDTO,
} from '@/features/object-type/types.ts';
import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import { API_INSTANCE, apiClient } from '@/lib/api';

export type HalObjectTypeResponse = HalPaginatedResponse<
  ObjectType,
  'qdsObjectTypes'
>;

export const objectTypeApi = {
  getAll: async (
    request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
  ): Promise<HalObjectTypeResponse> => {
    let endpoint = 'object-types';
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
      endpoint = `/object-types/search/${request.filter.searchType}`;
      queryParameters[
        request.filter.searchType === 'findByTitle' ? 'title' : 'description'
      ] = request.filter.searchValue;
    }

    return apiClient<HalObjectTypeResponse>({
      method: 'GET',
      url: endpoint,
      params: queryParameters,
    });
  },

  getAllHeaderless: async (
    scenarioId: number,
    request?: QueryRequest<ObjectType, ObjectTypeApiFilterMethods>,
  ): Promise<HalObjectTypeResponse> => {
    const queryParameters: Record<string, number> = {};

    if (request?.pagination) {
      queryParameters.page = request.pagination.page;
      queryParameters.size = request.pagination.size;
    }

    const endpoint = `/object-types/findByScenarioId/${scenarioId}`;

    return apiClient<HalObjectTypeResponse>({
      method: 'GET',
      url: endpoint,
      params: queryParameters,
    });
  },

  // SCENARIO IN THE HEADER
  getAllScenarioTypesIds: async () => {
    const { data } = await API_INSTANCE.get<number[]>(
      `object-types/findIdsByScenarioId`,
    );
    return data;
  },

  getOne: async (id: number) => {
    const { data } = await API_INSTANCE.get<ObjectType>(`object-types/${id}`);
    return objectTypeDTO.parse(data);
  },

  getRoots: async () => {
    const { data } = await API_INSTANCE.get<ObjectType[]>('object-types/roots');
    return data.map(element => objectTypeDTO.parse(element));
  },

  getChildren: async (parentId: number) => {
    const { data } = await API_INSTANCE.get<ObjectType[]>(
      `object-types/children/${parentId}`,
    );
    return data.map(element => objectTypeDTO.parse(element));
  },

  create: async (objectType: ObjectTypeForm) => {
    const validObjectType = objectTypeFormDTO.parse(objectType);
    const { data } = await API_INSTANCE.post<ObjectTypeForm>(
      '/object-types',
      validObjectType,
    );
    return objectTypeDTO.parse(data);
  },

  update: async (id: number, objectType: ObjectType) => {
    const validObjectType = objectTypeUpdateFormDTO.parse(objectType);
    const { data } = await API_INSTANCE.put<ObjectType>(
      `object-types/${id}`,
      validObjectType,
    );
    return objectTypeDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`object-types/${id}`);
  },

  assignToScenario: async (assigment: ObjectTypeAssigment) => {
    await API_INSTANCE.post(`object-types/scenario`, assigment);
  },
};
