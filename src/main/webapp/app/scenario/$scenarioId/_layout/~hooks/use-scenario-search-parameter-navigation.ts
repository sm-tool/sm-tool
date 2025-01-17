import {
  NavigateOptions,
  useLocation,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';

const useScenarioSearchParameterNavigation = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams({ strict: false });
  const search = useSearch({
    strict: false,
  });

  const location = useLocation();
  const currentPath = location.pathname;

  const navigateRelative = (
    newValue: string,
    navigateOptions?: Omit<NavigateOptions, 'to'>,
  ) => {
    void navigate({
      // @ts-expect-error -- oszalał mimo że blokuje mu wszystko
      to: currentPath,
      params: { scenarioId },
      search: {
        ...search,
        ['left']: newValue,
      },
      ...navigateOptions,
    });
  };

  const clear = () => {
    void navigate({
      to: currentPath,
      params: { scenarioId },
    });
  };

  return { navigateRelative, clear };
};

export default useScenarioSearchParameterNavigation;
