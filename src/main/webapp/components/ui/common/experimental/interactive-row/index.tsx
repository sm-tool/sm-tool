import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area';
import { useCallback, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn/table';
import { Button } from '@/components/ui/shadcn/button';

type Attribute = {
  name: string;
  value: string;
};

interface InteractiveRowProperties {
  attributes: Attribute[];
  onChange: (attributes: Attribute[]) => void;
}

export const InteractiveRow = ({
  attributes,
  onChange,
}: InteractiveRowProperties) => {
  const [, setEditingAttribute] = useState<Attribute | undefined>();

  const handleEdit = useCallback((attribute: Attribute) => {
    setEditingAttribute(attribute);
  }, []);
  useCallback(
    (oldAttribute: Attribute, updatedAttribute: Attribute) => {
      const newAttributes = attributes.map(attribute =>
        attribute === oldAttribute ? updatedAttribute : attribute,
      );
      onChange(newAttributes);
      setEditingAttribute(undefined);
    },
    [attributes, onChange],
  );
  const handleDelete = useCallback(
    (attributeToDelete: Attribute) => {
      const newAttributes = attributes.filter(
        attribute => attribute !== attributeToDelete,
      );
      onChange(newAttributes);
    },
    [attributes, onChange],
  );

  const handleAdd = useCallback(() => {
    const newAttribute: Attribute = { name: '', value: '' };
    setEditingAttribute(newAttribute);
  }, []);

  // const handleCloseAttributeSheet = useCallback(() => {
  //   setEditingAttribute(undefined);
  // }, []);

  return (
    <>
      <ScrollArea className='h-[400px]'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className='w-[40px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map(attribute => (
              <TableRow key={attribute.name}>
                <TableCell>{attribute.name}</TableCell>
                <TableCell>{attribute.value}</TableCell>
                <TableCell>
                  <div className='flex justify-end space-x-2'>
                    <Button
                      onClick={() => handleEdit(attribute)}
                      size='icon'
                      variant='ghost'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      onClick={() => handleDelete(attribute)}
                      size='icon'
                      variant='ghost'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <Button onClick={handleAdd} variant='ghost' className='mt-4'>
        <Plus />
      </Button>
      {/* TODO PRZENIEŚĆ DO FORMA*/}
    </>
  );
};
