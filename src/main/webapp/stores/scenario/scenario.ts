/*
// noinspection t

import { QdsScenario } from '@/models/scenario/entity';
import { QdsThread } from '@/models/thread/entity';
import { faker } from '@faker-js/faker/locale/pl';
import { create } from 'zustand';
import { produce } from 'immer';
import { useScenario } from '@/models/scenario/queries';

interface ScenarioStore {
  scenarioStatus: DataStatus<QdsScenario>;
  fetchScenario: (id: number) => Promise<void>;

  updateScenario: (updates: Partial<QdsScenario>) => void;
  addThread: (thread: QdsThread) => void;
  updateThread: (threadId: number, updates: Partial<QdsThread>) => void;
  removeThread: (threadId: number) => void;
}

const generateMockScenario = (): QdsScenario => ({
  id: faker.number.int(),
  information: {
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    context: faker.lorem.paragraph(),
  },
  startDate: new Date(2018, 1, 1, 0, 0),
  endDate: new Date(2018, 1, 1, 12, 0),
  actionDuration: 10,
  purpose: faker.lorem.words(),

  associations: [],
  objects: [],
  objectTypes: [],
  objectTemplates: [],
  permissions: [],
  observers: [],
  history: [],
  phases: [],
  threads: [],
});

// TODO replace when API is ready
const fetchScenarioFromAPI = async (_: string): Promise<QdsScenario> => {
  await new Promise(resolve => window.setTimeout(resolve, 1000));
  return generateMockScenario();
};

const useScenarioStore = create<ScenarioStore>(set => ({
  scenarioStatus: { status: 'loading' },
  fetchScenario: async (id: number) => {
    set({ scenarioStatus: { status: 'loading' } });
    try {
      const scenario = await useScenario(id).data;
      set({ scenarioStatus: { status: 'success', data: scenario } });
    } catch (error) {
      set({
        scenarioStatus: { status: 'error', error: (error as Error).message },
      });
    }
  },

  updateScenario: updates =>
    set(
      produce((state: ScenarioStore) => {
        if (state.scenarioStatus.status === 'success') {
          Object.assign(state.scenarioStatus.data, updates);
        }
      }),
    ),

  addThread: thread =>
    set(
      produce((state: ScenarioStore) => {
        if (state.scenarioStatus.status === 'success') {
          state.scenarioStatus.data.threads.push({
            ...thread,
            id: faker.number.int(),
            events: [],
          });
        }
      }),
    ),

  updateThread: (threadId, updates) =>
    set(
      produce((state: ScenarioStore) => {
        if (state.scenarioStatus.status === 'success') {
          const thread = state.scenarioStatus.data.threads.find(
            thread => thread.id === threadId,
          );
          if (thread) Object.assign(thread, updates);
        }
      }),
    ),

  removeThread: threadId =>
    set(
      produce((state: ScenarioStore) => {
        if (state.scenarioStatus.status === 'success') {
          state.scenarioStatus.data.threads =
            state.scenarioStatus.data.threads.filter(
              thread => thread.id !== threadId,
            );
        }
      }),
    ),

  // addEvent: (actionId, event) =>
  //   set(
  //     produce((state: ScenarioStore) => {
  //       if (state.scenarioStatus.status === 'success') {
  //         const thread = state.scenarioStatus.data.threads.find(
  //           a => a.id === actionId,
  //         );
  //         if (thread) {
  //           thread.events.push({ ...event, id: faker.string.uuid() });
  //         }
  //       }
  //     }),
  //   ),
  //
  // updateEvent: (actionId, eventId, updates) =>
  //   set(
  //     produce((state: ScenarioStore) => {
  //       if (state.scenarioStatus.status === 'success') {
  //         const thread = state.scenarioStatus.data.threads.find(
  //           a => a.id === actionId,
  //         );
  //         if (thread) {
  //           const event = thread.events.find(event => event.id === eventId);
  //           if (event) Object.assign(event, updates);
  //         }
  //       }
  //     }),
  //   ),
  //
  // removeEvent: (actionId, eventId) =>
  //   set(
  //     produce((state: ScenarioStore) => {
  //       if (state.scenarioStatus.status === 'success') {
  //         const thread = state.scenarioStatus.data.threads.find(
  //           a => a.id === actionId,
  //         );
  //         if (thread) {
  //           thread.events = thread.events.filter(event => event.id !== eventId);
  //         }
  //       }
  //     }),
  //   ),
}));

export default useScenarioStore;

export const getLoadedScenarioData = (): QdsScenario | undefined => {
  return useScenarioStore(state =>
    state.scenarioStatus.status === 'success'
      ? state.scenarioStatus.data
      : undefined,
  );
};
*/
