import { API_INSTANCE } from '@/lib/api';
import {
  AttributeTemplate,
  attributeTemplateDTO,
  attributeTemplateFormDTO,
  AttributeTemplateFormType,
} from '@/features/attribute-template/types.ts';

const basePath = 'attribute-templates';

export const attributeTemplateApi = {
  getAllofTemplate: async (templateId: number) => {
    const { data } = await API_INSTANCE.get<AttributeTemplate[]>(
      `${basePath}/template/${templateId}`,
    );
    return data.map(d => attributeTemplateDTO.parse(d));
  },

  getOne: async (id: number) => {
    const { data } = await API_INSTANCE.get<AttributeTemplate>(
      `${basePath}/${id}`,
    );
    return attributeTemplateDTO.parse(data);
  },

  create: async (attributeTemplate: AttributeTemplateFormType) => {
    const validobjectTemplate =
      attributeTemplateFormDTO.parse(attributeTemplate);
    const { data } = await API_INSTANCE.post<AttributeTemplateFormType>(
      `/${basePath}`,
      validobjectTemplate,
    );
    return attributeTemplateDTO.parse(data);
  },

  update: async (id: number, attributeTemplate: AttributeTemplate) => {
    const validobjectTemplate = attributeTemplateDTO.parse(attributeTemplate);
    const { data } = await API_INSTANCE.put<AttributeTemplate>(
      `${basePath}/${id}`,
      validobjectTemplate,
    );
    return attributeTemplateDTO.parse(data);
  },

  delete: async (id: number) => {
    await API_INSTANCE.delete(`${basePath}/${id}`);
  },
};
