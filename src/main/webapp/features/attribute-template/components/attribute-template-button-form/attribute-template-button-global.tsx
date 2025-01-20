import React from 'react';
import {
  useAllTemplateAttributes,
  useCreateAttributeTemplateOnGlobalPage,
} from '@/features/attribute-template/queries.ts';
import { AttributeFormLocal } from '@/features/attribute-template/components/attribute-template-button-form/attribute-template-button-form.tsx';

const AttributeTemplateButtonGlobalForm = ({
  objectTemplateId,
}: {
  objectTemplateId: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const createAttributeTemplate = useCreateAttributeTemplateOnGlobalPage();
  const { data: attributes, isLoading } =
    useAllTemplateAttributes(objectTemplateId);

  if (isLoading) return;

  return (
    <AttributeFormLocal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      objectTemplateId={objectTemplateId}
      onSubmit={async data => {
        await createAttributeTemplate.mutateAsync(data);
        setIsOpen(false);
      }}
      attributes={attributes}
    />
  );
};

export default AttributeTemplateButtonGlobalForm;
