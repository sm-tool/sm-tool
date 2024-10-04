import { z } from 'zod';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface FormState {
  id: string;
  schema: z.ZodObject<z.ZodRawShape>;
  data: unknown;
  isSubmitting: boolean;
}

interface FormStore {
  forms: Record<string, FormState>;
  activeFormId: string | undefined;
  setActiveForm: (id: string) => void;
  addForm: (form: FormState) => void;
  updateForm: (id: string, data: unknown) => void;
  createEditForm: (schema: z.ZodObject<z.ZodRawShape>, data: unknown) => void;
}

const useFormStore = create<FormStore>()(
  immer(set => ({
    forms: {},
    activeFormId: undefined,
    setActiveForm: id =>
      set(state => {
        state.activeFormId = id;
      }),
    addForm: form =>
      set(state => {
        state.forms[form.id] = form;
        state.activeFormId = form.id;
      }),
    updateForm: (id, data) =>
      set(state => {
        if (state.forms[id]) {
          state.forms[id].data = data;
        }
      }),
    createEditForm: (schema, data) =>
      set(state => {
        const newFormId = `Edit-${(data as { id: string }).id}`;
        state.forms[newFormId] = {
          id: newFormId,
          schema: schema,
          data: data,
          isSubmitting: false,
        };
        state.activeFormId = newFormId;
      }),
  })),
);

export default useFormStore;
