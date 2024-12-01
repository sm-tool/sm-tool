import { z } from 'zod';
import { create } from 'zustand';

export const qdsSelectablesSchema = z
  .object({
    id: z.number(),
  })
  .and(z.record(z.string(), z.unknown()))
  .optional();
export type QdsSelectables = z.infer<typeof qdsSelectablesSchema>;

interface InterfaceStore {
  scenarioId: number | undefined;
  setScenarioId: (id: number) => void;
  selectedElement: QdsSelectables;
  setSelectedElement: (element: QdsSelectables) => void;
}

const useInterfaceStore = create<InterfaceStore>(set => ({
  scenarioId: 1,
  setScenarioId: id => set({ scenarioId: id }),

  selectedElement: undefined,
  setSelectedElement: (element: QdsSelectables) =>
    set({ selectedElement: element }),
}));

export default useInterfaceStore;
