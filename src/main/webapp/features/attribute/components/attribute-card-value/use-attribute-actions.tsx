import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useUpdateAttributeTemplate } from '@/features/attribute-template/queries.ts';
import { useMemo } from 'react';
import { PencilRuler } from 'lucide-react';
import { ActionItem } from '@/lib/actions/types.ts';
import AttributeForm from '@/features/attribute/components/attribute-card-value/attribute-form.tsx';
import {
  AttributeTemplate,
  attributeTemplateDTO,
} from '@/features/attribute-template/types.ts';

const useAttributeTemplateActions = (): ActionItem<AttributeTemplate>[] => {
  const { open, close } = useDialog();
  const { mutateAsync } = useUpdateAttributeTemplate();
  return useMemo(
    () => [
      {
        label: 'Edit attribute',
        Icon: PencilRuler,
        variant: 'default',
        onClick: (attribute: AttributeTemplate) => {
          const handleSubmit = async (data: AttributeTemplate) => {
            await mutateAsync({ id: data.id, attributeTemplate: data });
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
    ],
    [open, mutateAsync],
  );
};

export default useAttributeTemplateActions;
