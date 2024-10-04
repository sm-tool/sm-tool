import { UseQueryResult } from '@tanstack/react-query';

import LoadingLogo from '@/components/ui/common/data-load-states/loading-logo';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';

interface StatusComponentProperties<T> {
  useQuery: () => UseQueryResult<T, unknown>;
}

const StatusComponent = <T,>({
  useQuery,
}: StatusComponentProperties<T>): React.ReactElement | undefined => {
  const { isLoading, isError, error } = useQuery();

  if (isLoading) return <LoadingLogo />;
  if (isError) {
    return <ErrorComponent error={error as Error} />;
  }
  return;
};

export default StatusComponent;
