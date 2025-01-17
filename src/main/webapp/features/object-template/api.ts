import { HalPaginatedResponse } from '@/lib/api/types/response.types.ts';
import {
  ObjectTemplate,
  objectTemplateDTO,
  ObjectTemplateForm,
  objectTemplateFormDTO,
} from '@/features/object-template/types.ts';
import { QueryRequest } from '@/lib/hal-pagination/types/pagination.types.ts';
import { API_INSTANCE, apiClient } from '@/lib/api';

export type ObjectTemplateApiFilterMethods =
  | 'findByTitle'
  | 'findByDescription';

export type HalObjectTemplateResponse = HalPaginatedResponse<
  ObjectTemplate,
  'qdsObjectTemplates'
>;

export type ObjectTemplateRequest = QueryRequest<
  ObjectTemplate,
  ObjectTemplateApiFilterMethods
>;

const basePath = 'object-templates';

export const objectTemplateApi = {
  getAll: async (
    request?: ObjectTemplateRequest,
  ): Promise<HalObjectTemplateResponse> => {
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
      queryParameters[
        request.filter.searchType === 'findByTitle' ? 'title' : 'description'
      ] = request.filter.searchValue;
    }

    return apiClient<HalObjectTemplateResponse>({
      method: 'GET',
      url: endpoint,
      params: queryParameters,
    });
  },

  getOne: async (id: number) => {
    const { data } = await API_INSTANCE.get<ObjectTemplate>(
      `${basePath}/${id}`,
    );
    return objectTemplateDTO.parse(data);
  },

  // REQUIRES SCENARIOID IN THE HEADER
  getAllByScenarioAndObjectTypeId: async (
    objectTypeId: number,
    request?: ObjectTemplateRequest,
  ) => {
    let endpoint = basePath;
    const queryParameters: Record<string, string | number> = {};

    if (request?.pagination) {
      queryParameters.page = request.pagination.page;
      queryParameters.size = request.pagination.size;
    }

    return apiClient<HalObjectTemplateResponse>({
      method: 'GET',
      url: `${endpoint}/search/findByScenarioIdAndObjectTypeId/${objectTypeId}`,
      params: queryParameters,
    });
  },

  getRoots: async () => {
    const { data } = await API_INSTANCE.get<ObjectTemplate[]>(
      `${basePath}/roots`,
    );
    return data.map(element => objectTemplateDTO.parse(element));
  },

  getChildren: async (parentId: number) => {
    const { data } = await API_INSTANCE.get<ObjectTemplate[]>(
      `${basePath}/children/${parentId}`,
    );
    return data.map(element => objectTemplateDTO.parse(element));
  },

  create: async (objectTemplate: ObjectTemplateForm) => {
    const validobjectTemplate = objectTemplateFormDTO.parse(objectTemplate);
    const { data } = await API_INSTANCE.post<ObjectTemplateForm>(
      `/${basePath}`,
      validobjectTemplate,
    );
    return objectTemplateFormDTO.parse(data);
  },

  update: async (id: number, objectTemplate: ObjectTemplate) => {
    const validobjectTemplate = objectTemplateDTO.parse(objectTemplate);
    const { data } = await API_INSTANCE.put<ObjectTemplate>(
      `${basePath}/${id}`,
      validobjectTemplate,
    );
    return objectTemplateDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`${basePath}/${id}`);
  },
};
