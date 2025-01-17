import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import React, { useMemo } from 'react';
import { ActionItem } from '@/lib/actions/types.ts';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import { AttributeActionsContext } from '@/features/attribute/components/attribute-object-setter';

const useInitialAttributeTemplateActions =
  (): ActionItem<AttributeTemplate>[] => {
    const { open, close } = useDialog();
    const context = React.useContext(AttributeActionsContext);
    if (!context)
      throw new Error(
        'useInitialAttributeTemplateActions must be used within AttributeActionsContext',
      );
    const { setLocalAttributes } = context;

    return useMemo(
      () => [
        // {
        //   label: 'Edit attribute',
        //   Icon: PencilRuler,
        //   variant: 'default',
        //   onClick: (attribute: AttributeTemplate) => {
        //     // eslint-disable-next-line -- needed for declaration
        //     const handleSubmit = async (data: AttributeTemplate) => {
        //       const instanceForm: AttributeInstanceForm = {
        //         id: null,
        //         attributeTemplateId: attribute.id,
        //         initialValue: data.defaultValue,
        //       };
        //
        //       setLocalAttributes(previous =>
        //         previous.map(attribute_ =>
        //           attribute_.attributeTemplateId === attribute.id
        //             ? instanceForm
        //             : attribute_,
        //         ),
        //       );
        //       close();
        //     };
        //
        //     open({
        //       type: 'form',
        //       title: 'Edit default value',
        //       schema: attributeTemplateDTO,
        //       data: attribute,
        //       renderForm: methods => {
        //         return (
        //           <AttributeForm
        //             methods={methods}
        //             attribute={attribute}
        //             onSubmit={handleSubmit}
        //           />
        //         );
        //       },
        //       onSubmit: handleSubmit,
        //     });
        //   },
        // },
      ],
      [open, close, setLocalAttributes],
    );
  };

export default useInitialAttributeTemplateActions;
