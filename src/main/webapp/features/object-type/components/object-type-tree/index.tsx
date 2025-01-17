import { useObjectTypeRoots } from '@/features/object-type/queries.ts';
import {
  ObjectTypeTreePartial,
  ObjectTypeTreeViewElement,
} from '@/features/object-type/components/object-type-tree/object-type-tree-partial.tsx';
import React, { FormEventHandler } from 'react';
import LoadingSpinner from '@/components/ui/common/data-load-states/loadings/loading-spinner';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import ObjectTypeTreeNode from '@/features/object-type/components/object-type-tree/object-type-tree-node.tsx';

const ObjectTypeTree = ({
  value,
  onChange,
  onCancel,
  globalsBlocked,
}: {
  value?: number;
  onChange?: (value?: number) => void;
  onCancel?: () => void;
  globalsBlocked?: boolean;
}) => {
  const {
    data: rootElements,
    isLoading: isLoadingRoots,
    error,
  } = useObjectTypeRoots();

  const handleChange = React.useCallback(
    (valueOrEvent: number | React.FormEvent<HTMLDivElement>) => {
      if (
        onChange &&
        (typeof valueOrEvent === 'number' || valueOrEvent === undefined)
      ) {
        onChange(valueOrEvent);
      }
    },
    [onChange],
  );

  const mappedElements: ObjectTypeTreeViewElement[] = React.useMemo(
    () =>
      rootElements?.map(object => ({
        object,
        children: undefined,
      })) ?? [],
    [rootElements],
  );

  const getParent = React.useCallback(
    (element: ObjectTypeTreeViewElement) => {
      if (!element.object.parentId) return;
      return mappedElements.find(
        element_ => element_.object.id === element.object.parentId,
      );
    },
    [mappedElements],
  );

  if (isLoadingRoots) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <ObjectTypeTreePartial
      globalsBlocked={globalsBlocked}
      initialSelectedId={value}
      elements={mappedElements}
      onChange={
        handleChange as unknown as ((value?: number) => void) &
          FormEventHandler<HTMLDivElement>
      }
      getParent={getParent}
      className='p-2'
      onCancel={onCancel}
    >
      {mappedElements.map(element => (
        <ObjectTypeTreeNode key={element.object.id} element={element} />
      ))}
    </ObjectTypeTreePartial>
  );
};

export default ObjectTypeTree;
