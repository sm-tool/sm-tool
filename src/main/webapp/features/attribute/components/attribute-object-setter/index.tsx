import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { AttributeInstanceForm } from '@/features/attribute/types.ts';
import { useAllTemplateAttributes } from '@/features/attribute-template/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import AttributeCardInitialValue from '@/features/attribute/components/attribute-object-setter/attribute-card-initial-value';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';

interface AttributeObjectSetterPropertoes {
  templateId: number;
  value?: AttributeInstanceForm[];
  onChange: (value: AttributeInstanceForm[]) => void;
}

export const AttributeActionsContext = React.createContext<{
  setLocalAttributes: React.Dispatch<
    React.SetStateAction<AttributeInstanceForm[]>
  >;
} | null>(null);

const AttributeObjectSetter = ({
  templateId,
  value,
  onChange,
}: AttributeObjectSetterPropertoes) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const defaultAttributes = useAllTemplateAttributes(templateId);
  const [localAttributes, setLocalAttributes] = React.useState<
    AttributeInstanceForm[]
  >([]);

  React.useEffect(() => {
    // if (defaultAttributes.data && !value) {
    //   const initialAttributes = defaultAttributes.data.map(attribute => ({
    //     id: null,
    //     attributeTemplateId: attribute.id,
    //     initialValue: attribute.defaultValue,
    //   }));
    //   setLocalAttributes(initialAttributes);
    //   handleSelect(initialAttributes);
    // } else if (defaultAttributes.data && value) {
    //   setLocalAttributes(value);
    // }
  }, [defaultAttributes.data, value]);

  const handleSelect = (item: AttributeInstanceForm[]) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <DialogWrapper>
      <AttributeActionsContext.Provider value={{ setLocalAttributes }}>
        <StatusComponent useQuery={defaultAttributes}>
          {templateAttributes => (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' className='w-full'>
                  Handle object&#39;s attributes
                  <br />
                  {localAttributes.length > 0
                    ? `${localAttributes.length} attributes set`
                    : 'attributes not set'}
                </Button>
              </DialogTrigger>
              <DialogContent className='w-[60vw] h-[60vh] flex flex-col'>
                <DialogHeader>
                  <DialogTitle>Manage object&#39;s attributes</DialogTitle>
                </DialogHeader>
                <ScrollArea className='py-4 flex-grow @container'>
                  <div className='grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4'>
                    {templateAttributes!.map(attribute => (
                      <AttributeCardInitialValue
                        key={attribute.id}
                        attributeTemplate={attribute}
                        attributeInstance={
                          localAttributes.find(
                            la => la.attributeTemplateId === attribute.id,
                          )!
                        }
                      />
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter className='gap-2'>
                  <Button variant='outline' onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSelect(localAttributes)}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </StatusComponent>
      </AttributeActionsContext.Provider>
    </DialogWrapper>
  );
};

export default AttributeObjectSetter;
