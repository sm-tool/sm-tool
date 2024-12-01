import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';
import { Scrollbar } from '@radix-ui/react-scroll-area';

const ScenarioPanelTemplates = () => {
  // TODO LOAD DATA FROM STORE
  // const { templates } = useUserScenario();

  return (
    <ScrollArea className='h-svh w-full flex flex-col gap-4'>
      <h2 className='mb-12 border-b pb-2 text-center text-2xl font-bold'>
        Scenario templates
      </h2>
      {/*{templates.map((template, key) => (*/}
      {/*  <ScenarioTemplateHighlight*/}
      {/*    template={template}*/}
      {/*    key={key}*/}
      {/*    className='h-16'*/}
      {/*  />*/}
      {/*))}*/}
      <Scrollbar />
    </ScrollArea>
  );
};

export default ScenarioPanelTemplates;
