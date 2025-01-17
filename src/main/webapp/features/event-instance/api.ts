import { API_INSTANCE } from '@/lib/api';
import {
  EventInstance,
  eventInstanceDTO,
  EventInstanceForm,
  eventInstanceFormDTO,
} from '@/features/event-instance/types.ts';
import { EventState, eventStateDTO } from '@/features/event-state/types.ts';

const endpoint = 'events';

// REQUIRES scenarioId IN HEADER
export const eventApi = {
  getAll: async () => {
    const { data } = await API_INSTANCE.get<EventInstance[]>(endpoint);
    return data.map(element => eventInstanceDTO.parse(element));
  },

  getOne: async (eventId: number) => {
    const { data } = await API_INSTANCE.get<EventInstance>(
      `${endpoint}/${eventId}`,
    );
    return eventInstanceDTO.parse(data);
  },

  getEventState: async (eventId: number) => {
    const { data } = await API_INSTANCE.get<EventState>(
      `${endpoint}/state/${eventId}`,
    );
    return eventStateDTO.parse(data);
  },

  getPreviousEventState: async (eventId: number) => {
    const { data } = await API_INSTANCE.get<EventState>(
      `${endpoint}/previous-state/${eventId}`,
    );
    return eventStateDTO.parse(data);
  },

  getAllFromThread: async (threadId: number) => {
    const { data } = await API_INSTANCE.get<EventInstance[]>(
      `${endpoint}/thread/${threadId}`,
    );
    return data.map(element => eventInstanceDTO.parse(element));
  },

  update: async (id: number, event: EventInstanceForm) => {
    const validEvent = eventInstanceFormDTO.parse(event);
    const { data } = await API_INSTANCE.put<EventInstance>(
      `${endpoint}/${id}`,
      validEvent,
    );
    return eventInstanceDTO.parse(data);
  },
};
