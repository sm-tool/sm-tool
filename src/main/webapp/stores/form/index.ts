import { z } from 'zod';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type DataType = { id: number } & Record<string, unknown>;

interface FormState {
  id: string;
  schema: z.ZodObject<z.ZodRawShape>;
  data: DataType;
  isSubmitting: boolean;
  // Pomyśl, czy nie dodać isDisabled na state dirty
}

interface FormStore {
  forms: Record<string, FormState>;
  activeFormId: string | undefined;
  setActiveForm: (id: string) => void;
  addForm: (form: FormState) => void;
  updateForm: (id: string, data: DataType) => void;
  // postForm: (id: string, data: DataType) => void;
  createEditForm: (schema: z.ZodObject<z.ZodRawShape>, data: DataType) => void;
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
        const newFormId = `edit of ${data.id}`;
        state.forms[newFormId] = {
          id: newFormId,
          schema: schema,
          data: data,
          isSubmitting: false,
        };
        state.activeFormId = newFormId;
      }),
    // postForm: async (id, data) =>
    //   set(state => {
    //     state.forms[id].isSubmitting = true;
    //     const queryClient = useQueryClient();
    //     const mutation = useMutation({
    //       mutationFn: async (formData: DataType) => {
    //         const response = await axios.post('/');
    //       },
    //     });
    //   }),
  })),
);

export default useFormStore;
