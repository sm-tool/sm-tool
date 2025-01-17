import React from 'react';

type Nullable<T> = T | null | undefined;

const formatTitleParts = (parts: Nullable<string>[], maxLength = 10) => {
  return parts
    .filter(
      (part): part is string => typeof part === 'string' && part.length > 0,
    )
    .map(part =>
      part.length > maxLength ? `${part.slice(0, maxLength)}...` : part,
    )
    .join(' | ');
};
export const useDocumentTitle = (titles: Nullable<string>[]) => {
  React.useEffect(() => {
    document.title = formatTitleParts(['SMT', ...titles]);
  }, [titles]);
};
