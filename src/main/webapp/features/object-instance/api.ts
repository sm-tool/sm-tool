import { API_INSTANCE } from '@/lib/api';
import {
  ObjectInstance,
  objectInstanceDTO,
  ObjectInstanceForm,
  objectInstanceFormDTO,
  ObjectInstanceOfThread,
  objectInstancePossibleAssociationQueryOnThreadDTO,
  ObjectIntancePossibleAssociationOnThread,
  ObjectIntancePossibleAssociationOnThreadForm,
} from '@/features/object-instance/types.ts';

const endpoint = 'objects';

// REQUIRES scenarioId IN HEADER
export const objectInstanceApi = {
  getAll: async () => {
    const { data } = await API_INSTANCE.get<ObjectInstance[]>(endpoint);
    return data.map(element => objectInstanceDTO.parse(element));
  },

  getAllOfThread: async (threadId: number) => {
    const { data } = await API_INSTANCE.get<ObjectInstanceOfThread>(
      `${endpoint}/thread/${threadId}`,
    );
    return {
      global: data.global.map(object => objectInstanceDTO.parse(object)),
      local: data.local.map(object => objectInstanceDTO.parse(object)),
    };
  },

  detail: async (id: number) => {
    const { data } = await API_INSTANCE.get<ObjectInstance>(
      `${endpoint}/${id}`,
    );
    return objectInstanceDTO.parse(data);
  },

  objectInstancePossibleAssociation: async (
    objectPossibleAssociation: ObjectIntancePossibleAssociationOnThreadForm,
  ) => {
    const { data } = await API_INSTANCE.post<
      ObjectIntancePossibleAssociationOnThread[]
    >(`${endpoint}/association`, objectPossibleAssociation);
    return data.map(possible =>
      objectInstancePossibleAssociationQueryOnThreadDTO.parse(possible),
    );
  },

  create: async (objectIntance: ObjectInstanceForm) => {
    const validObjectInstance = objectInstanceFormDTO.parse(objectIntance);
    const { data } = await API_INSTANCE.post<ObjectInstanceForm>(
      endpoint,
      validObjectInstance,
    );
    return objectInstanceDTO.parse(data);
  },

  update: async (id: number, objectInstance: ObjectInstance) => {
    const validObjectInstance = objectInstanceDTO.parse(objectInstance);
    const { data } = await API_INSTANCE.put<ObjectInstance>(
      `${endpoint}/${id}`,
      validObjectInstance,
    );
    return objectInstanceDTO.parse(data);
  },

  delete: async (id: number) => {
    return await API_INSTANCE.delete<ObjectInstance>(`${endpoint}/${id}`);
  },
};
