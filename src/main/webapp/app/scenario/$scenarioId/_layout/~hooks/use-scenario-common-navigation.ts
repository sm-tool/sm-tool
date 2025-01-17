import { useNavigate, useParams, useSearch } from '@tanstack/react-router';

const useScenarioCommonNavigation = () => {
  const navigate = useNavigate();
  const { scenarioId, threadId } = useParams({
    strict: false,
  });
  const search = useSearch({
    // @ts-expect-error -- ts wrongly intercepts the type
    from: '/scenario/$scenarioId',
    strict: false,
  });

  const navigateWithParameters = (path: string) => {
    void navigate({
      to: `/scenario/${scenarioId}/${path}`,
      search: search,
    });
  };

  const navigateWithParametersBetweenEvents = (path: string | number) => {
    navigateWithParameters(`events/${threadId}/${path}`);
  };

  return { navigateWithParameters, navigateWithParametersBetweenEvents };
};

export default useScenarioCommonNavigation;
