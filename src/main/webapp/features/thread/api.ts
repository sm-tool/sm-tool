import { API_INSTANCE } from '@/lib/api';
import {
  Thread,
  threadDTO,
  ThreadForm,
  threadFormDTO,
  ThreadOffsetForm,
} from '@/features/thread/types.ts';

const endpoint = 'threads';

// REQUIRES scenarioId IN HEADER
export const threadApi = {
  offset: async (threadOffset: ThreadOffsetForm) => {
    return await API_INSTANCE.post<ThreadOffsetForm>(
      `${endpoint}/shift/${threadOffset.threadId}`,
      threadOffset,
    );
  },

  getAll: async () => {
    const { data } = await API_INSTANCE.get<Thread[]>(endpoint);
    return data.map(element => threadDTO.parse(element));
  },

  detail: async (threadId: number) => {
    const { data } = await API_INSTANCE.get<Thread>(`${endpoint}/${threadId}`);
    return threadDTO.parse(data);
  },

  create: async (thread: ThreadForm) => {
    const validThread = threadFormDTO.parse(thread);
    const { data } = await API_INSTANCE.post<ThreadForm>(endpoint, validThread);
    return threadDTO.parse(data);
  },

  update: async (id: number, thread: Thread) => {
    const validThread = threadDTO.parse(thread);
    const { data } = await API_INSTANCE.put<Thread>(
      `${endpoint}/${id}`,
      validThread,
    );
    return threadDTO.parse(data);
  },

  delete: async (id: number) => {
    return await API_INSTANCE.delete<Thread>(`${endpoint}/${id}`);
  },
};
