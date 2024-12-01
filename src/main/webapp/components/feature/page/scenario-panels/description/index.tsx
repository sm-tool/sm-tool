// const SectionTitle = ({ title }: { title: string }) => (
//   <h2 className='mb-12 border-b pb-2 text-center text-2xl font-bold'>
//     {title}
//   </h2>
// );

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
  return <></>;
  // const { data: scenario } = useScenario();
  // const statusComponent = <StatusComponent useQuery={useScenario} />;
  // if (scenario === undefined) return statusComponent;
  //
  // return (
  //   <ScrollArea className='relative h-svh w-full'>
  //     <SectionTitle title={scenario.title} />
  //     <LabeledSection
  //       subtitle={`Purpose of the scenario`}
  //       content={scenario.purposeTitle.purpose}
  //     />
  //     <LabeledSection subtitle={'Description'} content={scenario.description} />
  //     <LabeledSection subtitle={'Context'} content={scenario.context} />
  //     <SectionTitle title={'Phases'} />
  //     <SectionTitle title={'Roles'} />
  //     <ScrollBar />
  //   </ScrollArea>
  // );
};

export default ScenarioDescription;
