import { ActionItem } from '@/lib/actions/types.ts';
import {
  AttributeTemplate,
  attributeTemplateDTO,
} from '@/features/attribute-template/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import {
  useGlobalDeleteAttributeTemplate,
  useUpdateAttributeTemplate,
} from '@/features/attribute-template/queries.ts';
import { useMemo } from 'react';
import { PencilRuler, Trash2 } from 'lucide-react';
import AttributeForm from '@/features/attribute/components/attribute-card-value/attribute-form.tsx';

const useGlobalAttributeTemplateActions =
  (): ActionItem<AttributeTemplate>[] => {
    const { open, close } = useDialog();
    const { mutateAsync: deleteElement } = useGlobalDeleteAttributeTemplate();
    const { mutateAsync: updateElement } = useUpdateAttributeTemplate();

    return useMemo(
      () => [
        {
          label: 'Edit attribute',
          Icon: PencilRuler,
          variant: 'default',
          onClick: (attribute: AttributeTemplate) => {
            const handleSubmit = async (data: AttributeTemplate) => {
              await updateElement({ id: data.id, attributeTemplate: data });
              close();
            };
            open({
              type: 'form',
              title: 'Edit default value',
              schema: attributeTemplateDTO,
              data: attribute,
              renderForm: methods => {
                return (
                  <AttributeForm
                    methods={methods}
                    attribute={attribute}
                    onSubmit={handleSubmit}
                  />
                );
              },
              onSubmit: handleSubmit,
            });
          },
        },
        {
          label: 'Delete scenario',
          Icon: Trash2,
          variant: 'destructive',
          onClick: (data: AttributeTemplate) => {
            open({
              type: 'confirm',
              variant: 'destructive',
              title: 'Delete dialog',
              description: `Are you sure you want to delete attribute ${data.name}?`,
              onConfirm: async () => {
                await deleteElement(data.id);
                close();
              },
            });
          },
        },
      ],
      [open, deleteElement, updateElement],
    );
  };

export default useGlobalAttributeTemplateActions;
