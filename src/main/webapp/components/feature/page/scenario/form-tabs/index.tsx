import useFormStore from '@/stores/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs';
import { FilePenLine } from 'lucide-react';
import AutoForm from '@/components/ui/shadcn/auto-form';

const FormTabs: React.FC = () => {
  const { forms, activeFormId, updateForm, setActiveForm } = useFormStore();
  const formEntries = Object.entries(forms);

  const handleSubmit = (id: string) => (data: unknown) => updateForm(id, data);

  return (
    <Tabs
      value={activeFormId || undefined}
      onValueChange={setActiveForm}
      className='flex h-full w-full flex-col items-center justify-center'
    >
      <TabsList>
        {formEntries.map(([id, form]) => (
          <TabsTrigger key={id} value={id}>
            Form {form.id}
          </TabsTrigger>
        ))}
      </TabsList>
      {activeFormId ? (
        formEntries.map(([id, form]) => (
          <TabsContent key={id} value={id}>
            <AutoForm
              formSchema={form.schema}
              onSubmit={handleSubmit(id)}
            ></AutoForm>
          </TabsContent>
        ))
      ) : (
        <>
          <FilePenLine className='h-24 w-24 stroke-default-400' />
          <p className='pt-4'>Choose an element to edit or create</p>
        </>
      )}
    </Tabs>
  );
};

export default FormTabs;
