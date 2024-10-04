import { QdsAssociation } from '@/models/associacion/entity';
import { QdsAttribute } from '@/models/attribute/entity';
import { QdsObject } from '@/models/object/entity';
import { create } from 'zustand';

// TODO uzupełnić
export type QdsSelectables =
  | QdsObject
  | QdsAssociation
  | QdsAttribute
  | undefined;

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
