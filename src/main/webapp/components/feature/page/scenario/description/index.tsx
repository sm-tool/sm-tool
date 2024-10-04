import { useScenario } from '@/models/scenario/queries';
import { qdsScenarioSchema } from '@/models/scenario/entity';
import { PencilRuler } from 'lucide-react';
import EditFormItemButton from '@/components/feature/page/scenario/form-tabs/edit-form-item-button';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className='mb-12 border-b pb-2 text-center text-2xl font-bold'>
    {title}
  </h2>
);

export const LabeledSection = ({
  subtitle,
  content,
}: {
  subtitle: string;
  content: string;
}) => (
  <div>
    <p className={'mb-1 inline-block w-auto px-2 text-sm text-default-500'}>
      {subtitle}
    </p>
    <p
      className={`mb-12 hyphens-auto border-l-4 border-primary-400 bg-default-200 px-2
        text-justify leading-relaxed tracking-wide shadow-md`}
    >
      {content}
    </p>
  </div>
);

const ScenarioDescription = () => {
  const { data: scenario } = useScenario();
  const statusComponent = <StatusComponent useQuery={useScenario} />;
  if (scenario === undefined) return statusComponent;

  return (
    <div className='relative h-full w-full'>
      <EditFormItemButton schema={qdsScenarioSchema} data={scenario} asChild>
        <div className='absolute left-0 top-0'>
          <PencilRuler className='h-4 w-4' />
        </div>
      </EditFormItemButton>
      <SectionTitle title={scenario.title} />
      <LabeledSection
        subtitle={`Purpose of the scenario`}
        content={scenario.purposeTitle.purpose}
      />
      <LabeledSection subtitle={'Description'} content={scenario.description} />
      {/* TODO OBJECTIVES */}
      <LabeledSection subtitle={'Context'} content={scenario.context} />
      <SectionTitle title={'Phases'} />
      <SectionTitle title={'Roles'} />
    </div>
  );
};

export default ScenarioDescription;
