import { API_INSTANCE } from '@/lib/api';
import {
  AttributeInstanceMapping,
  attributeInstanceObjectMappingDTO,
} from '@/features/attribute/types.ts';

const basePath = 'attributes';

export const attributeInstanceApi = {
  getOne: async (attrtibuteInstanceId: number) => {
    const { data } = await API_INSTANCE.get<AttributeInstanceMapping>(
      `${basePath}/${attrtibuteInstanceId}`,
    );
    return attributeInstanceObjectMappingDTO.parse(data);
  },
};
