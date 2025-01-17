import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import { API_INSTANCE, apiClient } from '@/lib/api';
import {
  AssociationType,
  AssociationTypeApiFilterMethods,
  AssociationTypeCreateForm,
  associationTypeCreateFormDTO,
  associationTypeDTO,
  AssociationTypeUpdateForm,
  associationTypeUpdateFormDTO,
} from '@/features/association-type/types.ts';
import { AppError, ErrorLevel } from '@/lib/errors/errors.ts';

export type HalAssociationTypeResponse = HalPaginatedResponse<
  AssociationType,
  'qdsAssociationTypes'
>;

export type HalAssociationTypeByIdResponse = HalPaginatedResponse<
  AssociationType,
  'associationTypes'
>;
export type AssociationTypeByIdRequest =
  | 'findByFirstObjectTypeId'
  | 'findBySecondObjectTypeId';

export type AssociationTypeRequest = QueryRequest<
  AssociationType,
  AssociationTypeApiFilterMethods
>;

const basePath = 'association-types';

export const associationTypeApi = {
  getAll: async (
    request?: AssociationTypeRequest,
  ): Promise<HalAssociationTypeResponse> => {
    let endpoint = basePath;
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
      endpoint = `/${basePath}/search/${request.filter.searchType}`;
      queryParameters['description'] = request.filter.searchValue;
    }

    return apiClient<HalAssociationTypeResponse>({
      method: 'GET',
      url: endpoint,
      params: queryParameters,
    });
  },

  getAllByXIdPaginated: (
    id: number,
    request?: QueryRequest<AssociationType, AssociationTypeByIdRequest>,
  ): Promise<HalAssociationTypeByIdResponse> => {
    let endpoint = basePath;
    if (!request?.filter) {
      throw new AppError('Search method is required', ErrorLevel.ERROR);
    }

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

    endpoint = `/${basePath}/search/${request.filter.searchType}`;
    queryParameters['typeId'] = id;

    return apiClient<HalAssociationTypeByIdResponse>({
      method: 'GET',
      url: endpoint,
      params: queryParameters,
    });
  },

  getAllByObjectsBy1Id: async (id: number) => {
    const { data } = await API_INSTANCE.get<AssociationType[]>(
      `${basePath}/scenario/first-type/${id}`,
    );
    return data.map(element => associationTypeDTO.parse(element));
  },

  getAllByObjectsBy2Id: async (id: number) => {
    const { data } = await API_INSTANCE.get<AssociationType[]>(
      `${basePath}/scenario/second-type/${id}`,
    );
    return data.map(element => associationTypeDTO.parse(element));
  },

  getOne: async (id: number) => {
    const { data } = await API_INSTANCE.get<AssociationType>(
      `${basePath}/${id}`,
    );
    return associationTypeDTO.parse(data);
  },

  create: async (objectTemplate: AssociationTypeCreateForm) => {
    const validobjectTemplate =
      associationTypeCreateFormDTO.parse(objectTemplate);
    const { data } = await API_INSTANCE.post<AssociationTypeCreateForm>(
      `/${basePath}`,
      validobjectTemplate,
    );
    return associationTypeDTO.parse(data);
  },

  update: async (id: number, objectTemplate: AssociationTypeUpdateForm) => {
    const validobjectTemplate =
      associationTypeUpdateFormDTO.parse(objectTemplate);
    const { data } = await API_INSTANCE.put<AssociationTypeUpdateForm>(
      `${basePath}/${id}`,
      validobjectTemplate,
    );
    return associationTypeDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`${basePath}/${id}`);
  },
};
