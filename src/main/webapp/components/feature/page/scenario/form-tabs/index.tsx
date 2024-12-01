import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs';
import useFormStore from '@/stores/form';
import { FilePenLine } from 'lucide-react';
import React from 'react';

const FormTabs: React.FC = () => {
  const { forms, activeFormId, setActiveForm } = useFormStore();
  const formEntries = Object.entries(forms);

  return (
    <Tabs
      value={activeFormId || undefined}
      onValueChange={setActiveForm}
      className='flex h-full w-full flex-col'
    >
      <div className='sticky bg-content2 shadow-md ml-16 rounded-bl-2xl h-12'>
        <ScrollArea className='w-full overflow-hidden'>
          <ScrollBar orientation='horizontal' className='h-4' />
          <TabsList className='inline-flex w-full h-[inherit] p-0'>
            {formEntries.map(([id, form]) => (
              <TabsTrigger
                data-state={activeFormId === id ? 'active' : undefined}
                key={id}
                value={id}
                className='text-sm rounded-none transition-all bg-content1 hover:bg-content4 h-12 py-0
                  hover:text-content4-foreground data-[state=active]:border-b-2 border-primary-400
                  data-[state=active]:shadow-xl'
              >
                Form {form.id}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </div>

      <div className='flex-grow overflow-auto'>
        {activeFormId ? (
          formEntries.map(([id]) => (
            <TabsContent key={id} value={id} className='mt-0 h-full'>
              <ScrollArea className='h-full w-full p-6'>
                {/*<AutoForm*/}
                {/*  formSchema={form.schema}*/}
                {/*  values={form.data}*/}
                {/*  onSubmit={() => updateForm(id, form.data)}*/}
                {/*  fieldConfig={{*/}
                {/*    color: {*/}
                {/*      fieldType: 'color',*/}
                {/*    },*/}
                {/*  }}*/}
                {/*>*/}
                {/*  <AutoFormSubmit disabled={form.isSubmitting}>*/}
                {/*    Submit*/}
                {/*  </AutoFormSubmit>*/}
                {/*</AutoForm>*/}
                <ScrollBar orientation='vertical' />
              </ScrollArea>
            </TabsContent>
          ))
        ) : (
          <div className='flex h-full flex-col justify-center items-center'>
            <FilePenLine className='h-24 w-24 stroke-muted-foreground' />
            <p className='pt-4 text-muted-foreground'>
              Choose an element to edit or create
            </p>
          </div>
        )}
      </div>
    </Tabs>
  );
};

export default FormTabs;
