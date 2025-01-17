import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/shadcn/accordition.tsx';
import React from 'react';
import ScenarioDesriptionScenarioProperties from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/scenario-desription-scenario-properties.tsx';
import ScenarioDescriptionPhases from './scenario-description-phases.tsx';

const SectionWithContent = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <div className='flex-1 flex justify-center text-2xl font-bold'>
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
};

const ScenarioDescription = () => {
  return (
    <div className='h-svh overflow-y-auto w-full'>
      <Accordion
        type='multiple'
        defaultValue={['Scenario Properties', 'Phases']}
        className='w-full'
      >
        <SectionWithContent title='Scenario Properties'>
          <ScenarioDesriptionScenarioProperties />
        </SectionWithContent>

        <SectionWithContent title='Phases'>
          <ScenarioDescriptionPhases />
        </SectionWithContent>
      </Accordion>
    </div>
  );
};

export default ScenarioDescription;
